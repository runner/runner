#!/usr/bin/env node

/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path        = require('path'),
    program     = require('commander'),
    log         = require('runner-logger'),
    runner      = require('../index'),
    packageData = require('../package.json');


program
    .version(packageData.version)
    .usage('[options] [<task>]')
    .description(packageData.description)
    .option('-c, --config [file]', 'configuration file with tasks', 'runner.js')
    .option('-s, --serial', 'run all given tasks sequentially (instead of in parallel)');

program.on('--help', function () {
    console.log([
        '',
        '  Examples:',
        '',
        '    runner -c tasks/develop.js      # run default task from custom config',
        '    runner webpack:build            # run build task from default config runner.js',
        '    runner build watch serve        # run 3 given tasks in parallel',
        '    runner -s sass:build pug:build  # run all tasks in series',
        ''
    ].join('\n'));
});

program.parse(process.argv);

// config absolute path
program.config = path.normalize(path.join(process.cwd(), program.config));

// load config
log.info('config file: ' + log.colors.green(program.config));
require(program.config);

// run
if ( program.args.length === 1 ) {
    // just a single task
    runner.run(program.args[0]);
} else {
    if ( program.args.length > 1 ) {
        // list of tasks
        log.info('run mode: ' + (program.serial ? 'serial' : 'parallel'));

        if ( program.serial ) {
            runner.task('default', runner.serial.apply(runner, program.args));
        } else {
            runner.task('default', runner.parallel.apply(runner, program.args));
        }
    }

    runner.start();
}
