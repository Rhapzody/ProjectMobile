import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { User } from '@firebase/auth-types';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Room } from '../../models/rooms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  user: User;
  rooms: Array<Room>

  constructor(public navCtrl: NavController, private param: NavParams, private chatService: ChatServiceProvider, private userService: UserServiceProvider,
    private firebaseSto: FirebaseStorageProvider) {

  }

  ionViewWillEnter() {

  }

  async ionViewDidLoad() {
    console.log(this.param.data);
    this.user = this.param.data;
    // let data = await this.chatService.getRoomChat(this.user.email).onSnapshot()
    
    // console.log('123');
    


    this.chatService.getRoomChat(this.user.email).onSnapshot(data => {
      console.log('32 about');

      let roomtemp = [];
      data.forEach((room) => {
        this.userService.checkEmailUser(room.data().user2).then(user2 => {
          let dataTemp = user2.docs[0].data()
          if (dataTemp.photo != '') {
            this.firebaseSto.getURLImg(dataTemp.email, dataTemp.name).then(url => {
              dataTemp.photo = url;
              let msgTemp =[];
              this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {

                if (chat.docs.length > 0) {
                  console.log(msgTemp);

                  chat.docChanges.forEach(data => {
                    msgTemp.push(data.doc.data())
                    // console.log(data.doc.data());
                    
                  })
                }

              })
              roomtemp.push({ friend: dataTemp, messages: msgTemp });
              this.rooms = roomtemp;
              // loading.dismiss()
              console.log(this.rooms);

            })
          } else {
            dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
            let msgTemp = [];
            this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {

              if (chat.docs.length > 0) {
                // msgTemp = [];
                chat.docChanges.forEach(data => {
                  msgTemp.push(data.doc.data())
                })
              }

            })
            roomtemp.push({ friend: dataTemp, messages: msgTemp });
            this.rooms = roomtemp;
            // loading.dismiss()

          }
        })
      })
    })
  }

  onClickOpenChat(room) {
    console.log(room);
    this.navCtrl.push(ChatPage, { room: room, user: this.user })
  }

}
