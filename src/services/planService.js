const pool = require("../config/db");

// Lấy danh sách tất cả gói
const getAllPlans = async () => {
  const result = await pool.query("SELECT * FROM plans ORDER BY planid ASC");
  return result.rows;
};

// Lấy chi tiết gói theo ID
const getPlanById = async (id) => {
  const result = await pool.query("SELECT * FROM plans WHERE planid = $1", [id]);
  return result.rows[0] || null;
};

module.exports = {
  getAllPlans,
  getPlanById,
};
