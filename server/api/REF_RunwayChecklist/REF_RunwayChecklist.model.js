'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('REFRunwayChecklist', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RunwayID: DataTypes.INTEGER,
    DisplayOrder: DataTypes.INTEGER,
    OptionTypeID: DataTypes.INTEGER,	
    OptionTitle: DataTypes.STRING,
    MatrixID: DataTypes.INTEGER,
    ParameterID: DataTypes.INTEGER,
    MatrixColumnName:DataTypes.STRING,
    CurrentEntry: DataTypes.STRING,
    CurrentEntryID: DataTypes.INTEGER,
    LastUpdated: DataTypes.DATE,
    ClearOnStart: DataTypes.BOOLEAN,	
    Comment: DataTypes.STRING,
    Obsolete: DataTypes.BOOLEAN
  },
  {freezeTableName: true,
    tableName: 'REF_RunwayChecklists'
  });
}
