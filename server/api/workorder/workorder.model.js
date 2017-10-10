'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Workorder', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    customer: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    aircraft: DataTypes.STRING,
    times: DataTypes.ARRAY(DataTypes.DATE),
    partsUsed: DataTypes.ARRAY(DataTypes.STRING),
    partsCost: DataTypes.ARRAY(DataTypes.FLOAT),
    dateCreated: DataTypes.DATE,
    dateCompleted: DataTypes.DATE,
    workRequested: DataTypes.STRING,
    workPerformed: DataTypes.STRING,
    totalHours: DataTypes.FLOAT,
    laborCost: DataTypes.FLOAT,
    userId: DataTypes.INTEGER
  });
}
