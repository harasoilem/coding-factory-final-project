import {Component, Inject, OnInit} from '@angular/core';
import {PatientService} from "../../services/patient/patient.service";
import {PatientReportService} from "../../services/patient-report/patient-report.service";
import {UiHelper} from "../../helpers/ui-helper";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {
  DynamicFormFieldService
} from "../../dynamic-form-fields/services/dynamic-form-field/dynamic-form-field.service";
import {DOCUMENT} from "@angular/common";
import {UntypedFormGroup, Validators} from "@angular/forms";
import {FormFieldBase} from "../../dynamic-form-fields/models/form-field-base";
import {Patient} from "../../models/patient";
import {PatientReport} from "../../models/patient_report";
import {FromFieldTypeEnum} from "../../dynamic-form-fields/enums/form-field-type";
import {TextAreaFormField} from "../../dynamic-form-fields/models/text-area-form-field";

@Component({
  selector: 'app-patient-report-page',
  templateUrl: './patient-report-page.component.html',
  styleUrls: ['./patient-report-page.component.scss']
})
export class PatientReportPageComponent implements OnInit {
  constructor(private patientService: PatientService,
              private patientReportService: PatientReportService,
              private uiHelper: UiHelper,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private dfs: DynamicFormFieldService,
              @Inject(DOCUMENT) private document) {
  }


  loading = false;
  isAddNew = false;
  dynamicForm: UntypedFormGroup;
  fields: FormFieldBase<any>[] = [];
  patient: Patient = new Patient();
  patientReport: PatientReport = new PatientReport();
  patientReportId: string;
  patientId: string;




  ngOnDestroy() {
    this.document.body.classList.remove('body_background');
  }


  async ngOnInit() {
    this.document.body.classList.add('body_background');
    await this.initPage();
  }


  private async initPage() {
    this.patientId = this.route.snapshot.params["patientId"];
    this.patientReportId = this.route.snapshot.params["id"];


    if (this.patientId != null) {
      // is new
      try {
        this.isAddNew = true;
        this.patient = await this.patientService.getById(this.patientId);
        this.patientReport.patient = Number(this.patientId);
      } catch (e) {
        this.uiHelper.openSnackBar('Patient not found', null, 'warning-snackbar');
        await this.router.navigate(['/']);
        return;
      }
    } else if (this.patientReportId != null) {
      // is edit
      try {
        this.patientReport = await this.patientReportService.getById(this.patientReportId);
        this.patient = await this.patientService.getById(this.patientReport.patient);


      } catch (e) {
        this.uiHelper.openSnackBar('Patient Report with id ' + this.patientId + ' was not found', null, 'warning-snackbar');
        await this.router.navigate(['/']);
        return;
      }
    } else {
      this.uiHelper.openSnackBar('Patient or patient report id mandatory', null, 'warning-snackbar');
      await this.router.navigate(['/']);
      return;
    }

    await this.initFields();
  }


  initFields() {

    this.fields = [

      new TextAreaFormField({
        type: FromFieldTypeEnum.text,
        key: 'symptoms',
        value: this.patientReport.symptoms,
        label: 'Συμπτώματα',
        classes: ['w-full',],
        validators: [Validators.required,
          Validators.minLength(1)],
      }),

      new TextAreaFormField({
        type: FromFieldTypeEnum.text,
        key: 'medication',
        value: this.patientReport.medication,
        label: 'Φάρμακα',
        classes: ['w-full',],
        validators: [],
      }),

      new TextAreaFormField({
        type: FromFieldTypeEnum.text,
        key: 'allergies',
        value: this.patientReport.allergies,
        label: 'Αλλεργίες',
        classes: ['w-full',],
        validators: [],
      }),

      new TextAreaFormField({
        type: FromFieldTypeEnum.text,
        key: 'diagnosis',
        value: this.patientReport.diagnosis,
        label: 'Διάγνωση',
        classes: ['w-full',],
        validators: [],
      }),

      new TextAreaFormField({
        type: FromFieldTypeEnum.text,
        key: 'treatment',
        value: this.patientReport.treatment,
        label: 'Θεραπεία',
        classes: ['w-full',],
        validators: [],
      }),
    ];


    this.dynamicForm = this.dfs.toFormGroup(this.fields);
  }

  async onSave() {
    this.dynamicForm.markAllAsTouched();

    if (this.dynamicForm.invalid) {
      this.uiHelper.openSnackBar('fill missing values', null, 'warning-snackbar');
      return;
    }

    this.loading = true;
    this.populatePatientReportObject();

    if (this.isAddNew) {
      try {
        this.patientReport = await this.patientReportService.add(this.patientReport);
        await this.router.navigate(['/patient-report/' + this.patientReport.id]);
        this.uiHelper.openSnackBar('Η Αναφορά Ασθενή προστέθηκε επιτυχώς', null, 'success-snackbar');
      } catch (e) {
        this.uiHelper.openSnackBar('Η Αναφορά Ασθενή δεν προστέθηκε παρουσιάστηκε σφάλμα', null, 'error-snackbar');
      }
    } else {
      try {
        this.patientReport = await this.patientReportService.update(this.patientReport);
        this.uiHelper.openSnackBar('Η Αναφορά Ασθενή ενημερώθηκε επιτυχώς', null, 'success-snackbar');
      } catch (e) {
        this.uiHelper.openSnackBar('Η Αναφορά Ασθενή δεν ενημερώθηκε παρουσιάστηκε σφάλμα', null, 'error-snackbar');
      }
    }

    this.loading = false;
  }


  populatePatientReportObject() {
    const formValues = this.dynamicForm.getRawValue();
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        this.patientReport[key] = formValues[key];
      }
    }
  }
}
