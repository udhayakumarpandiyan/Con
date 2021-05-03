#FROM node:carbon
FROM node:14
# Create app directory
WORKDIR /home/appHome/UserInterface

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
RUN npm install serve -g
#RUN export NODE_OPTIONS=--max_old_space_size=8192
# If you are building your code for production
# RUN npm install --only=production
# Bundle app source
COPY . .

EXPOSE 3000

# start app
CMD ["npm", "run", "build"]
