import {FormFieldBase} from './form-field-base';
import {FormFieldControlTypeEnum} from '../enums/form-field-control-type';


export class TextFormField extends FormFieldBase<string> {
  override controlType = FormFieldControlTypeEnum.textbox;
}
