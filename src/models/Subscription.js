// src/models/Subscription.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subscription = sequelize.define("Subscription", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  plan: { type: DataTypes.STRING, allowNull: false }, // Free, Premium, VIP
  expiresAt: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Subscription;
