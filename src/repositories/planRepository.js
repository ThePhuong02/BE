const AppDataSource = require("@config/data-source");
const Plan = require("@entities/Plan");

class PlanRepository {
    constructor() {
        this.repo = AppDataSource.getRepository(Plan);
    }

    async findAll() {
        return this.repo.find({
            order: { planid: "ASC" },
        });
    }

    async findById(id) {
        return this.repo.findOne({
            where: { planid: id },
        });
    }
}

module.exports = PlanRepository;
