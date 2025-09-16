const AppDataSource = require("@config/data-source");

const SubscriptionRepository = {
  async create(subscription) {
    const query = `
      INSERT INTO subscriptions (userid, planid, startdate, enddate, isactive, paymentid, iscancelled, autorenew, pricingid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      subscription.userid,
      subscription.planid,
      subscription.startdate,
      subscription.enddate,
      subscription.isactive ?? true,
      subscription.paymentid,
      subscription.iscancelled ?? false,
      subscription.autorenew ?? false,
      subscription.pricingid || ''
    ];
    const { rows } = await AppDataSource.query(query, values);
    return rows[0];
  },

  async findByUserId(userid) {
    const query = `
      SELECT s.*, p.name as plan_name, p.duration, p.price
      FROM subscriptions s
      JOIN plans p ON s.planid = p.planid
      WHERE s.userid = $1 AND s.isactive = true AND s.iscancelled = false
      ORDER BY s.enddate DESC
      LIMIT 1;
    `;
    const { rows } = await AppDataSource.query(query, [userid]);
    return rows[0];
  },

  async cancel(subscriptionId) {
    const query = `
      UPDATE subscriptions
      SET iscancelled = true, isactive = false
      WHERE subscriptionid = $1
      RETURNING *;
    `;
    const { rows } = await AppDataSource.query(query, [subscriptionId]);
    return rows[0];
  },

  async findById(subscriptionId) {
    const query = `SELECT * FROM subscriptions WHERE subscriptionid = $1`;
    const { rows } = await AppDataSource.query(query, [subscriptionId]);
    return rows[0];
  }
};

module.exports = SubscriptionRepository;
