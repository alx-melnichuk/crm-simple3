import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DEMO_LOGIN1, DEMO_PASSWD1, VERSION_APP } from '../../../../lib-core/src/lib/lib-core.const';
import { AutoUnsubscribe } from '../../../../lib-core/src/lib/decorators/auto-unsubscribe';
import { AuthorizeApiService } from '../services/authorize-api.service';
import { AuthorizeDto } from '../services/authorize.interface';
import { NavigateUtil } from '../../../../../projects/lib-core/src/lib/utils/navigate.util';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
@AutoUnsubscribe()
export class SigninComponent implements OnInit {

  public demoUserLogin: string | null = DEMO_LOGIN1;
  public demoUserPassword: string | null = DEMO_PASSWD1;
  public version: string | null = VERSION_APP;

  public formGroup: FormGroup;

  private controlList = {
    login: new FormControl(null, [Validators.required]),
    password: new FormControl(null)
  };
  private unsubSignin: Subscription;

  constructor(private authorizeApiService: AuthorizeApiService) {
    this.formGroup = new FormGroup(this.controlList);
  }

  ngOnInit(): void {
  }

  // ** Public API **

  public clickSignIn(): void {
    if (this.unsubSignin != null) {
      this.unsubSignin.unsubscribe();
    }
    const login = this.controlList.login.value;
    const password = this.controlList.password.value;
    this.unsubSignin = this.authorizeApiService.signin({ login, password })
      .subscribe((response: AuthorizeDto) => {
        if (response != null) {
          NavigateUtil.reloadByPathName('/app-client/list');
        }
      });
  }

}
