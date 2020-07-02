# Divvy Bikes Sample API

This project is a sample NodeJS/Typescript/Express API service to demonstrate development skill as well as serve as a template for future projects requiring a REST API.

## Getting Started

- Pull the source code to your local project file. All you will need to run the development envioronment is NodeJS and NPM installed.
- run npm install
- development .env file is included in the project. For actual production environments, do not commit this file.
- linting is enabled in the project and can be validated by running "npm run lint"
- *IMPORTANT - before running, unzip the "Divvy_Trips_2019_Q2.zip" file in the /import folder. 

### Prerequisites

- NodeJS/NPM
- Docker desktop if you would like to build the image and run the container.

## Running the tests

- A unit test for the app server and the station route is included in the project. The test can be executed and the code coverage viewed by running "npm run test"

### Working with the app

- To run the app locally, there are three options: dev, standard, and production.
    - dev - "npm run dev" - this uses ts-node to run the typescript project without building. The default log level will be debug.
    - standard - "npm run start" - this also uses ts-node to run the typescript project without building. The default log level will be info.
    - production - "npm run start:production" - this command will only work if the typescript build has already been run. Run tsc or "npm run build" to output the Typscript project into standard JS in the build folder.
- The Swagger UI can be accessed at the default route in a web browser ex. "http://localhost:80". This can be useful for testing without installing other applications.
- Three routes are included with this project: /station, /rider, and /trip.
    - /station - this route returns station data by the submitted station id. Per the requirements specification, only one station id will be returned if the submitted ID is valid.
    - /rider - this route returns rider data by station, date and age group for a given set of station Ids. Multiple station ids can be queried as a comma delimited string in the stationId query parameter.
    - /trip - this route returns trip data for each station by day. It filters out by the most recent 20 trips for that particular station/day. Multiple station ids can be queried as a comma delimited string in the stationId query parameter.
- The three routes are protected by JWT validation, so a valid JWT must be submitted in the bearer format in the "Authorization" header in order to access the routes. A valid token is included below and can be used until July 2021:
    -eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEaXZ2eSBEZW1vIEFwcCIsImlhdCI6MTU5MzY4MTEyMiwiZXhwIjoxNjI1MjE3MTIyLCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJtaXRjaGF3ZXN0QGdtYWlsLmNvbSIsIlJvbGUiOiJSZWFkZXIifQ.6ucTyALi2E8-s8e5r5U3Lqqaw4SKRsDMMbEPNrXU6i0

## Deployment/Docker

This application can be built into a docker image and the Dockerfile is included in the project. Follow these steps to try for yourself:
- in the source folder run "docker build . -t test-app"
- post build, to start the image run "docker run -d -p 80:80 test-app". This starts the docker container in daemon mode and exposes port 80 for your use. Once complete, all operations are the same as if the code were running locally in dev.

## Built With

* [NodeJS](https://nodejs.org/en/) - NodeJS
* [Express](https://www.npmjs.com/package/express) - API Framework
* [Docker](https://www.docker.com/) - App containerization
* [Typescript](https://www.typescriptlang.org/) - A typed superset of Javascript that offers optional strong typing among other things.


## Authors

* **Mitchell West** - *Initial work* - [mitchawest](https://github.com/mitchawest)
