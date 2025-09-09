const pool = require("../config/db");

// ================== Kiểm tra quyền PREMIUM ==================
const hasPremiumAccess = async (userId) => {
  if (!userId) return false;

  const result = await pool.query(
    `SELECT s.subscriptionid, s.userid, s.planid, s.startdate, s.enddate, s.isactive,
            p.name AS plan_name, p.grantspremiumaccess
     FROM subscriptions s
     JOIN plans p ON s.planid = p.planid
     WHERE s.userid = $1
       AND s.isactive = true
       AND s.enddate > NOW()
     ORDER BY s.enddate DESC
     LIMIT 1`,
    [userId]
  );

  if (result.rows.length === 0) return false;

  return result.rows[0].grantspremiumaccess === true;
};

// ================== Lấy gói hiện tại ==================
const getCurrentSubscription = async (userId) => {
  const result = await pool.query(
    `SELECT s.subscriptionid, s.userid, s.planid, s.startdate, s.enddate, s.isactive,
            p.name AS plan_name, p.durationdays, p.grantspremiumaccess
     FROM subscriptions s
     JOIN plans p ON s.planid = p.planid
     WHERE s.userid = $1
       AND s.isactive = true
       AND s.enddate > NOW()
     ORDER BY s.enddate DESC
     LIMIT 1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return {
      plan: "FREE",
      planid: null,
      startdate: null,
      enddate: null,
      daysleft: null,
      grantspremiumaccess: false,
    };
  }

  const sub = result.rows[0];
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(sub.enddate) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return {
    subscriptionid: sub.subscriptionid,
    plan: sub.plan_name,
    planid: sub.planid,
    startdate: sub.startdate,
    enddate: sub.enddate,
    daysleft: daysLeft,
    grantspremiumaccess: sub.grantspremiumaccess,
  };
};

// ================== Tạo subscription mới ==================
const createSubscription = async (userId, planId, durationDays = 30, paymentId = null) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);

  // Hủy active cũ
  await pool.query(
    `UPDATE subscriptions SET isactive = false 
     WHERE userid = $1 AND isactive = true`,
    [userId]
  );

  // Thêm mới
  const result = await pool.query(
    `INSERT INTO subscriptions (userid, planid, startdate, enddate, isactive, paymentid)
     VALUES ($1, $2, $3, $4, true, $5)
     RETURNING *`,
    [userId, planId, startDate, endDate, paymentId]
  );

  return result.rows[0];
};

// ================== Hủy subscription ==================
const cancelSubscription = async (userId) => {
  const result = await pool.query(
    `UPDATE subscriptions 
     SET isactive = false 
     WHERE userid = $1 AND isactive = true
     RETURNING *`,
    [userId]
  );

  return result.rows.length > 0;
};

module.exports = {
  hasPremiumAccess,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
};
