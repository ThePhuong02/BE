const { EntitySchema } = require("typeorm");

const Plan = new EntitySchema({
  name: "Plan",
  tableName: "plans",
  columns: {
    planid: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      length: 100,
      nullable: true, // ⚡ Trong DB hiện tại là nullable
    },
    price: {
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: true,
    },
    durationdays: {
      type: "int",
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    grantspremiumaccess: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = Plan;
