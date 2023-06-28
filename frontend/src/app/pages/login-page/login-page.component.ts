import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {ApiAuthService} from "../../services/api-auth/api-auth.service";
import {UiHelper} from "../../helpers/ui-helper";
import {ActivatedRoute, Router} from "@angular/router";
import {setAccessToken} from "../../models/token";
import {TextFormField} from "../../dynamic-form-fields/models/text-form-field";
import {FromFieldTypeEnum} from "../../dynamic-form-fields/enums/form-field-type";
import {FromFieldIconEnum} from "../../dynamic-form-fields/enums/form-field-icon";
import {FormFieldBase} from "../../dynamic-form-fields/models/form-field-base";
import {
  DynamicFormFieldService
} from "../../dynamic-form-fields/services/dynamic-form-field/dynamic-form-field.service";
import {UsernameItem} from "../../helpers/local-storage/username-item";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loading: boolean = false;
  username = '';
  password = '';

  returnUrl: string = '/';

  fields: FormFieldBase<any>[] = [];
  loginForm: FormGroup = new FormGroup({});

  get formControls() {
    return this.loginForm.controls;
  }


  constructor(private apiAuthService: ApiAuthService,
              private uiHelper: UiHelper,
              private router: Router,
              private dfs: DynamicFormFieldService,
              private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/patient-list';
    this.initFields();
  }

  initFields() {

    this.fields = [

      new TextFormField({
        type: FromFieldTypeEnum.text,
        key: 'username',
        value: this.username,
        label: 'USERNAME',
        icon: FromFieldIconEnum.patient,
        placeholder: '',
        classes: ['w-full'],
        validators: [Validators.required,
          Validators.minLength(1)],
      }),

      new TextFormField({
        type: FromFieldTypeEnum.password,
        key: 'password',
        value: this.password,
        label: 'PASSWORD',
        icon: FromFieldIconEnum.mail,
        placeholder: '',
        classes: ['w-full'],
        validators: [Validators.required,
          Validators.minLength(1)],
      }),
    ];

    this.loginForm = this.dfs.toFormGroup(this.fields);
  }


  async login() {
    if(this.loading){
      return
    }
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.setLoading(true);
      try {
        const loginRequest = this.loginForm.getRawValue();
        const loginResponse = await this.apiAuthService.login(loginRequest);
        if (loginResponse != null) {
          setAccessToken(loginResponse.tokens.access);
          new UsernameItem().setItem(loginResponse.username);


          setTimeout(async () => {
            this.setLoading(false);
            await this.router.navigate([this.returnUrl]);
            this.uiHelper.openSnackBar('welcome ' + loginResponse.username, '', 'success-snackbar');
          }, 1000);
        }
      } catch (e) {
        this.uiHelper.openSnackBar('User not found', '', 'warning-snackbar');
        this.setLoading(false);
      }
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  forgotUsernameOrPassword() {

  }
}
