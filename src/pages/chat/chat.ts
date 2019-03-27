import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { User } from '../../models/users';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  msg: string = "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello";
  arr = [1, 2, 3];
  isTrue = true;
  // chatName: string;
  friend: User = new User();
  user: User = new User();

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    // this.chatName = this.navParams.get("chatName");
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present().then(() => {
      this.friend = this.navParams.get("friend");
      this.user = this.navParams.get("user");
      loading.dismiss();
    })
  }

  scrollToBottom() {

  }


  doSend() {
    
  }
}
