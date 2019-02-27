import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { ChatPage } from '../chat/chat';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email_and_password: boolean = true;

  @ViewChild('email') _email
  @ViewChild('password') _password

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginService: LoginServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    // this.navCtrl.push(TabsPage)
    // console.log(this._email.value);

    this.loginService.checkEmailAndPassword(this._email.value, this._password.value).then(user => {

      if (!user.empty) {
        user.forEach(data => {
          this.navCtrl.push(TabsPage, { "user": data.data() });
        })
      } else {
        // alert('email or password invalid.')
        this.email_and_password = false;
      }
    })

  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  openChat() {
    this.navCtrl.push(ChatPage, {
      chatName: "Mr. X"
    });
  }
}
