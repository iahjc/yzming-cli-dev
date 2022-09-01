'use strict';

const core = require('../lib');
const assert = require('assert').strict;

assert.strictEqual(core(), 'Hello from core');
console.info("core tests passed");
