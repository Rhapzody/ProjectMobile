import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { User } from '../../models/users';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  user: User = new User()

  constructor(public navCtrl: NavController, private param: NavParams, private firebaseSto: FirebaseStorageProvider, private loadingCtrl: LoadingController,
    private storage: Storage, private userService: UserServiceProvider, public app: App) {

  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    if (this.param.data.email) {
      this.loadData(this.param.data)
    } else {
      this.storage.get('authChat').then((value) => {
        if (value) {
          this.userService.checkEmailUser(value).then((docUser) => {
            if (!docUser.empty) {
              docUser.forEach(async data => {
                let usertemp = <User>data.data();
               
                this.loadData(usertemp)
              })
            }
          })
        }
      })
    }
  }

  loadData(usertemp) {
    console.log(usertemp);
    
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present().then(() => {
      this.user = usertemp;
      loading.dismiss();
    })
  }

  signout() {
    console.log('135');
    this.storage.remove('authChat');
    this.app.getRootNav().setRoot(LoginPage)
  }
}
