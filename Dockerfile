FROM node:latest

ENV HTTP_PROXY "http://10.158.100.2:8080/"
ENV HTTPS_PROXY "http://10.158.100.2:8080/"

WORKDIR /src

COPY app/package.json /src

RUN npm install

EXPOSE 3000

# Bundle app source
# COPY . .

#CMD [ "npm", "start" ]
CMD node app/bin/www

#ADD package.json /app/
#COPY package.json /app/
#RUN npm install
#ADD server.js /app

#CMD ["npm", "start"]
#CMD ["bash"]

