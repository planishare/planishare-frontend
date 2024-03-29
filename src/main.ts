import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/core/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
    if (window && !localStorage.getItem('enableConsole')) {
        window.console.log = () => {};
        window.console.warn = () => {};
        window.console.info = () => {};
    }
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
