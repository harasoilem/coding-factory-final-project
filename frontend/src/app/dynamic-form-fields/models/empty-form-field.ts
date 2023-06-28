import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';

export class EmptyFormField extends FormFieldBase<null> {
  override controlType = FormFieldControlTypeEnum.none;
}
