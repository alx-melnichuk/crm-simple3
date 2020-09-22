import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DEMO_USER1_LOGIN, DEMO_USER1_PASSWD, VERSION_APP } from '../../../../lib-core/src/lib/lib-core.const';
import { AutoUnsubscribe } from '../../../../lib-core/src/lib/decorators/auto-unsubscribe';
import { AuthorizeApiService } from '../services/authorize-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
@AutoUnsubscribe()
export class SigninComponent implements OnInit {

  public demoUserLogin: string | null = DEMO_USER1_LOGIN;
  public demoUserPassword: string | null = DEMO_USER1_PASSWD;
  public version: string | null = VERSION_APP;

  public formGroup: FormGroup;

  private controlList = {
    login: new FormControl(null, [Validators.required]),
    password: new FormControl(null)
  };
  private unsubCheckLogin: Subscription;

  constructor(private authorizeApiService: AuthorizeApiService) {
    this.formGroup = new FormGroup(this.controlList);
  }

  ngOnInit(): void {
  }

  // ** Public API **

  public clickSignIn(): void {
    console.log('clickSignIn()');
    if (this.unsubCheckLogin != null) {
      this.unsubCheckLogin.unsubscribe();
    }
    const login = this.controlList.login.value;
    const password = this.controlList.password.value;
    this.unsubCheckLogin = this.authorizeApiService.signin({ login, password })
      .subscribe((response) => {
        console.log('clickSignIn() checkLogin()=', response);
      });
  }

}
