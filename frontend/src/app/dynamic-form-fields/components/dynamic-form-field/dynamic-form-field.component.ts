import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormFieldBase, FormFieldOption} from '../../models/form-field-base';
import {FormFieldControlTypeEnum} from '../../enums/form-field-control-type';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {debounceTime, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Moment} from "moment";
import {MatDatepicker} from "@angular/material/datepicker";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DynamicFormFieldComponent implements OnInit {
  @Input() field: FormFieldBase<string> | undefined;
  @Input() form: FormGroup | undefined;
  @Input() readonly: boolean | undefined;
  @Input() filterValueKey: string | undefined;

  @Output() pressEnterEvent = new EventEmitter<any>();
  @Output() valueChangedEvent = new EventEmitter<any>();

  @ViewChild('chipAutocompleteInput') chipAutocompleteInput: ElementRef<HTMLInputElement>;


  customRequiredError: string | null = null;
  loadingOptions = false;
  hidePassword = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chipAutocompleteSelections = [];

  filteredOptions: Observable<FormFieldOption<any>[]> | undefined;

  isPasswordField: boolean = false;

  ngOnInit(): void {
    if (this.field === undefined) {
      return;
    } else if (this.field.controlType === FormFieldControlTypeEnum.dropdown
      || this.field.controlType === FormFieldControlTypeEnum.checkbox) {
      if (this.readonly) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    } else if (this.field.controlType === FormFieldControlTypeEnum.autocomplete ) {
      this.filteredOptions = this.control.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? this._filter(value) : this._filter(value.displayValue))
          // map(value => typeof value === 'string' ? value : value.),
          // map(name => name ? this._filter(name) : this.options.slice())
        );
    }

    if (this.field.controlType !== FormFieldControlTypeEnum.chipAutocomplete) {
      const debounceMilliseconds = this.field.controlType === FormFieldControlTypeEnum.dropdown ? 0 : 500;

      this.control?.valueChanges.pipe(debounceTime(debounceMilliseconds))
        .subscribe((value) => this.valueChangedEvent?.emit(value));
    } else {
      this.chipAutocompleteSelections = this.control.value;
    }

    if (this.field.type === 'password') {
      this.isPasswordField = true;
    }
  }

  displayFn(optionValue: any): string {
    const option = this.field?.options.find(o => o.value === optionValue);
    return option && option.displayValue ? option.displayValue : '';
  }

  private _filter(value: string): FormFieldOption<any>[] {
    const filterValue = value?.toLowerCase();
    if (this.field === undefined) {
      return [];
    }
    return this.field.options.filter(option => option.displayValue.toLowerCase().includes(filterValue));
  }

  get isValid(): boolean {
    if (this.field === undefined) {
      return false;
    }
    // @ts-ignore
    return this.form.controls[this.field.key].valid;
  }

  get control(): FormControl {
    if (this.field === undefined) {
      return new FormControl();
    }
    return this.form?.controls[this.field.key] as FormControl;
  }

  optionsLoading(loading: boolean) {
    this.loadingOptions = loading;
  }

  updateSelection(selection: any) {
    this.control.setValue(selection);
  }

  updateOptions(newOptions: FormFieldOption<any>[]) {
    if (this.field === undefined) {
      return;
    }
    this.field.options = newOptions;
    this.loadingOptions = false;
  }

  onEnter() {
    this.pressEnterEvent.emit();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
    this.field.type = this.hidePassword ? 'password' : 'text';
  }


  getSubscriptSizing() {
    return this.field.errorSizeFixed ? 'fixed' : 'dynamic'
  }
}
