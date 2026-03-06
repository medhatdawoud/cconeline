#!/usr/bin/env node
const { execFileSync } = require('child_process');
const path = require('path');
const script = path.join(__dirname, '..', 'setup-statusline.sh');
execFileSync('bash', [script, ...process.argv.slice(2)], { stdio: 'inherit' });
