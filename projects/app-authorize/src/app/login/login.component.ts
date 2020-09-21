import { Component, OnInit } from '@angular/core';

import { DEMO_USER1_LOGIN, DEMO_USER1_PASSWD, VERSION_APP } from '../../../../lib-core/src/lib/constants/core.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public demoUserLogin: string | null = DEMO_USER1_LOGIN;
  public demoUserPassword: string | null = DEMO_USER1_PASSWD;
  public version: string | null = VERSION_APP;

  constructor() { }

  ngOnInit(): void {
  }

  // ** Public API **

  public clickSignIn(): void {
    console.log('clickSignIn()');
  }
}
