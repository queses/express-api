#!/usr/bin/env bash
# .htaccess:
whichnode=$(which node)
sed "s|{{appRoot}}|`pwd`|" .htaccess.dist | sed "s|{{nodePath}}|$whichnode|" > .htaccess
# JS env:
cp env.config.js.dist env.config.js
# Output:
echo -e "Your .htaccess and .env.config.js is created!"
