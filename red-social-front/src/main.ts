import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

if ('serviceWorker' in navigator && environment.production) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('ngsw-worker.js')
      .then(reg => console.log('Service Worker registrado ✅', reg))
      .catch(err => console.error('Error al registrar Service Worker ❌', err));
  });
}