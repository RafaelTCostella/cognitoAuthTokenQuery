import { Component, OnInit } from '@angular/core';
import { CognitoUser, ICognitoUserData, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userPoolId: string;
  clientId: string;
  login: string;
  password: string;
  loading: boolean;

  tokens: object;
  error: string;

  ngOnInit() {
    this.recoverStorage();
  }

  getTokens() {
    this.loading = true;
    this.setStorage();

    let cognitoUser = new CognitoUser(this.userDetails());
    cognitoUser.authenticateUser(this.authenticationDetails(), {
      onSuccess: (result) => {
        this.loading = false;
        this.tokens = {
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken()
        };
      },
      onFailure: (err) => {
        this.loading = false;
        this.error = err;
      }
    });
  }

  private authenticationDetails() {
    return new AuthenticationDetails({
      Username: this.login,
      Password: this.password
    });
  }

  private userDetails(): ICognitoUserData {
    return <ICognitoUserData>{
      Username: this.login,
      Pool: new CognitoUserPool({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId
      })
    };
  }

  private recoverStorage(): void {
    this.clientId = window.localStorage.getItem('clientId');
    this.userPoolId = window.localStorage.getItem('userPoolId');
    this.login = window.localStorage.getItem('login');
  }

  private setStorage(): void {
    window.localStorage.setItem('clientId', this.clientId);
    window.localStorage.setItem('userPoolId', this.userPoolId);
    window.localStorage.setItem('login', this.login);
  }
}
