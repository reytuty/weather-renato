import {
  Injectable,
  Controller,
  Inject,
  HttpCode,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { WeatherService } from './weather.service';

@Injectable()
@Controller('weather')
export class WeatherController {
  constructor(
    @Inject(WeatherService)
    private readonly service: WeatherService,
  ) {}

  @Get('/city')
  @HttpCode(201)
  async getCity(@Query() { city }: { city: string }): Promise<any> {
    if (!city) {
      throw new BadRequestException('"city" not found.');
    }
    return await this.service.getCity(city);
  }

  @Get('/cities')
  @HttpCode(201)
  async getCities(@Query() { cities }: { cities: string[] }): Promise<any> {
    if (!cities || !Array.isArray(cities)) {
      throw new BadRequestException('"cities" need to be an Array of string.');
    }
    return await this.service.getCities(cities);
  }

  @Get('/average')
  @HttpCode(201)
  async getAverage(
    @Query() { city }: { city: string },
  ): Promise<{ average: number }> {
    if (!city) {
      throw new BadRequestException('"city" not found.');
    }
    const response = await this.service.getAverage(city);
    return { average: response };
  }
}
