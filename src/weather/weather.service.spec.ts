import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Config } from '../config/config';
import { NinjaWeatherSdk } from './ninjas-weather.sdk';

describe('AppController', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        CacheModule.registerAsync({
          useFactory: () => ({
            ttl: Config.CACHE_TTL,
            max: Config.CACHE_MAX,
          }),
        }),
      ],
      providers: [
        WeatherService,
        {
          provide: 'WeatherApi',
          useClass: NinjaWeatherSdk,
        },
        {
          provide: 'SDKWeatherProviderConfig',
          useValue: { apiKey: Config.WHEATHER_API_KEY },
        },
      ],
    }).compile();

    service = app.get<WeatherService>(WeatherService);
  });

  describe('Weather Service', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('should return info from London', async () => {
      const result = await service.getCity('London');
      expect(result).not.toBeNull();
      expect(result?.max_temp).not.toBeUndefined();
    });
    it('should not return info from invalid city', async () => {
      const result = await service.getCity('aaa');
      expect(result).toBeNull();
      expect(result?.max_temp).toBeUndefined();
    });

    it('should not return info from list of cities', async () => {
      const result = await service.getCities(['London', 'New York']);
      expect(Array.isArray(result)).toBe(true);
      expect(result?.length).toBe(2);
    });
    it('should return info from list of cities with 1 error', async () => {
      const result = await service.getCities(['London', 'New York', 'aa']);
      expect(Array.isArray(result)).toBe(true);
      expect(result?.length).toBe(3);
      expect(result[2]).toBeNull();
    });
    it('should return avarage temperature', async () => {
      const city: string = 'London';
      const cityInfo = await service.getCity(city);
      const result = await service.getAverage(city);
      expect(result).not.toBeNull();
      expect(result).not.toBeNaN();
      expect(result).toBe((cityInfo.max_temp + cityInfo.min_temp) / 2);
    });
  });
});
