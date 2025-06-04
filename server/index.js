const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models'); // <-- Sequelize models

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/ai', require('./routes/ai'));
// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Sync Sequelize and start the server
const PORT = process.env.PORT || 5050;

db.sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Error syncing database:', err);
});

