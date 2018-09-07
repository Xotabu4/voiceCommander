FROM node:10
# Bundle app source
COPY . .
EXPOSE 3000
RUN npm install --unsafe-perm
CMD [ "npm", "run", "start-forever" ]