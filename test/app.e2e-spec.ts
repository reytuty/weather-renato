import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  // Testins expected errors

  it('/weather/city/ without pass city parameter', async () => {
    const result = await request(app.getHttpServer()).get('/weather/city');
    expect(result.status).toBe(400);
  });

  it('/weather/cities/ without pass cities parameter', async () => {
    const result = await request(app.getHttpServer()).get('/weather/cities');
    expect(result.status).toBe(400);
  });

  it('/weather/average/ without pass city parameter', async () => {
    const result = await request(app.getHttpServer()).get('/weather/average');
    expect(result.status).toBe(400);
  });

  // Testing expected result
  it('/weather/city/ of London', async () => {
    const result = await request(app.getHttpServer()).get(
      '/weather/city?city=London',
    );
    expect(result.status).toBe(201);
    expect(result.body).not.toBeNull();
    expect(result.body?.max_temp).not.toBeUndefined();
  });

  it('/weather/cities/ of London', async () => {
    const result = await request(app.getHttpServer()).get(
      '/weather/cities?cities[]=London&cities[]=New York',
    );
    expect(result.status).toBe(201);
    expect(result.body).not.toBeNull();
    expect(Array.isArray(result.body)).toBe(true);
    expect(result.body.length).toBe(2);
  });

  it('/weather/average/ of London', async () => {
    const result = await request(app.getHttpServer()).get(
      '/weather/average?city=London',
    );
    expect(result.status).toBe(201);
    expect(result.body?.average).not.toBeUndefined();
    expect(result.body?.average).not.toBeNaN();
  });
});
