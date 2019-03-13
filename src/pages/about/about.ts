import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, private param: NavParams) {

  }

  ionViewWillEnter(){
    console.log(this.param.data);
    
  }

  onClickOpenChat() {
    this.navCtrl.push(ChatPage,
      {
        chatName: 'NAME'
      }
    )
  }

}
