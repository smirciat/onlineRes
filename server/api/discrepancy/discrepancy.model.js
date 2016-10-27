'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Discrepancy', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    description: DataTypes.STRING,
    created: DataTypes.DATE,
    status: DataTypes.STRING,
    deferred: DataTypes.DATE,
    resolved: DataTypes.DATE,
    correctiveAction: DataTypes.STRING,
    partUsed: DataTypes.INTEGER
  });
}
