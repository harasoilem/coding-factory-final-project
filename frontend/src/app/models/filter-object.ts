export class FilterObject {
  value: string;
  displayValue: string;
  type: FilterObjectTypeEnum;
  icon: string;
  colorClass: string;


  constructor(value: string = '', type: FilterObjectTypeEnum = FilterObjectTypeEnum.text,
              icon: string = '', colorClass: string = '', displayValue: string = '') {
    this.value = value;
    this.type = type;
    this.icon = icon;
    this.colorClass = colorClass;
    this.displayValue = displayValue;
  }
}

export enum FilterObjectTypeEnum {
  text = 'text',
  icon = 'icon',
  date = 'date',
}
