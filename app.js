const { Engine } = require('json-rules-engine');
const customerFacts = require('./customer.json');
const rules = require('./rules.json');

let engine = new Engine();

/**
 * processing of below 4 rules
 * Rule 1: Country is not null AND grade is "A"
 * Rule 2: Country is "USA" OR department is "Sales"
 * Rule 3: City is "New York" AND (designation is "Manager" OR grade is "B")
 * Rule 4: isActive is true AND (isBonusApplicable is false OR state is null)
 */

const processFacts = async () => {
    const promises = customerFacts.map(async (fact, index) => {
      try {
        const { events, failureResults } = await engine.run(fact);
        events.forEach(event => console.log(`pass: ${index} - ${event.params.message}`));
        failureResults.forEach(e => console.log(`fail: ${index} - ${e.event.params.message}`));
      } catch (error) {
        console.error(`Error processing fact at index ${index}:`, error);
      }
    });
  
    await Promise.all(promises);
  };


const validateRule = () => {
    // Add rules to the engine
    rules.forEach(rule => engine.addRule(rule));

    // process rules on data
    processFacts();
}


validateRule();