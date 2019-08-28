// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';


export default (MStepModel) => {

    // Statics
    MStepModel.statics = {

        async getStepByTypeAndProcess(typeStepId, processId) {
            return await this.findOne({ typeStep: typeStepId, process: processId });
        },

        async createStep(typeStepId, processId) {
            const MStepModel = this;
            const step = new MStepModel({
                typeStep: typeStepId,
                process: processId
            });
            return await step.save();
        },

        async getStepsByProcess(processId, populates) {
            let steps = this.find({ process: processId });
            steps = addPopulates(steps, populates);
            return await steps.exec();
        },

        async getStepById(stepId) {
            return await this.findById(stepId);
        },

        async addRuleToStep(mStepId, rule) {
            return await this.findOneAndUpdate(
                { '_id': mStepId },
                {
                    '$push': {
                        rules: {
                            $each: [rule],
                        }
                    }
                }
            );
        },

        async removeRuleToStep(mStepId, ruleId) {
            let step = await this.findById(mStepId);
            let rules = step.rules;
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule._id.toString() === ruleId.toString()) {
                    rules.splice(i, 1);
                }
            }
            step.rules = rules;
            return await step.save();
        },

        async removeStepsByProcessId(processId) {
            return await this.remove({ process: processId });
        },

        async removeStepById(stepId) {
            return await this.remove({ _id: stepId });
        },

        async updateRolesToStep(mStepId, roles) {
            let step = await this.findById(mStepId);
            step.roles = roles;
            return await step.save();
        }

    };

};