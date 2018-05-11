'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Order', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    description: DataTypes.STRING,
    po: DataTypes.STRING,
    poDate: DataTypes.DATE,
    category: DataTypes.STRING,
    part: DataTypes.STRING,
    countOnHand: DataTypes.INTEGER,
    countOnOrder: DataTypes.INTEGER,
    minimumCount: DataTypes.INTEGER,
    upc: DataTypes.INTEGER,
    vendor: DataTypes.STRING,
    complete: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  });
}
