import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, List, ActionSheetController } from 'ionic-angular';
import { User } from '../../models/users';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Room } from '../../models/rooms';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;

  msg: string = "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello";
  arr = [1, 2, 3];
  isTrue = true;
  // chatName: string;
  room: Room;
  user: User;
  input: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private chatService: ChatServiceProvider, public actionSheetCtrl: ActionSheetController) {

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present().then(() => {
      this.room = this.navParams.get("room");
      this.user = this.navParams.get("user");
      loading.dismiss();
    })
  }

  ionViewDidEnter() {
    // this.content.scrollToBottom();
    this.chatService.getChat(this.user.email, this.room.friend.email).onSnapshot(() => {
      this.content.scrollToBottom();
    })
  }

  doSend() {
    let date = Date.now();
    let input = this.input;
    if (input != '') {
      this.chatService.createChat(this.user.email, this.room.friend.email, date, input).then(() => {
        this.chatService.checkRoomChat(this.room.friend.email, this.user.email).then(doc => {
          if (doc.exists) {
            this.chatService.createChatFriend(this.user.email, this.room.friend.email, date, input).then(() => {

            })
          } else {
            this.chatService.createRoomChat(this.room.friend.email, this.user.email).then(() => {
              this.chatService.createChatFriend(this.user.email, this.room.friend.email, date, input).then(() => {

              })
            })
          }
        })
        // this.content.scrollToBottom();
      })
      this.input = '';
    }
  }

  deleteMsg(i) {
    console.log(i);
    console.log(this.room.messages[i]);

    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'ลบ',
          handler: () => {
            console.log('Archive clicked');
            this.chatService.deleteMsg(this.user.email, this.room.friend.email, this.room.messages[i]).then(() => {
              console.log('delete success.');
              this.room.messages.splice(i, 1)
            })
          }
        }, {
          text: 'ยกเลิก',
          role: 'cancel'
        }
      ]
    }).present()

  }

}
