const brotherAddTaskRegex = /(-.*(?!-)) (-.*)/i;

console.log(brotherAddTaskRegex.exec('Add task - a task - Canis')[2]);