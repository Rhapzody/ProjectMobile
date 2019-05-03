import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, ActionSheetController } from 'ionic-angular';
import { User } from '../../models/users';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Room } from '../../models/rooms';
import { BackgroundMode } from '@ionic-native/background-mode';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  msg: string = "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello";
  arr = [1, 2, 3];
  isTrue = true;
  // chatName: string;
  room: Room;
  user: User;
  input: string = '';

  test;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private chatService: ChatServiceProvider, public actionSheetCtrl: ActionSheetController, private backgroundMode: BackgroundMode) {

  }

  ionViewWillEnter() {

    // this.backgroundMode.disable()

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present().then(() => {
      this.room = this.navParams.get("room");
      this.user = this.navParams.get("user");
      this.scrollToBottom();
      loading.dismiss();
    })
  }

  scrollToBottom(): void {
    this.test = this.chatService.getChat(this.user.email, this.room.friend.email).onSnapshot((doc) => {
      this.content.scrollToBottom()
      doc.docChanges.forEach(data => {
        if (data.newIndex != -1 || data.type != 'modified') {
          if (data.doc.data().status == 0) {
            this.chatService.updateStatusChat(this.user.email, this.room.friend.email, data.doc.id).then(() => {

            })
          }
        }
      })
    })

  }

  ionViewDidLeave() {
    console.log('61');
    this.test();
    this.backgroundMode.enable();
  }

  doSend() {
    let date = Date.now();
    let input = this.input;
    if (input != '') {
      this.chatService.createChat(this.user.email, this.room.friend.email, date, input).then(() => {
        this.chatService.checkRoomChat(this.room.friend.email, this.user.email).then(doc => {
          if (doc.exists) {
            this.chatService.createChatFriend(this.user.email, this.room.friend.email, date, input).then(() => {
              this.chatService.updateRoomChat(this.room.friend.email, this.user.email, date).then(() => {

              })
            })
          } else {
            this.chatService.createRoomChat(this.room.friend.email, this.user.email).then(() => {
              this.chatService.createChatFriend(this.user.email, this.room.friend.email, date, input).then(() => {
                this.chatService.updateRoomChat(this.room.friend.email, this.user.email, date).then(() => {

                })
              })
            })
          }
        })
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
          role: 'destructive',
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
