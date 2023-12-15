//weather.service.ts
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IWeatherApi, IWeatherResponseData } from './weather.interfaces';
import { Config } from '../config/config';

@Injectable()
export class WeatherService {
  constructor(
    @Inject('CACHE_MANAGER') private cache: Cache,
    @Inject('WeatherApi') private readonly weatherApi: IWeatherApi,
  ) {}

  async getCity(city: string): Promise<IWeatherResponseData | null> {
    const cacheKey = `weather.city.${city}`;

    const cachedData: IWeatherResponseData | undefined =
      await this.cache.get(cacheKey);
    if (cachedData || cachedData === null) {
      return cachedData;
    }
    try {
      const data = await this.weatherApi.getCity(city);

      await this.cache.set(cacheKey, data, Config.CACHE_TTL);

      return data;
    } catch (e: any) {
      await this.cache.set(cacheKey, null, Config.CACHE_TTL);
      return null;
    }
  }

  async getCities(
    cities: string[],
  ): Promise<Array<IWeatherResponseData | null>> {
    const x: IWeatherResponseData[] = [];
    for await (const city of cities) {
      try {
        const data: IWeatherResponseData | null = await this.getCity(city);
        x.push(data);
      } catch (err) {
        throw new InternalServerErrorException({
          descriptionOrOptions: err,
        });
      }
    }
    return x;
  }

  async getAverage(city: string): Promise<number> {
    const response: IWeatherResponseData | null = await this.getCity(city);
    if (!response) {
      throw new Error('City not found');
    }
    return (response.max_temp + response.min_temp) / 2;
  }
}
