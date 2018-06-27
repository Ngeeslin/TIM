import { Component} from '@angular/core';
import {TwitterService} from "../twitter.service";

@Component({
  selector: 'app-login-button',
  template: `
  <button (click)="handleAuthClick()">Authorize</button>
  <button (click)="handleSignoutClick()">Sign Out</button>
  `
})
export class LoginButtonComponent{

  constructor(private twitter: TwitterService) { }

  handleAuthClick(){
    this.twitter.login().subscribe()

}
  handleSignoutClick(){
    console.log("signout")
  }
}
