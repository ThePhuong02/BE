const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Subscription",
    tableName: "subscriptions",
    columns: {
        subscriptionid: { type: Number, primary: true, generated: true },
        userid: { type: Number },
        planid: { type: Number },
        isactive: { type: Boolean },
        enddate: { type: Date },
    },
    relations: {
        plan: {
            target: "Plan",
            type: "many-to-one",
            joinColumn: { name: "planid" },
        },
    },
});