import { InjectionToken, NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

// Modules
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material.module';

// Firebase
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import * as Rollbar from 'rollbar';
import { RollbarErrorHandlerService } from './core/services/rollbar-error-handler.service';
import { RollbarHttpErrorInterceptor } from './core/interceptors/rollbar-http-error.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';

const rollbarConfig: Rollbar.Configuration = {
    accessToken: '722c61425c0043098adab09252c3732f',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: environment.production,
    environment: environment.production ? 'prod' : 'dev'
};

export function rollbarFactory() {
    return new Rollbar(rollbarConfig);
}
export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        CoreModule,
        MaterialModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideStorage(() => getStorage()),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        ScreenTrackingService,
        UserTrackingService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true // Intercept all requests
        },
        { provide: ErrorHandler, useClass: RollbarErrorHandlerService },
        { provide: RollbarService, useFactory: rollbarFactory },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RollbarHttpErrorInterceptor,
            multi: true // Intercept all requests
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
