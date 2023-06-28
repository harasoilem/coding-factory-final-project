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
import {FormFieldBase, FormFieldOption} from "../../dynamic-form-fields/models/form-field-base";
import {Patient} from "../../models/patient";
import {TextFormField} from "../../dynamic-form-fields/models/text-form-field";
import {FromFieldTypeEnum} from "../../dynamic-form-fields/enums/form-field-type";
import {DateFormField} from "../../dynamic-form-fields/models/date-form-field";
import {FromFieldIconEnum} from "../../dynamic-form-fields/enums/form-field-icon";
import moment from 'moment';
import {TableColumn, TableColumnTypeEnum} from "../../models/table-column";
import {PatientReport} from "../../models/patient_report";
import {MatTableDataSource} from "@angular/material/table";
import {FromFieldFaIconEnum} from "../../dynamic-form-fields/enums/form-field-fa-icon";

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent implements OnInit {

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
  patientReportList: Array<PatientReport> = [];
  patientId: string;

  patientReportsTableColumns: Array<TableColumn> = [];
  patientReportsTableColumnNames: Array<string> = [];
  patientReportsDataSource = new MatTableDataSource<PatientReport>([]);
  infoIcon = FromFieldFaIconEnum.info;


  ngOnDestroy() {
    this.document.body.classList.remove('body_background');
  }


  async ngOnInit() {

    this.patientId = this.route.snapshot.params['id'];
    this.isAddNew = this.patientId == null;

    this.document.body.classList.add('body_background');
    await this.initPage();
  }


  private async initPage() {

    if (this.patientId != null) {
      try {
        this.patient = await this.patientService.getById(this.patientId);

        this.patientReportList = await this.patientReportService.getAllFiltered({patient: this.patient.id});


        await this.initPatientReportsTable();

      } catch (e) {
        this.uiHelper.openSnackBar('Patient with id ' + this.patientId + ' was not found', null, 'warning-snackbar');
        await this.router.navigate(['/']);
        return;
      }
    }

    this.initFields();

  }

  initFields() {

    this.fields = [

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'first_name',
        value: this.patient.first_name,
        label: 'Όνομα',
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
        validators: [Validators.required,
          Validators.minLength(1)],
      }),

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'last_name',
        value: this.patient.last_name,
        label: 'Επίθετο',
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
        validators: [Validators.required,
          Validators.minLength(1)],
      }),

      new DateFormField({
        key: 'date_of_birth',
        value: moment(this.patient.date_of_birth, 'YYYY-MM-DD'),
        label: 'Ημερομηνία γέννησης',
        icon: FromFieldIconEnum.none,
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
        validators: [Validators.required]
      }),

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'amka',
        value: this.patient.amka,
        label: 'ΑΜΚΑ',
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
        validators: [Validators.required,
          Validators.minLength(1)],
      }),

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'phone_number',
        value: this.patient.phone_number,
        label: 'Τηλέφωνο',
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
        validators: [Validators.required,
          Validators.minLength(1)],
      }),

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'address',
        value: this.patient.address,
        label: 'Διεύθυνση',
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
        validators: [],
      }),

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'city',
        value: this.patient.city,
        label: 'Πόλη',
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
        validators: [],
      }),

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'postal_code',
        value: this.patient.postal_code,
        label: 'ΤΚ',
        classes: ['w-full', 'md:w-1/4 px-4', 'm-0'],
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
    this.populatePatientObject();

    const formValues = this.dynamicForm.value;

    if (formValues.date_of_birth != null) {
      this.patient.date_of_birth = moment(formValues.date_of_birth).format('yyyy-MM-DD');
    }

    if (this.isAddNew) {
      try {
        this.patient = await this.patientService.add(this.patient);
        await this.router.navigate(['/patient/' + this.patient.id]);
        this.uiHelper.openSnackBar('Ο Ασθενής προστέθηκε επιτυχώς', null, 'success-snackbar');
      } catch (e) {
        this.uiHelper.openSnackBar('Ο Ασθενής δεν προστέθηκε παρουσιάστηκε σφάλμα', null, 'error-snackbar');
      }
    } else {
      try {
        this.patient = await this.patientService.update(this.patient);
        this.uiHelper.openSnackBar('Ο Ασθενής ενημερώθηκε επιτυχώς', null, 'success-snackbar');
      } catch (e) {
        this.uiHelper.openSnackBar('Ο Ασθενής δεν ενημερώθηκε παρουσιάστηκε σφάλμα', null, 'error-snackbar');
      }
    }

    this.loading = false;
  }


  populatePatientObject() {
    const formValues = this.dynamicForm.getRawValue();
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        this.patient[key] = formValues[key];
      }
    }
  }

  private async initPatientReportsTable() {
    try {

      // export class PatientReport {
      //   id: number;
      //   patient: number;
      //   symptoms: string;
      //   medication: string;
      //   allergies: string;
      //   diagnosis: string;
      //   treatment: string;
      //   created_by: number;
      //   updated_by: number;
      //   created_at: string;
      //   updated_at: string;
      // }


      this.patientReportsTableColumns = [
        new TableColumn('patientReport', '', '', TableColumnTypeEnum.none),
        new TableColumn('symptoms', 'Symptoms', 'symptoms', TableColumnTypeEnum.path),
        new TableColumn('medication', 'Medication', 'medication', TableColumnTypeEnum.path),
        new TableColumn('allergies', 'Allergies', 'allergies', TableColumnTypeEnum.path),
        new TableColumn('diagnosis', 'Diagnosis', 'diagnosis', TableColumnTypeEnum.path),
        new TableColumn('treatment', 'Treatment', 'treatment', TableColumnTypeEnum.path),
        new TableColumn('created_at', 'Created At', 'created_at', TableColumnTypeEnum.dateTime),
        new TableColumn('updated_at', 'Updated At', 'updated_at', TableColumnTypeEnum.dateTime),

      ];

      this.patientReportsTableColumnNames = this.patientReportsTableColumns.map(x => x.name);

      this.patientReportsDataSource.data = this.patientReportList;
    } catch (e) {

    }
  }


}
