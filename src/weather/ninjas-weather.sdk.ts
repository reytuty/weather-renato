//ninjas-WeatherController.sdk.ts
import { catchError, firstValueFrom } from 'rxjs';
import { IWeatherApi, IWeatherResponseData } from './weather.interfaces';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Inject, Injectable } from '@nestjs/common';

interface SDKWeatherProviderConfig {
  apiKey: string;
}

@Injectable()
export class NinjaWeatherSdk implements IWeatherApi {
  private readonly apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    @Inject('SDKWeatherProviderConfig') config: SDKWeatherProviderConfig,
  ) {
    this.apiKey = config.apiKey;
  }
  async getCity(city: string): Promise<IWeatherResponseData> {
    const rc = {
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<IWeatherResponseData>(
          `https://api.api-ninjas.com/v1/weather?city=${city}`,
          rc,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response.data;
          }),
        ),
    );
    return data;
  }
}
