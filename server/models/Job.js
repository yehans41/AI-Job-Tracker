module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define("Job", {
    company: DataTypes.STRING,
    position: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['saved', 'applied', 'interview', 'offer', 'rejected'],
      defaultValue: 'saved',
    },
    date_applied: DataTypes.DATE,
    notes: DataTypes.TEXT,
  });

  Job.associate = models => {
    Job.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Job;
};
