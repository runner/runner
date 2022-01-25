import runner from './index.js';


runner.task('test', () => {
    console.log('test task');
});

// print all available tasks
runner.task('tasks', () => {
    Object.keys(runner.tasks).sort().forEach(name => {
        console.log(name);
    });
});

// list all tasks by default
runner.alias('default', 'tasks');
