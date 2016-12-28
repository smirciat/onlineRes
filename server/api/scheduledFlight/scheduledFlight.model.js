'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ScheduledFlight', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    smfltnum: DataTypes.INTEGER,
    begin: DataTypes.STRING,
    sovFront: DataTypes.STRING,
    pgmKeb: DataTypes.STRING,
    sovBack: DataTypes.STRING,
    end: DataTypes.STRING,
    effectiveDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  });
}
