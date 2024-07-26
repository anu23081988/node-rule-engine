const sift = require('sift');
const rulesMultiSift = require('./rules-multi-sift.json');
const rulesSingleSift = require('./rules_single-sift.json');
const data = require('../mockData.json');


const passedRecords = [];
const failedRecords = [];

const rules = [...rulesSingleSift, ...rulesMultiSift];

console.time('Processing Time - sift-rule-engine');
data.forEach((user, rowIndex) => {
    let passed = true;
    rules.forEach((rule, ruleIndex) => {
        if (!sift(rule.conditions)(user)) {
            passed = false;
            failedRecords.push({
                rowIndex,
                ruleIndex,
                message: rule.event.params && rule.event.params.message ? rule.event.params.message : rule.event.type,
                user
            });
            console.log(`Fail: rowIndex: ${rowIndex} - ruleIndex: ${ruleIndex}: ${rule.event.params && rule.event.params.message ? rule.event.params.message : rule.event.type}`);
        } else {
            console.log(`Pass: rowIndex: ${rowIndex} - ruleIndex: ${ruleIndex}: ${rule.event.params && rule.event.params.message ? rule.event.params.message : rule.event.type}`);
        }
    });
    if (passed) {
        passedRecords.push({
            rowIndex,
            user
        });
    }
});
console.timeEnd('Processing Time - sift-rule-engine');
console.log(`rules = ${rules.length}`);
console.log(`datarows = ${data.length}`);
console.log(`fields = ${Object.keys(data[0]).length}`);


// console.log('Passed Records:', passedRecords);
// console.log('Failed Records:', failedRecords);