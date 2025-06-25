import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

import { appConfig } from './app/app.config';  // IMPORTANTE: importar appConfig si existe

const appConfigConHttp = {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideHttpClient()
  ]
};

bootstrapApplication(AppComponent, appConfigConHttp)
  .catch((err) => console.error(err));