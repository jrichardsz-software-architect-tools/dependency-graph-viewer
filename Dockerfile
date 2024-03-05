FROM node:16-alpine3.16
COPY . /usr/app
WORKDIR /usr/app
RUN apk --no-cache add curl
RUN npm install  --production
RUN mkdir -p /usr/local/bin/
COPY DockerfileEntryPoint.sh /usr/local/bin/DockerfileEntryPoint.sh
RUN chmod 744 /usr/local/bin/DockerfileEntryPoint.sh
RUN mv /usr/app/devops_info /var/devops_info
ENTRYPOINT ["sh", "/usr/local/bin/DockerfileEntryPoint.sh"]