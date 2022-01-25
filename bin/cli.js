#!/usr/bin/env node

/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

import path from 'path';
import {Command} from 'commander/esm.mjs';
import log from 'runner-logger';
import runner from '../index.js';

const program = new Command();

program
    .version('4.0.0')
    .usage('[options] [<task>]')
    .description('Simple task runner')
    .option('-c, --config [file]', 'configuration file with tasks', 'runner.js')
    .option('-s, --serial', 'run all given tasks sequentially (instead of in parallel)');

program.on('--help', () => {
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
const options = program.opts();

// config absolute path
options.config = path.normalize(path.join(process.cwd(), options.config));

(async () => {
    // load config
    log.info('config file: ' + log.colors.green(options.config));
    await import(options.config);

    // run
    if ( program.args.length === 1 ) {
        // just a single task
        runner.run(program.args[0]);
    } else {
        if ( program.args.length > 1 ) {
            // list of tasks
            log.info('run mode: ' + (options.serial ? 'serial' : 'parallel'));

            if ( options.serial ) {
                //runner.task('default', runner.serial.apply(runner, program.args));
                runner.task('default', runner.serial(...program.args));
            } else {
                //runner.task('default', runner.parallel.apply(runner, program.args));
                runner.task('default', runner.parallel(...program.args));
            }
        }

        runner.start();
    }
})();
