import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';

export class DropDownFormField<T> extends FormFieldBase<T> {
  override controlType = FormFieldControlTypeEnum.dropdown;
}
