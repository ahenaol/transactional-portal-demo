import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthService {
  forgottenPassword : boolean

  constructor(private authService : MsalService) {
    this.forgottenPassword = false;
  }

  login() {
    if(this.forgottenPassword) {
      this.authService.authority = environment.auth.authorityPR;
      this.forgottenPassword = false;
    } else {
      this.authService.authority = environment.auth.authoritySuSi;
    }

    this.authService.loginPopup(environment.auth.b2cScopes)
    .catch(err => {
      if(err.indexOf('AADB2C90118') > -1) {
        // The user has forgotten their password
        this.forgottenPassword = true;
        this.login();
      } else if(err.indexOf('AADB2C90091') > -1) {
        // The user has cancelled entering self-asserted information
        this.login();
      } else {
        // console.error(err);
      }
    });
  }

  logout() {
    console.log("logout");
    this.authService.logout();
  }
}
