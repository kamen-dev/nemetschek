import { ApplicationConfig, Injector, provideZoneChangeDetection } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { TextStorageService } from './text-storage/text-storage.service';
import { LocalService } from './text-storage/local.service';
import { CookieService } from './text-storage/cookie.service';

const cache = {
  storageType: 'local-storage'
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    {
      provide: TextStorageService,
      useFactory: (route: ActivatedRoute, injector: Injector) => {
        let storageType = route.snapshot.queryParams['storage-type'];
        if (storageType !== undefined) {
          // save storage-type so I won't have to keep it in urls
          cache.storageType = storageType.toLowerCase();;
        }

        switch (cache.storageType) {
          case 'cookie':
            return injector.get(CookieService);

          case 'local-storage':
          default:
            return injector.get(LocalService);
        }
      },
      deps: [ActivatedRoute, Injector]
    }
  ]
};
