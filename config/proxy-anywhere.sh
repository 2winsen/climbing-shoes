#!/bin/bash

export PORT=8080
export CORSANYWHERE_WHITELIST=http://site.com
# For example to rate-limit everything to 50 requests per 2 minutes, except for ...
export CORSANYWHERE_RATELIMIT='100 2 http://site.com'
node /usr/local/lib/node_modules/cors-anywhere/server.js