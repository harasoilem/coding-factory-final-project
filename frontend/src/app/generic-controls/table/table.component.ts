import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {get} from 'lodash';
import {TableColumn, TableColumnTypeEnum} from '../../models/table-column';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import moment from 'moment';
import {IconDefinition} from '@fortawesome/free-regular-svg-icons';
import {faCopy, faDeleteLeft, faTrash, faTrashAlt} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() infoUrl = '';
  @Input() infoIcon = null;
  @Input() columns: Array<TableColumn> = [];
  @Input() tableStyle = '';
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input() set tableDataSource(value: MatTableDataSource<any>) {
    this.dataSource = value;
  }

  @Input() displayedColumns: Array<string> = [];

  @Output() deleteEvent = new EventEmitter<any>();

  @Output() copyEvent = new EventEmitter<any>();

  @Output() infoEvent = new EventEmitter<any>();

  @Input() isLoading = false;

  @Input() disableSort = false;

  @Input() highlightColorPath = null;

  @Input() openInNewTab = false;

  dataSource = new MatTableDataSource<any>([]);
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  delete: IconDefinition = faTrash;
  copy: IconDefinition = faCopy;

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async showInfo(element) {
    if (this.infoUrl !== '') {
      if (this.openInNewTab) {
        window.open(this.infoUrl + element.id, '_blank');
      } else {
        await this.router.navigate([this.infoUrl + element.id]);
      }
      return;
    }
    this.infoEvent.emit(element);
  }

  getProperty(object, tableColumn: TableColumn) {
    if (tableColumn == null) {
      return '';
    }
    if (tableColumn.dataType === TableColumnTypeEnum.none) {
      return '';
    } else if (tableColumn.dataType === TableColumnTypeEnum.path) {
      let value = '';
      try {
        value = get(object, tableColumn.valuePath) ?? '';
      } catch (e) {

      }
      if (typeof value === 'boolean') {
        return value ? 'yes' : 'no';
      }

      if (value != null && value.toString().match(this.mailformat)) {
        value = value.replace('.poliservice', '').replace('@gmail.com', '');
      }

      return value ?? '';
    } else if (tableColumn.dataType === TableColumnTypeEnum.pathEuro) {
      let value = '';
      try {
        value = get(object, tableColumn.valuePath) ?? '';
      } catch (e) {

      }
      if (value != null && value !== '') {
        value = Number(value).toLocaleString('el-GR', {style: 'currency', currency: 'EUR'});
      }

      return value ?? '';
    } else if (tableColumn.dataType === TableColumnTypeEnum.mapArray) {

      let value = null;
      try {
        value = get(object, tableColumn.valuePath).map(o => {
            const valueArray = [];
            try {
              for (const extra of tableColumn.valuePathExtra) {
                valueArray.push(get(o, extra));
              }
            } catch (e) {
              value = [];
            }

            return valueArray.length === 0 ? '' : valueArray.join(tableColumn.separator);
          }
        ).join(', ');
      } catch (e) {

      }

      return value ?? '';
    } else if (tableColumn.dataType === TableColumnTypeEnum.multiPath) {

      let value = [];
      try {
        for (const extra of tableColumn.valuePathExtra) {
          value.push(get(get(object, tableColumn.valuePath), extra));
        }
      } catch (e) {
        value = [];
      }

      return value.length === 0 ? '' : value.join(tableColumn.separator).replace('.poliservice', '').replace('@gmail.com', '');
    } else if (tableColumn.dataType === TableColumnTypeEnum.date) {

      let value = '';
      try {
        value = get(object, tableColumn.valuePath) ?? '';
        if (value == null || value === '') {
          return '';
        }
        const dateTime = moment(value, 'YYYY-MM-DDThh:mm:ssZ');
        value = dateTime.format('DD/MM/YYYY');
      } catch (e) {

      }

      return value;
    } else if (tableColumn.dataType === TableColumnTypeEnum.dateTime) {

      let value = '';
      try {
        value = get(object, tableColumn.valuePath) ?? '';
        if (value == null || value === '') {
          return '';
        }
        const dateTime = moment(value, 'YYYY-MM-DDThh:mm:ssZ');
        value = dateTime.format('DD/MM/YYYY HH:mm:ss');
      } catch (e) {

      }

      return value;
    } else if (tableColumn.dataType === TableColumnTypeEnum.time) {

      let value = '';
      try {
        value = get(object, tableColumn.valuePath) ?? '';
        if (value == null || value === '') {
          return '';
        }
        const dateTime = moment(value, 'YYYY-MM-DDThh:mm:ssZ');
        value = dateTime.format('HH:mm');
      } catch (e) {

      }

      return value;
    } else if (tableColumn.dataType === TableColumnTypeEnum.dateSimple) {

      let value = '';
      try {
        value = get(object, tableColumn.valuePath) ?? '';
        if (value == null || value === '') {
          return '';
        }
        const dateTime = moment(value, 'YYYY-MM-DD');
        value = dateTime.format('DD MMM YYYY');
      } catch (e) {

      }

      return value;
    }
  }

  getPropertyIcon(object, tableColumn: TableColumn) {
    let value = '';
    try {
      value = get(object, tableColumn.valuePath) ?? '';
      if (typeof value !== 'boolean') {
        return tableColumn.iconConfig[value].icon;
      }

      if (value) {
        return tableColumn.iconConfig['true'].icon;
      } else {
        return tableColumn.iconConfig['false'].icon;
      }


    } catch (e) {

    }
    return value;
  }

  getPropertyColor(object, tableColumn: TableColumn) {
    let value = '';
    try {
      value = get(object, tableColumn.valuePath) ?? '';
      if (typeof value !== 'boolean') {
        return tableColumn.iconConfig[value].colorClass;
      }

      if (value) {
        return tableColumn.iconConfig['true'].colorClass;
      } else {
        return tableColumn.iconConfig['false'].colorClass;
      }
    } catch (e) {

    }

    return value;
  }

  getPropertyTooltip(object, tableColumn: TableColumn) {
    let value = '';
    try {
      value = get(object, tableColumn.valuePath) ?? '';
    } catch (e) {

    }

    if (typeof value !== 'boolean') {
      return value.replace(/_/g, ' ');
    }

    return value ? 'yes' : 'no';

  }

  tableName(): string {
    if (this.columns.length === 0) {
      return '';
    }
    return this.columns[0].name.toLowerCase().replace(' ', '-')
      .replace(' ', '-').replace(' ', '-').replace(' ', '-');
  }

  deleteItem(element) {
    this.deleteEvent.emit(element);
  }

  copyItem(element) {
    this.copyEvent.emit(element);
  }

  getBackgroundColor(row) {

    if (this.highlightColorPath != null) {

      const color = get(row, this.highlightColorPath);

      return {'background-color': color + '50'};
    }

    return {'background-color': '#FFFFFF' + '00'};
  }
}
