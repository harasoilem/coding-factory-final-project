import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';

export class AutoCompleteFormField<T> extends FormFieldBase<T> {
  override controlType = FormFieldControlTypeEnum.autocomplete;
}
