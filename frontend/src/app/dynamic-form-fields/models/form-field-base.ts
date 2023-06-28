import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';
import {FromFieldTypeEnum} from '../enums/form-field-type';
import {FromFieldIconEnum} from '../enums/form-field-icon';
import {ValidatorFn, Validators} from '@angular/forms';


export class FormFieldOption<T> {

  value: T;
  displayValue: string;

  constructor(value: T, displayValue: string) {
    this.value = value;
    this.displayValue = displayValue;
  }
}

export class FormFieldBase<T> {
  value: T;
  key: string;
  displayKey: string;
  label: string;
  placeholder: string;
  classes: string[];
  hasClear: boolean;
  icon: FromFieldIconEnum;
  validators: ValidatorFn[];
  controlType: string;
  type: string;
  options: FormFieldOption<any>[];
  isMultiSelect: boolean;
  rows: string;
  maxLength: number;
  errorSizeFixed: boolean;

  constructor(options: {
    value?: T;
    key?: string;
    displayKey?: string;
    label?: string;
    placeholder?: string;
    classes?: string[];
    icon?: FromFieldIconEnum;
    validators?: ValidatorFn[];
    controlType?: FormFieldControlTypeEnum;
    type?: FromFieldTypeEnum;
    options?: FormFieldOption<any>[];
    isMultiSelect?: boolean;
    rows?: string;
    hasClear?: boolean;
    maxLength?: number;
    errorSizeFixed?: boolean;
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.displayKey = options.displayKey || '';
    this.label = options.label || '';
    this.icon = options.icon || FromFieldIconEnum.none;
    this.placeholder = options.placeholder || '';
    this.classes = options.classes || [];
    this.validators = options.validators || [];
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.isMultiSelect = options.isMultiSelect == null ? false : options.isMultiSelect;
    this.hasClear = options.hasClear == null ? true : options.hasClear;
    this.rows = options.rows || '3';
    this.maxLength = options.maxLength || null;
    this.errorSizeFixed = options.errorSizeFixed == null ? true : options.errorSizeFixed;
  }
}
