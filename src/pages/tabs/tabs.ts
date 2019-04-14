import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { User } from '../../models/users';
import { NavParams, LoadingController } from 'ionic-angular';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { async } from '@firebase/util';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  selectedIndex = 0;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  user: User = new User();

  constructor(private param: NavParams, private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController, private storage: Storage) {
    if (this.param.get('user')) {
      this.user = this.param.get('user')
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
