'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Inventory', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    part: DataTypes.STRING,
    countOnHand: DataTypes.INTEGER,
    countOnOrder: DataTypes.INTEGER,
    minimumCount: DataTypes.INTEGER,
    upc: DataTypes.INTEGER,
    vendor: DataTypes.STRING
  });
}
