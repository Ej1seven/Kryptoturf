FROM node:16

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# COPY prisma ./prisma/

RUN npm install

# RUN npm ci --only=production

# Bundle app source
COPY . .
COPY .env.production .env

RUN npm run build
RUN npx prisma generate
# RUN npx prisma migrate deploy
# RUN npx prisma db push

ENV NODE_ENV=production

EXPOSE 8080
CMD [ "node", "dist/server.js"]
# At the end, set the user to use when running this image
USER root