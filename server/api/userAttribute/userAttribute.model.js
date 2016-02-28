'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('UserAttribute', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    phone: DataTypes.STRING,
    uid: DataTypes.STRING
  });
}
