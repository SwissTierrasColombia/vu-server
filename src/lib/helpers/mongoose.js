/**
 * Add populates to query with mongoose
 * 
 * @param {*} recordInstance 
 * @param {*} populates 
 * 
 * @return {object} Instance mongoose
 */
export function addPopulates(recordInstance, populates) {
    if (populates && populates.length > 0) {
        for (let i = 0; i < populates.length; i++) {
            recordInstance = recordInstance.populate(populates[i]);
        }
    }
    return recordInstance;
}