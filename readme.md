Simple task runner
==================

[![build status](https://img.shields.io/travis/runner/runner.svg?style=flat-square)](https://travis-ci.org/runner/runner)
[![npm version](https://img.shields.io/npm/v/runner.svg?style=flat-square)](https://www.npmjs.com/package/runner)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/runner)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/runner)


## Installation ##

```bash
npm install runner
```

## Usage ##

Runner can be started by using `npm` or `npx` commands.

Run with npm:

```bash
npm run build
```

where `build` is an npm script in the `package.json` which contains a `runner` command.

Run with npx:

```bash
npx runner
```

The `runner` command format:

```bash
runner [options] [<task>]
```

Available options:

 Option       | Description
--------------|-------------
 -c, --config | Configuration file is a script which contains tasks definitions. Default value - runner.js.
 -s, --serial | Run all given tasks sequentially (instead of in parallel).

These two commands are identical:

```bash
npx runner
npx runner --config runner.js
```

To run a `webpack:build` task from a custom configuration file:

```bash
npx runner -c tasks/develop.js webpack:build 
```

Without the task name starts the default task:

```bash
npx runner -c tasks/develop.js 
```


## API ##

Add to the scope:

```js
import runner from 'runner';
```

Create a simple task:

```js
runner.task('make', function () {
    // some actions
});
```

More examples of tasks creation and execution are available
in the [cjs-runner](https://www.npmjs.com/package/cjs-runner) package.

Add an alias to an existing task:

```js
runner.alias('build', 'make');
```

Run task on a key or keys combination press:

```js
runner.keystroke('build', 'ctrl+b');
```

### Files watching

To execute a specific task on some file changes:

```js
runner.watch('src/script/**/*.js', 'webpack:build');
```

To execute a named or anonymous function:

```js
runner.watch('src/script/**/*.js', function rebuild ( done ) {
    // function name "rebuild" is used as task name
    // otherwise <noname> is printed
    done();
});
```

To execute task series:

```js
runner.watch('src/script/**/*.js', runner.serial('lint', 'build'));
```

Before calling `runner.watch` it's possible to configure the watch:

```js
runner.watch.config = {
    // some configuration 
};
```

All available configurations you can see in the underlying [chokidar](https://www.npmjs.com/package/chokidar) package.


## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/runner/runner/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`runner` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
