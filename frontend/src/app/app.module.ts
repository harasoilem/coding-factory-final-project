import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppMaterialModule} from "./app-material/app-material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import {AuthGuard} from "./guards/auth.guard";
import {FlatButtonComponent} from "./generic-controls/flat-button/flat-button.component";
import {
  DynamicFormFieldComponent
} from "./dynamic-form-fields/components/dynamic-form-field/dynamic-form-field.component";
import {DialogComponent} from "./generic-controls/dialog/dialog.component";
import { PatientListPageComponent } from './pages/patient-list-page/patient-list-page.component';
import { PatientPageComponent } from './pages/patient-page/patient-page.component';
import {MenuComponent} from "./generic-controls/menu/menu.component";
import {TableComponent} from "./generic-controls/table/table.component";
import {CardTableComponent} from "./generic-controls/card-table/card-table.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PatientReportPageComponent } from './pages/patient-report-page/patient-report-page.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormFieldComponent,
    LoginPageComponent,
    DialogComponent,
    FlatButtonComponent,
    PatientListPageComponent,
    PatientPageComponent,
    MenuComponent,
    TableComponent,
    CardTableComponent,
    PatientReportPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [
    AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
