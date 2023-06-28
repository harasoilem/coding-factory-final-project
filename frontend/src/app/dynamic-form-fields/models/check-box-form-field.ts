import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';

export class CheckBoxFromField extends FormFieldBase<boolean> {
  override controlType = FormFieldControlTypeEnum.checkbox;
}
