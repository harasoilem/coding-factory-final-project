import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFieldBase} from '../../models/form-field-base';


@Injectable({
  providedIn: 'root'
})

export class DynamicFormFieldService {
  toFormGroup(fields: FormFieldBase<any>[]) {
    const group: any = {};
    fields.forEach(field => {
      if (field.key != null && field.key !== '') {
        group[field.key] = field.validators.length > 0 ? new FormControl(field.value, field.validators)
          : new FormControl(field.value);
      }
    });
    return new FormGroup(group);
  }
}
