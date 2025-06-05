#!/bin/bash
cd /home/kavia/workspace/code-generation/neuroquest-the-productivity-rpg-26275-bd28cfe0/neuroquest_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

