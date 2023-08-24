import { InjectionToken, NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';

// Firebase
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RollbarErrorHandlerService } from './services/rollbar-error-handler.service';
import { ServiceWorkerModule } from '@angular/service-worker';

// Rollbar
import * as Rollbar from 'rollbar';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavigationSidenavComponent } from './components/navigation-sidenav/navigation-sidenav.component';
import { AuthService } from './services/auth.service';
import { UsersService } from '../features/user/services/users.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { IsAuthGuard } from './guards/is-auth.guard';
import { IsNotAuthGuard } from './guards/is-not-auth.guard';
import { IsVerificatedGuard } from './guards/is-verificated.guard';
export function rollbarFactory() {
    return new Rollbar(environment.externalService.rollbar);
}
export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent,
        NavbarComponent,
        NavigationSidenavComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        provideFirebaseApp(() => initializeApp(environment.externalService.firebase)),
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
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true // Intercept all requests
        },
        { provide: ErrorHandler, useClass: RollbarErrorHandlerService },
        { provide: RollbarService, useFactory: rollbarFactory },
        AuthService,
        UsersService,
        FirebaseAuthService,
        RollbarErrorHandlerService,

        // Guards
        IsAuthGuard,
        IsNotAuthGuard,
        IsVerificatedGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
