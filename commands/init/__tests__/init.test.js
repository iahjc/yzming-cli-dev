'use strict';

const init = require('../lib');
const assert = require('assert').strict;

assert.strictEqual(init(), 'Hello from init');
console.info("init tests passed");
