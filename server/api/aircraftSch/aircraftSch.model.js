'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('AircraftSch', {
    Ref:	DataTypes.INTEGER,
    Aircraft:	DataTypes.STRING(50),	
    'Date Available': 	DataTypes.DATE,	
    Type:	DataTypes.STRING(50),	
    Fuel:	DataTypes.INTEGER,
    'Max Load':	DataTypes.INTEGER,	
    'Max Pax':	DataTypes.INTEGER,
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {freezeTableName: true});
}
