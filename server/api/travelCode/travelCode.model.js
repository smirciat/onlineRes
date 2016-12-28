'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('TravelCode', {
    "Travel Code":	DataTypes.STRING(50),	
    "Ref#":	DataTypes.INTEGER,
    "Route":	DataTypes.STRING(50),	
    "LEG1":	DataTypes.CHAR(1),	
    "LEG2":	DataTypes.CHAR(1),	
    "LEG3":	DataTypes.CHAR(1),	
    "NORTH?":	DataTypes.CHAR(1),	
    "Depart":	DataTypes.INTEGER,	
    "Rate":	DataTypes.DECIMAL,	
    "Origin":	DataTypes.STRING(50),
    "Destination":	DataTypes.STRING(50),
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  });
}
