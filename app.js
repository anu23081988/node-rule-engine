const { Engine } = require('json-rules-engine');
const customerFacts = require('./mockData.json');
const rulesSingle = require('./rules_single.json');

/**
 * Rule 1: Basic AND Condition
 * Rule 2: Basic OR Condition
 * Rule 3: Nested AND/OR Condition
 * Rule 4: Complex AND/OR with Nested Conditions
 * Rule 5: OR Condition with Multiple Facts
 * Rule 6: AND with Nested OR Conditions
 * Rule 7: AND Condition with Complex Operator
 * Rule 8: OR Condition with Different Operators
 * Rule 9: AND Condition with Length and Comparison
 * Rule 10: Mixed AND/OR with Nested Conditions
 * Rule 11: The city is "South Enos" AND the country is NOT "Sint Maarten" OR the state is "North Dakota" AND the city contains "South".
 * Rule 12: The city starts with "South" AND the state does not exist OR the country is "Sint Maarten" AND the city ends with "Enos".
 * Rule 13: The city is either "South Enos" or "South Beach" AND the country is NOT "Sint Maarten" OR the state length is less than 15 AND the city contains "South".
 * 
 * city in ("South Enos", "South Beach") && (Country !== "Sint Maarten" or state.length < 15 and city )
 */
const rulesMulti = require('./rules_multi.json');


// custom : value = data value and ruleValue = jsonruleValue
const customOperators = {
  'Equal': (value, ruleValue) => value === ruleValue, // default operator: equal
  'Not Equal': (value, ruleValue) => value !== ruleValue, // default operator: notEqual
  'Greater Than': (value, ruleValue) => value > ruleValue, // default operator: greaterThan
  'Greater Than and Equals To': (value, ruleValue) => value >= ruleValue, // default operator: greaterThanInclusive
  'Less Than': (value, ruleValue) => value < ruleValue, // default operator: lessThan
  'Less Than and Equals To': (value, ruleValue) => value <= ruleValue, // default operator: lessThanInclusive
  'In': (value, ruleValue) => ruleValue.includes(value),  // default operator: in
  'Not In': (value, ruleValue) => !ruleValue.includes(value), // default operator: notIn
  'Contains': (value, ruleValue) => value.includes(ruleValue),
  'Contains in': (value, ruleValue) => ruleValue.includes(value),
  'Does not Contains': (value, ruleValue) => !value.includes(ruleValue),
  'Does not Ends with': (value, ruleValue) => !value.endsWith(ruleValue),
  'Does not Exists': (value, ruleValue) => value === undefined || value === null,
  'Does not Starts with': (value, ruleValue) => !value.startsWith(ruleValue),
  'Empty': (value, ruleValue) => value === '',
  'Ends with': (value, ruleValue) => value.endsWith(ruleValue),
  'Exists': (value, ruleValue) => value !== undefined && value !== null,
  'Is Null': (value, ruleValue) => value === null,
  'Not Empty': (value, ruleValue) => value !== '',
  'Not Null': (value, ruleValue) => value !== null,
  'Starts with': (value, ruleValue) => value.startsWith(ruleValue),
  'Is Type': (value, ruleValue) => typeof value === ruleValue,
  'Length Equals': (value, ruleValue) => value.length === ruleValue,
  'Length Greater Than': (value, ruleValue) => value.length > ruleValue, //default operator: lengthGreaterThan
  'Length Less Than': (value, ruleValue) => value.length < ruleValue,
  'Length Greater Than and Equals To': (value, ruleValue) => value.length >= ruleValue, //default operator: lengthGreaterThanInclusive
  'Length Less Than and Equals To': (value, ruleValue) => value.length <= ruleValue,
  'Pattern': (value, ruleValue) => new RegExp(ruleValue).test(value)
};

let engine = new Engine();

/**
 * processing of below 4 rules
 * Rule 1: Country is not null AND grade is "A"
 * Rule 2: Country is "USA" OR department is "Sales"
 * Rule 3: City is "New York" AND (designation is "Manager" OR grade is "B")
 * Rule 4: isActive is true AND (isBonusApplicable is false OR state is null)
 */

const processFacts = async () => {
  console.time('Processing Time - Json-rule-engine');
  const promises = customerFacts.map(async (fact, index) => {
    try {
      const { events, failureResults } = await engine.run(fact);
      events.forEach(event => console.log(`pass: ${index} - ${event.params && event.params.message ? event.params.message : event.type}`));
      failureResults.forEach(e => console.log(`fail: ${index} - ${e.event && e.event.params && e.event.params.message ? e.event.params.message : e.event.type}`));
    } catch (error) {
      console.error(`Error processing fact at index ${index}:`, error);
    }
  });

  await Promise.all(promises);
  console.timeEnd('Processing Time - Json-rule-engine');
  console.log(`rules = ${[...rulesSingle, ...rulesMulti].length}`);
  console.log(`datarows = ${customerFacts.length}`);
  console.log(`fields = ${Object.keys(customerFacts[0]).length}`);
};


const validateRule = () => {
  const rules = [...rulesSingle, ...rulesMulti];
  // Add rules to the engine
  rules.forEach(rule => engine.addRule(rule));

  // adding custom operators to engine
  Object.keys(customOperators).forEach(operator => {
    engine.addOperator(operator, customOperators[operator]);
  });

  processFacts();
}

validateRule();