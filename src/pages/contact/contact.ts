import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { User } from '../../models/users';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  user: User = new User()

  constructor(public navCtrl: NavController, private param: NavParams, private firebaseSto: FirebaseStorageProvider, private loadingCtrl: LoadingController) {

  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present().then(() => {
      this.user = this.param.data;
      loading.dismiss();
    })
  }
}
