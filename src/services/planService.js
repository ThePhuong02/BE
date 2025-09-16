const PlanRepository = require("@repositories/planRepository");
const planRepo = new PlanRepository();

const getAllPlans = async () => {
  return await planRepo.findAll();
};

const getPlanById = async (id) => {
  return await planRepo.findById(id);
};

module.exports = {
  getAllPlans,
  getPlanById,
};
