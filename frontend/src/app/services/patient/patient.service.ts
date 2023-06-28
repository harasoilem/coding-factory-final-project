import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudSimpleService} from '../crud-simple/crud-simple.service';
import {Patient} from "../../models/patient";


@Injectable({
  providedIn: 'root'
})

export class PatientService extends CrudSimpleService<Patient> {
  constructor(protected override http: HttpClient) {
    super(http, 'patient', 'patient_pagination');
  }
}
