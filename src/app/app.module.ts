import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageModule } from './features/homepage/homepage.module';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HomepageModule,
        SharedModule,
        BrowserAnimationsModule,
        CoreModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore())
    ],
    providers: [
        ScreenTrackingService,
        UserTrackingService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true // Intercept all requests
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
