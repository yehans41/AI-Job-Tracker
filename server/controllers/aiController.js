// server/controllers/aiController.js
const { CohereClient } = require('cohere-ai');
const { Job, User } = require('../models');

// Instantiate Cohere client with your CO_API_KEY from `.env`
const cohere = new CohereClient({
  apiKey: process.env.CO_API_KEY,
});

// Debug: confirm the key loaded
console.log(
  'Cohere key (first 6 chars):',
  process.env.CO_API_KEY?.slice(0, 6)
);

async function generateCoverLetter(req, res) {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    // 1) Fetch the job and ensure it belongs to this user
    const job = await Job.findOne({
      where: { id: jobId, user_id: userId },
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // 2) Fetch the user’s email (used here as “name” placeholder)
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 3) Build the prompt
    const prompt = `
You are writing a concise, professional cover letter for ${user.email}, 
a passionate software engineering student, applying to the “[${job.position}]” role at ${job.company}. 
The goal is to highlight their relevant skills and enthusiasm. 
Use this job notes field as additional context: "${job.notes || 'N/A'}"
Keep it to about 200 words, in a friendly but formal tone.
    `.trim();

    // 4) Call Cohere’s generate endpoint with a generate‐compatible model
    const response = await cohere.generate({
      model: 'command-light',
      prompt,
      max_tokens: 350,
      temperature: 0.7,
      k: 0,
      p: 0.75,
      stop_sequences: [],
    });

    // 5) Extract the generated text. Try both possible locations:
    let generations = [];
    if (response.body && response.body.generations) {
      generations = response.body.generations;
    } else if (response.generations) {
      generations = response.generations;
    } else {
      console.error('Cohere response shape unexpected:', response);
      return res
        .status(500)
        .json({ message: 'Cohere returned invalid response shape.' });
    }

    if (!generations.length) {
      return res.status(500).json({ message: 'Cohere returned no text.' });
    }

    const generated = generations[0].text.trim();

    return res.json({ coverLetter: generated });
  } catch (err) {
    console.error('Cohere Error generating cover letter:', err);
    return res
      .status(500)
      .json({ message: 'AI generation failed', error: err.toString() });
  }
}

module.exports = { generateCoverLetter };