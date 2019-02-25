import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  msg: string = "hello";
  arr = [1,2,3];
  isTrue = true;

  constructor(public navCtrl:NavController, public navParams:NavParams) {

  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter(){
    
  }

  scrollToBottom() {
   
  }


  doSend() {
    
  }
}
