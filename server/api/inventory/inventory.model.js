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
    part: DataTypes.STRING,
    count: DataTypes.INTEGER,
    vendor: DataTypes.STRING
  });
}
