import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { User } from '../../models/users';
import { NavParams } from 'ionic-angular';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  selectedIndex = 0;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  user: User = new User();

  constructor(private param: NavParams, private firebaseSto: FirebaseStorageProvider) {
    if (this.param.get('user')) {
      this.user = this.param.get('user')
      console.log(this.user)
      // alert(JSON.stringify(this.user))
      if (this.user.photo != '') {
        this.firebaseSto.getURLImg(this.user.email, this.user.photo).then(url => {
          this.user.photo = url;
          // loading.dismiss()
        })
      } else {
        this.user.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
        // loading.dismiss()
      }
    }
  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {

  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {
    ;
  }

  ionTabsWillChange() {
    alert('31 tabs')
  }
}
