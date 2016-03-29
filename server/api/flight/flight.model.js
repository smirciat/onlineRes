'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Flight', {
    
    dest: 	DataTypes.STRING(50),
    dname: 	DataTypes.STRING(50),
    "START TIME":	DataTypes.TIME,
    "END TIME":	DataTypes.TIME,	
    "AIRCRAFT":	DataTypes.STRING(50),
    "PILOT":	DataTypes.STRING(50),
    "DATE":	DataTypes.DATE,
    "FLIGHT#":	DataTypes.STRING(50),
    dturn:	DataTypes.CHAR(1),	
    "DEPART":	DataTypes.STRING(50),
    dref:	DataTypes.INTEGER,
    dref1:	DataTypes.STRING(50),	
    "SmFltNum":	DataTypes.STRING(50),
    "PAY TIME":	DataTypes.DECIMAL,
    "ARRIVE":	DataTypes.STRING(50),
    "SEAT1":	DataTypes.INTEGER,
    "SEAT2":	DataTypes.INTEGER,
    "SEAT3":	DataTypes.INTEGER,
    "WEIGHT1":	DataTypes.INTEGER,
    "WEIGHT2":	DataTypes.INTEGER,	
    "WEIGHT3":	DataTypes.INTEGER,	
    section:	DataTypes.INTEGER,	
    "Revenue":	DataTypes.DECIMAL,	
    del:	DataTypes.CHAR(1),
    "Start1":	DataTypes.TIME,	
    "Start2":	DataTypes.TIME,	
    "Start3":	DataTypes.TIME,	
    "Start4":	DataTypes.TIME,	
    "End1": DataTypes.TIME,	
    "End2":	DataTypes.TIME,
    "End3":	DataTypes.TIME,	
    "End4":	DataTypes.TIME,	
    "Route1":	DataTypes.INTEGER,	
    "Route2":	DataTypes.INTEGER,	
    "Route3":	DataTypes.INTEGER,	
    "Route4":	DataTypes.INTEGER,	
    "Last24":	DataTypes.DOUBLE,	
    "DutyTimeOn":	DataTypes.TIME,
    "DutyTimeOff":	DataTypes.TIME,
    "GS":	DataTypes.DOUBLE,	
    "Bear Guide":	DataTypes.DOUBLE,	
    "Remark":	DataTypes.STRING(50),
    "DayLanding":	DataTypes.INTEGER,
    "NightLanding":	DataTypes.INTEGER,	
    "Legs":	DataTypes.INTEGER,	
    "OCF":	DataTypes.DOUBLE,
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {freezeTableName: true,
    tableName: 'FLIGHTS'
  }
  
  );
}
