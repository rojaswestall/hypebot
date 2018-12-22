const testRegex = /-\s*(?:\s*\d\s*,\s*)*\s*\d/i;
var testarr = testRegex.exec('Task Completed - 3,1,2');
var indexes = [ ...new Set(testarr[0].substring(1).split(",").map(str => str.trim()).sort()) ];

const brotherRegex = /-\s*.*/i;
var test = brotherRegex.exec("Show tasks -   Canis")[0].substring(1);

console.log(test.trim());