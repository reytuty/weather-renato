//Weather.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios/dist/http.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { Config } from '../config/config';
import { NinjaWeatherSdk } from './ninjas-weather.sdk';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: Config.CACHE_TTL,
        max: Config.CACHE_MAX,
      }),
    }),
  ],
  controllers: [WeatherController],
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
})
export class WeatherModule {}
