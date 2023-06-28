import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';
import {Moment} from 'moment';


export class DateFormField extends FormFieldBase<Moment> {
  override controlType = FormFieldControlTypeEnum.datepicker;
}
