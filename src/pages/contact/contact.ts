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
  logoProfile: string = null

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
      if (!this.logoProfile) {
        if (this.user.photo != '') {
          this.firebaseSto.getURLImg(this.user.email, this.user.photo).then(url => {
            this.logoProfile = url;
            loading.dismiss()
          })
        } else {
          this.logoProfile = "https://png.pngtree.com/svg/20170827/people_106508.png";
          loading.dismiss()
        }
      }
    })
  }
}
