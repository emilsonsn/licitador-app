import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import player from 'lottie-web';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideLottieOptions} from "ngx-lottie";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideLottieOptions({
      player: () => player,
    }),
  ]
};
