/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

import chokidar from 'chokidar';
import Runner from 'cjs-runner';
import log from 'runner-logger';

const runner = new Runner();

// should be removed after rework!
global.DEVELOP = true;


// global configuration for tasks
runner.config = {};


runner.alias = function ( alias, taskId ) {
    runner.tasks[alias] = runner.tasks[taskId];
};


// @todo: move to runner-plugin-watcher ???
runner.watch = function ( glob, task ) {
    console.assert(arguments.length === 2, 'wrong arguments number');
    console.assert(typeof task === 'string' || typeof task === 'function', 'task should be a string or a function');
    console.assert(!!task, 'task is empty');

    const taskId = typeof task === 'string' ? task : task.name || '<noname>';

    const handler = name => {
        log.info('changed: %s run: %s', log.colors.magenta(name), log.colors.cyan(taskId));
        runner.run(task);
    };

    return chokidar.watch(glob, runner.watch.config)
        .on('change', handler)
        .on('unlink', handler)
        .on('add',    handler);
};

runner.watch.config = {
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 50
    }
};

// @todo: move to runner-plugin-keystroke
runner.keystrokes = {};

runner.keystroke = function ( id, rule ) {
    //const key = [];

    if ( rule && runner.tasks[id] ) {
        //rule = rule.toLowerCase().split('+');
        // rule.map(function ( part ) {
        //     return part.trim();
        // });
        //
        // if ( rule.indexOf('ctrl')  !== -1 ) { key.push('ctrl'); }
        // if ( rule.indexOf('alt')   !== -1 ) { key.push('alt'); }
        // if ( rule.indexOf('shift') !== -1 ) { key.push('shift'); }
        //
        // key.push('shift');

        runner.keystrokes[rule] = id;
    }
};


process.stdin.on('keypress', ( str, key ) => {
    let keystroke = [];

    key.ctrl  && keystroke.push('ctrl');
    key.meta  && keystroke.push('alt');
    key.shift && keystroke.push('shift');
    keystroke.push(key.name);
    keystroke = keystroke.join('+');

    if ( runner.keystrokes[keystroke] ) {
        runner.run(runner.keystrokes[keystroke]);
    }
});


runner.addListener('start', event => {
    log.info('starting %s ...', log.colors.cyan(event.id));
});

runner.addListener('finish', event => {
    log.info('finished %s after %s ms', log.colors.cyan(event.id), log.colors.magenta(event.time));
});

runner.addListener('error', event => {
    if ( event.code === 404 ) {
        log.fail('task %s is missing', log.colors.bold(event.id));
    }
});

// possible conflict detection
// if ( path.dirname(path.dirname(path.dirname(process.mainModule.filename))) !== path.dirname(__dirname) ) {
//     log.fail('both global and local node-runner instances are used at the same time!');
// }


// public
export default runner;
