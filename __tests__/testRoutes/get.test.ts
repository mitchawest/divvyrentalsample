import init from '../../src/app/server';
import request from 'supertest';
import { Server } from 'http';

describe('Test server init Swagger UI and Station Routes', () => {
  let server: Server;
  const authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEaXZ2eSBEZW1vIEFwcCIsImlhdCI6MTU5MzY4MTEyMiwiZXhwIjoxNjI1MjE3MTIyLCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJtaXRjaGF3ZXN0QGdtYWlsLmNvbSIsIlJvbGUiOiJSZWFkZXIifQ.6ucTyALi2E8-s8e5r5U3Lqqaw4SKRsDMMbEPNrXU6i0';
  beforeAll(async () => {
    process.env.NAMESPACE="divvy.bike.rental.api"
    process.env.PORT="80"
    process.env.LOGCONSOLE="true"
    process.env.APINAME="Divvy Bike Rental REST API"
    process.env.STATION_DATA_URL="https://gbfs.divvybikes.com/gbfs/en/station_information.json"
    process.env.JWT_KEY="testDivvyAppKey2020"
    server = await init();
  });

  test('GET Swagger UI', async (done) => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    done();
  });

  test('GET Station - (401) Scenario. No Token', async (done) => {
    const response = await request(server).get('/station');
    expect(response.status).toEqual(401);
    done();
  });

  test('GET Station - (400) Scenario. No stationId in query', async (done) => {
    const response = await request(server).get('/station').set('Authorization', authorization);
    expect(response.status).toEqual(400);
    done();
  });

  test('GET Station - (200) Scenario.', async (done) => {
    const response = await request(server).get('/station?stationId=2').set('Authorization', authorization);
    expect(response.status).toEqual(200);
    done();
  });

  test('GET Station - (404) Scenario.', async (done) => {
    const response = await request(server).get('/station?stationId=notAValidId').set('Authorization', authorization);
    expect(response.status).toEqual(404);
    done();
  });

  afterAll(() => {
    server.close();
  });
});
