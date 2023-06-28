export class TableColumn {
  name: string;
  displayName: string;
  valuePath: string;
  valuePathExtra: any[][];
  dataType: TableColumnTypeEnum;
  separator: string;
  iconConfig: object;

  constructor(name: string, displayName: string, valuePath: string, dataType: TableColumnTypeEnum,
              valuePathExtra = [[]], separator = ', ', iconConfig = {}) {
    this.name = name;
    this.displayName = displayName;
    this.valuePath = valuePath;
    this.dataType = dataType;
    this.valuePathExtra = valuePathExtra;
    this.separator = separator;
    this.iconConfig = iconConfig;
  }
}

export enum TableColumnTypeEnum {
  none = 'none',
  path = 'path',
  pathEuro = 'pathEuro',
  multiPath = 'multiPath',
  mapArray = 'mapArray',
  dateSimple = 'dateSimple',
  date = 'date',
  dateTime = 'dateTime',
  time = 'time',
  icon = 'icon',
}
