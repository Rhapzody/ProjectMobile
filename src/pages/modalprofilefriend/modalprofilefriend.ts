import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ChatPage } from '../chat/chat';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the ModalprofilefriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalprofilefriend',
  templateUrl: 'modalprofilefriend.html',
})
export class ModalprofilefriendPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalprofilefriendPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onClickOpenChat() {
    console.log('4546');

    // this.dismiss();
    // this.app.getActiveNavs()[0].push(ChatPage)
    this.navCtrl.setRoot(TabsPage, {
      selectedIndex: 1,
      page: 'chat'
    })

    this.navCtrl.push(ChatPage)

  }

  ionViewWillLeave() {
    console.log('41');

  }
}
