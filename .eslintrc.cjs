/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// public
module.exports = {
    // base rules
    extends: require.resolve('cjs-eslint'),

    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        allowImportExportEverywhere: true
    }
};
