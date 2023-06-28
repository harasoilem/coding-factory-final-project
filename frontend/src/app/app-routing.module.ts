import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {PatientListPageComponent} from "./pages/patient-list-page/patient-list-page.component";
import {AuthGuard} from "./guards/auth.guard";
import {PatientPageComponent} from "./pages/patient-page/patient-page.component";
import {LoginGuard} from "./guards/login.guard";
import {PatientReport} from "./models/patient_report";
import {PatientReportPageComponent} from "./pages/patient-report-page/patient-report-page.component";

const routes: Routes = [

  {
    path: '',
    title: 'Λίστα Ασθενών',
    component: PatientListPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginPageComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'patient-list',
    title: 'Λίστα Ασθενών',
    component: PatientListPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:id',
    title: 'Επεξεργασία Ασθενή',
    component: PatientPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient-add',
    title: 'Προσθήκη Ασθενή',
    component: PatientPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient-report/add/:patientId',
    title: 'Προσθήκη Αναφοράς',
    component: PatientReportPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient-report/:id',
    title: 'Αναφορά',
    component: PatientReportPageComponent,
    canActivate: [AuthGuard],
  },
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
