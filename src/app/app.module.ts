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
        CoreModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
