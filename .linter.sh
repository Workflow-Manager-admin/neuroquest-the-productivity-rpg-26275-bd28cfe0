#!/bin/bash
cd /home/kavia/workspace/code-generation/neuroquest-the-productivity-rpg-26275-bd28cfe0/neuroquest_main_container
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
 if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

