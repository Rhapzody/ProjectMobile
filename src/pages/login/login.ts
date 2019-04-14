import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { ChatPage } from '../chat/chat';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/users';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginService: LoginServiceProvider, private userService: UserServiceProvider, private firebaseSto: FirebaseStorageProvider, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {

    this.loginService.checkEmailAndPassword(this._email.value, this._password.value).get().then((user) => {

      if (!user.empty) {
        let usertemp: any;
        user.forEach(async data => {
          usertemp = data.data();
          if (usertemp.photo != '') {
            let url = await this.firebaseSto.getURLImg(usertemp.email, usertemp.photo)
            usertemp.photo = url;
            // loading.dismiss()
          } else {
            usertemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
            // loading.dismiss()

          }
          this.storage.set('authChat', usertemp.email)

          this.navCtrl.push(TabsPage, { "user": usertemp });

        })
      } else {
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
