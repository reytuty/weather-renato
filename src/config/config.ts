import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot();

const configService: ConfigService<{
  CACHE_TTL: number;
  CACHE_MAX: number;
  WHEATHER_API_KEY: string;
}> = new ConfigService();

const wheather = configService.get('WHEATHER_API_KEY', {
  infer: true,
});
const cacheTtl = parseInt(
  configService.get('CACHE_TTL', {
    infer: true,
  }),
);
const cacheMax = parseInt(
  configService.get('CACHE_MAX', {
    infer: true,
  }),
);
export const Config = {
  WHEATHER_API_KEY: wheather,
  CACHE_TTL: cacheTtl | 3600, //default a hour,
  CACHE_MAX: cacheMax | 1000, //default 1000
};
