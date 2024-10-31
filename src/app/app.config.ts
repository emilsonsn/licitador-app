import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import player from 'lottie-web';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideLottieOptions} from "ngx-lottie";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideToastr} from "ngx-toastr";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {authInterceptor} from "@services/Auth/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideLottieOptions({
      player: () => player,
    }),
    provideHttpClient(withInterceptors([
      authInterceptor
    ])),
    provideToastr(),    
    provideAnimations(), provideAnimationsAsync()
  ]
};
