import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  msg: string = "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello";
  arr = [1,2,3];
  isTrue = true;
  chatName: string;

  constructor(public navCtrl:NavController, public navParams:NavParams) {

  }

  ionViewDidLoad() {

  }

  ionViewWillEnter(){
    this.chatName = this.navParams.get("chatName");
  }

  scrollToBottom() {

  }


  doSend() {

  }
}
