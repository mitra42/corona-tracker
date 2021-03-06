#!/bin/bash

echo "THIS IS UNTESTED AS OF 2020-03-18"

# Run git clone https://github.com/mitra42/corona-tracker.git
# cd corona-tracker
#
# It runs by default, on port 5000 as user root
# To install so that it uses supervisord to restart on crashes, and so it runs on port 80 under user mitra
# PORT=80 USESUPERVISOR=1 RUNUSER=mitra ./install.sh

set -x
######## START OF CONFIGURATION ###############

# The server by default runs on port 5000
DEFAULTPORT=5000

# By default the server runs as root, override with environment variable e.g. RUNUSER=foobar
DEFAULTUSER=root

######## END OF CONFIGURATION #################

# Make sure to get get a recent node, Ubuntu is back at 8.x !
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |sudo apt-key add - \
  &&  echo "deb https://dl.yarnpkg.com/debian/ stable main" |sudo tee /etc/apt/sources.list.d/yarn.list \
  &&  sudo apt-get update \
  &&  sudo apt-get -y install nodejs curl supervisor webpack yarn npm

yarn install
webpack --mode development

pushd server
./build.sh # Runs update.sh as well

if [ -z "${USESUPERVISOR:-}" ]; then
  sudo node ./Main.js --port ${PORT:-${DEFAULTPORT}}&
else
  cat ./supervisor.conf | sed -e "s:/app/server:${PWD}:g" | sed -e "s/USER=root/USER=${RUNUSER:=${DEFAULTUSER}}/g" | sed -e "s/Main.js/Main.js --port ${PORT:-${DEFAULTPORT}}/"| sudo tee - /etc/supervisor/conf.d/supervisor-corona-tracker.conf >>/dev/null
  sudo supervisorctl reload && sudo supervisorctl restart corona-tracker || sudo /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
fi
popd
