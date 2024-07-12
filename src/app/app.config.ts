import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import player from 'lottie-web';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideLottieOptions} from "ngx-lottie";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {provideToastr} from "ngx-toastr";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideLottieOptions({
      player: () => player,
    }),
    provideHttpClient(withFetch()),
    provideToastr(),
    provideAnimations()
  ]
};
