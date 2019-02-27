import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/users';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  user: User = new User()
  logoProfile: string = null

  constructor(public navCtrl: NavController, private param: NavParams, private firebaseSto: FirebaseStorageProvider) {
    console.log('16');

    // this.user = this.param.data;
    // this.firebaseSto.getURLImg(this.user.email, this.user.photo).then(url => {
    //   console.log(url);
    //   this.logoProfile = url;
    // })
  }

  ionViewWillEnter() {
    console.log('26');
    this.user = this.param.data;
    if (!this.logoProfile) {
      if (this.user.photo != '') {
        this.firebaseSto.getURLImg(this.user.email, this.user.photo).then(url => {
          console.log(url);
          this.logoProfile = url;
        })
      } else {
        this.logoProfile = "https://png.pngtree.com/svg/20170827/people_106508.png";
      }
    }

  }

  ionViewDidLoad() {
    console.log('31');

  }
}
