# Note this is untested as of 2020-03-18

FROM node:alpine
MAINTAINER mitra

# allow http
EXPOSE 80 5000

RUN mkdir -m777 /app/

# dont run as root
USER node

WORKDIR /app/
RUN apt install bash

# add JS source code and npm pkgs we use
COPY . /app/
RUN yarn install

WORKDIR /app/server
RUN ./build.sh

# when this container is invoked like "docker exec .." this is what that will run
# Main.js can be passed arguments to configure it
# --port nn
CMD [ "./node_modules/.bin/supervisor", ".", "Main.js" ]
