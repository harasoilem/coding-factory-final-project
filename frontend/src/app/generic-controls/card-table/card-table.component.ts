import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TableColumn} from '../../models/table-column';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {EventEmitter} from '@angular/core';


@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  @Input() infoUrl = '';

  @Input() addNewUrl = '';
  @Input() name = '';
  @Input() infoIcon = null;
  @Input() columns: Array<TableColumn> = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input() set tableDataSource(value: MatTableDataSource<any>) {
    this.dataSource = value;
    this.dataSource.sort = this.sort;
  }

  @Input() displayedColumns: Array<string> = [];

  @Output() deleteEvent = new EventEmitter<any>();
  @Output() copyEvent = new EventEmitter<any>();

  @Output() addNewEvent = new EventEmitter<any>();
  @Output() infoEvent = new EventEmitter<any>();
  @Input() highlightColorPath = null;

  dataSource = new MatTableDataSource<any>([]);

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  async createNew() {
    if (this.addNewUrl !== '') {
      await this.router.navigate([this.addNewUrl]);
      return;
    }
    this.addNewEvent.emit();
  }
}
