'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('AllScheduledFlight', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    flightNum: DataTypes.STRING,
    departTime: DataTypes.STRING,
    intermediateTime1: DataTypes.STRING,
    intermediateTime2: DataTypes.STRING,
    intermediateTime3: DataTypes.STRING,
    intermediateTime4: DataTypes.STRING,
    endTime: DataTypes.STRING,
    departLocation: DataTypes.STRING,
    endLocation: DataTypes.STRING,
    intermediateLocation1: DataTypes.STRING,
    intermediateLocation2: DataTypes.STRING,
    intermediateLocation3: DataTypes.STRING,
    intermediateLocation4: DataTypes.STRING,
    effectiveDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    monday: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    tuesday: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    wednesday: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    thursday: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    friday: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    saturday: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    sunday: {
      type: DataTypes.BOOLEAN,
      default: true
    },
  });
}
