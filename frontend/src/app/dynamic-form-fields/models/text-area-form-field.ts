import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';


export class TextAreaFormField extends FormFieldBase<string> {
  override controlType = FormFieldControlTypeEnum.textarea;
}
