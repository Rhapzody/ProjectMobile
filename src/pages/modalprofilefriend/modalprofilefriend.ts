import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ChatPage } from '../chat/chat';
import { TabsPage } from '../tabs/tabs';
import { User } from '../../models/users';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

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

  friend: User;
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private chatService: ChatServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalprofilefriendPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onClickOpenChat() {
    this.chatService.checkRoomChat(this.user.email, this.friend.email).then((room) => {
      if (room.data()) {
        this.navCtrl.push(ChatPage, { friend: this.friend, user: this.user })
      } else {
        this.chatService.createRoomChat(this.user.email, this.friend.email).then((doc) => {
          this.navCtrl.push(ChatPage, { friend: this.friend, user: this.user })
        })
      }
    })
  }

  ionViewWillLeave() {
    console.log('41');

  }

  ionViewWillEnter() {
    console.log(this.navParams.get('user'));

    this.friend = this.navParams.get('friend');
    this.user = this.navParams.get('user');
  }
}
