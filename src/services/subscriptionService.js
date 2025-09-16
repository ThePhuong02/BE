const SubscriptionRepository = require("@repositories/subscriptionRepository");
const PlanRepository = require("@repositories/planRepository");

const SubscriptionService = {
  async subscribe(userid, planid, paymentid, pricingid) {
    // Lấy thông tin gói cước
    const plan = await PlanRepository.findById(planid);
    if (!plan) throw new Error("Plan not found");

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await SubscriptionRepository.create({
      userid,
      planid,
      startdate: startDate,
      enddate: endDate,
      isactive: true,
      paymentid,
      iscancelled: false,
      autorenew: false,
      pricingid
    });

    return subscription;
  },

  async getActiveSubscription(userid) {
    return await SubscriptionRepository.findByUserId(userid);
  },

  async cancelSubscription(subscriptionId) {
    return await SubscriptionRepository.cancel(subscriptionId);
  }
};

module.exports = SubscriptionService;
