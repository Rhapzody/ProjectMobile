import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ToastController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ChatPage } from '../chat/chat';
import { TabsPage } from '../tabs/tabs';
import { User } from '../../models/users';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Room } from '../../models/rooms';

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
  rooms: Room;
  get_chat: any;
  checkLoad: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private chatService: ChatServiceProvider, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalprofilefriendPage');
    console.log(this.navParams.get('user'));

    this.friend = this.navParams.get('friend');
    this.user = this.navParams.get('user');
    console.log(this.friend);
    console.log(this.user);
    this.getChat();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onClickOpenChat() {
    this.checkLoad = true;
    this.chatService.checkRoomChat(this.user.email, this.friend.email).then((room) => {
      console.log(this.rooms);

      if (room.data()) {
        this.navCtrl.push(ChatPage, { room: this.rooms, user: this.user })
      } else {
        this.chatService.createRoomChat(this.user.email, this.friend.email).then((doc) => {
          this.navCtrl.push(ChatPage, { room: this.rooms, user: this.user })
        })
      }
    })
  }

  ionViewWillLeave() {
    console.log('41');

  }

  ionViewWillEnter() {

  }

  getChat() {
    let msgTemp = [];
    this.getChat = this.chatService.getChat(this.user.email, this.friend.email).onSnapshot(chat => {
      if (chat.docs.length > 0) {
        chat.docChanges.forEach(data => {

          if (data.newIndex != -1 && data.type != 'modified') {
            msgTemp.push(data.doc.data())
          }

          // if (data.doc.data().sender == this.friend.email && this.checkLoad) {
          //   this.presentToast();
          // }
        })
        this.rooms = {
          friend: this.friend,
          messages: msgTemp
        }
      } else {
        this.rooms = {
          friend: this.friend,
          messages: []
        }
      }
    })
  }

  ionViewWillUnload() {
    console.log('93');

    this.getChat();
  }

  // presentToast() {
    const toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000
    });
    toast.present();
  }
}
