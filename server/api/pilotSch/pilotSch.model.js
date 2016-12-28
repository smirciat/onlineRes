'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('PilotSch', {
    
    Ref:	DataTypes.INTEGER,
    Pilot: 	DataTypes.STRING(50),
    Weight:	DataTypes.INTEGER,
    CurrMonth:	DataTypes.DATE,	
    DaysOff:	DataTypes.INTEGER,
    Quarter:	DataTypes.DOUBLE,	
    '2Quarter':	DataTypes.DOUBLE,	
    YTD:	DataTypes.DOUBLE,	
    'Set Duty On':	DataTypes.DATE,		
    'Set Duty Off': DataTypes.DATE,		
    SetDuty: 	DataTypes.STRING(50),	
    Qual: 	DataTypes.STRING(50),	
    Monday: 	DataTypes.STRING(50),	
    Tuesday: 	DataTypes.STRING(50),	
    Wednesday: 	DataTypes.STRING(50),	
    Thursday: 	DataTypes.STRING(50),	
    Friday: 	DataTypes.STRING(50),	
    Saturday: 	DataTypes.STRING(50),	
    Sunday: 	DataTypes.STRING(50),	
    'E/L': 	DataTypes.STRING(50),	
    lic: 	DataTypes.STRING(255),	
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
  },
  {freezeTableName: true});
}
