import {Component, OnInit} from '@angular/core';
import {PatientService} from "../../services/patient/patient.service";
import {UiHelper} from "../../helpers/ui-helper";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {TableColumn, TableColumnTypeEnum} from "../../models/table-column";
import {MatTableDataSource} from "@angular/material/table";
import {Patient} from "../../models/patient";
import {FromFieldFaIconEnum} from "../../dynamic-form-fields/enums/form-field-fa-icon";

@Component({
  selector: 'app-patient-list-page',
  templateUrl: './patient-list-page.component.html',
  styleUrls: ['./patient-list-page.component.scss']
})
export class PatientListPageComponent implements OnInit {

  constructor(private patientService: PatientService,
              private uiHelper: UiHelper,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,) {
  }

  patientList: Patient[] = [];

  patientsTableColumns: Array<TableColumn> = [];
  patientsTableColumnNames: Array<string> = [];
  patientsDataSource = new MatTableDataSource<Patient>([]);
  infoIcon = FromFieldFaIconEnum.patient;

  isLoadingTable = false;

  iconConfig = {};

  async ngOnInit() {
    await this.initPage();
  }


  private async initPage() {
    try {
      this.initTable();

      this.patientList = await this.patientService.getAll();


      this.patientsDataSource.data = this.patientList;
    } catch (e) {
      console.log(e);
    }
  }

  private async initTable() {
    try {
      this.patientsTableColumns = [
        new TableColumn('patient', '', '', TableColumnTypeEnum.none),
        new TableColumn('id', 'ID', 'id', TableColumnTypeEnum.path),
        new TableColumn('first_name', 'First name', 'first_name', TableColumnTypeEnum.path),
        new TableColumn('last_name', 'Last name', 'last_name', TableColumnTypeEnum.path),
        new TableColumn('amka', 'AMKA', 'amka', TableColumnTypeEnum.path),
      ];

      this.patientsTableColumnNames = this.patientsTableColumns.map(x => x.name);

    } catch (e) {

    }
  }


  async addPatient() {
    await this.router.navigate(['patient-add']);
  }
}
