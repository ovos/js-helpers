#!/bin/bash

echo "=> Transpiling 'src' into ES5 ..."
echo ""
rm -rf ./dist
./node_modules/.bin/babel --ignore tests --plugins "transform-runtime" ./src --out-dir ./dist
echo ""
echo "=> Transpiling completed."
