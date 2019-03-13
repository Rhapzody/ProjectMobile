import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { User } from '../../models/users';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  selectedIndex = 0;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  user: User = new User();

  constructor(private param: NavParams) {

  }

  ionViewWillEnter() {
    // console.log(this.param.get("page"));
    // if (this.param.get("page")) {
    //   this.selectedIndex = this.param.get("selectedIndex");
    //   console.log(this.selectedIndex);
      
    // }
    if (this.param.get('user')) {
      this.user = this.param.get('user')
      console.log(this.user)
      // alert(JSON.stringify(this.user))
    }

  }

  ionTabsWillChange() {
    alert('31 tabs')
  }
}
