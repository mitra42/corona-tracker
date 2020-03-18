#!/bin/bash

echo "THIS IS UNTESTED AS OF 2020-03-18"

# Run git checkout https://github.com/mitra42/corona-tracker
# cd corona-tracker
# edit server/Main.js if you want it on another port than 5000
# edit server/supervisor.conf if not running in /app
# ./install.sh

######## START OF CONFIGURATION ###############

# The server by default runs on port 5000
PORT=80

# Comment out this line if dont want to use supervisor and just run under node (without auto-restarts etc)
USESUPERVISOR=1

# Comment out this line, or edit it, if you want the supervisor to run as root or something other than the logged in user
# USER=root

######## END OF CONFIGURATION #################

sudo apt-get install node curl supervisord

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |apt-key add - \
    &&  echo "deb https://dl.yarnpkg.com/debian/ stable main" |tee /etc/apt/sources.list.d/yarn.list \
    &&  apt-get update \
    &&  apt-get -y install yarn npm

yarn install

pushd server
mv Main.sh Main.sh-
cat Main.sh | sed -e 's/port: 5000/port: 80/g' >Main.sh
./build.sh # Runs update.sh as well

if [ -z "${PORT:-}"]; then
  node ./Main.sh &
else
  cat ./supervisor.conf | sed -e "s:/app/server:${PWD}:g" | sed -e "s/USER=root/USER=${USER}/g" | sudo tee - /etc/conf.d/supervisor-corona-tracker.conf >>/dev/null
  sudo /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
endif
popd server

# TODO-PORT Main.js will be parameterised then remove comment above about ports

