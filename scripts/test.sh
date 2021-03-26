#!/bin/sh
if [ -d tst ];
then 
  jest --config ../../jest.config.js
else
  echo "No tests in package"
fi
