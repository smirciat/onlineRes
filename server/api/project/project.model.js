'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Project', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    bin: DataTypes.STRING,
    date: DataTypes.STRING
  });
}
