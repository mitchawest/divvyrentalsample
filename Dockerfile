FROM node:12.18.2-alpine
ENV NODE_ENV production
ENV NAMESPACE divvy.bike.rental.api
ENV PORT 80
ENV LOGCONSOLE true
ENV APINAME Divvy Bike Rental REST API
ENV STATION_DATA_URL https://gbfs.divvybikes.com/gbfs/en/station_information.json
ENV JWT_KEY testDivvyAppKey2020
WORKDIR /usr/src/app
COPY ["package.json", "./"]

RUN npm install -g typescript tsconfig-paths
RUN npm install --only=prod
COPY . .
EXPOSE 80 8080
RUN tsc && npm uninstall -g typescript
CMD ["npm", "run", "start:production"]