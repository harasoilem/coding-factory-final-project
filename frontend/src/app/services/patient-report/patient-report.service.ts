import { Injectable } from '@angular/core';
import {CrudSimpleService} from "../crud-simple/crud-simple.service";
import {HttpClient} from "@angular/common/http";
import {PatientReport} from "../../models/patient_report";

@Injectable({
  providedIn: 'root'
})
export class PatientReportService extends CrudSimpleService<PatientReport> {
  constructor(protected override http: HttpClient) {
    super(http, 'patient_report', 'patient_reportPaginated');
  }

}
