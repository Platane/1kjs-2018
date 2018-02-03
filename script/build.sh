#!/usr/bin/env bash
set -e
# set -x

rm -rdf dist/
mkdir dist

echo "source size       `stat -c%s src/index.js`"

# minify
env BABEL_ENV=minify babel src/index.js > dist/tmp.js

echo "minified size     `stat -c%s dist/tmp.js`"

# crush
cat dist/tmp.js | jscrush 1> dist/index.js 2> /dev/null

echo "crushed size      `stat -c%s dist/index.js`"

# rm dist/tmp.js
