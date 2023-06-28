import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';


export class TimeFormField extends FormFieldBase<string> {
  override controlType = FormFieldControlTypeEnum.timepicker;
}
