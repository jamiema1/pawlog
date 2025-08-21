#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Configure the oracle instant client env variable
export DYLD_LIBRARY_PATH=/Users/justin/dev/ubc/cpsc304/project_a4j3l_o6q7f_s9k6v/instantclient_19_8:$DYLD_LIBRARY_PATH

# Start Node application
npm start
