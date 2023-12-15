import {
  Injectable,
  Controller,
  Inject,
  HttpCode,
  Get,
  Query,
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
  async createAccessToken(@Query() { city }: { city: string }): Promise<any> {
    return await this.service.getCity(city);
  }

  @Get('/cities')
  @HttpCode(201)
  async getCities(@Query() { cities }: { cities: string[] }): Promise<any> {
    return await this.service.getCities(cities);
  }

  @Get('/average')
  @HttpCode(201)
  async getAverage(@Query() { city }: { city: string }): Promise<number> {
    const response = await this.service.getMedia(city);
    return response;
  }
}
