import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, App, ActionSheetController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Room } from '../../models/rooms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { Storage } from '@ionic/storage';
import { User } from '../../models/users';
import { LoginPage } from '../login/login';
import { async } from '@firebase/util';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  user: User;
  rooms: Array<Room>
  roomsTemp: Array<Room>

  readCount: Array<number> = [];

  constructor(public navCtrl: NavController, private param: NavParams, private chatService: ChatServiceProvider, private userService: UserServiceProvider,
    private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController, private storage: Storage, public app: App, public actionSheetCtrl: ActionSheetController) {

  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log(this.param.data);
    // this.loadData(this.param.data)
    if (this.param.data.email) {
      this.loadData(this.param.data)
    } else {
      this.storage.get('authChat').then((value) => {
        if (value) {
          this.userService.checkEmailUser(value).then((docUser) => {
            if (!docUser.empty) {
              docUser.forEach(async data => {
                let usertemp = <User>data.data();

                this.loadData(usertemp)
              })
            }
          })
        }
      })
    }
  }

  onClickOpenChat(room) {
    console.log(room);

    this.navCtrl.push(ChatPage, { room: room, user: this.user })
  }

  async loadData(usertemp) {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    })

    await loading.present().then(async () => {
      console.log(usertemp);

      this.user = usertemp;
      await this.chatService.getRoomChat(this.user.email).onSnapshot(data => {

        let roomtemp = [];
        data.docs.forEach(async (room, i) => {
          await this.userService.checkEmailUser(room.data().user2).then(async user2 => {
            let dataTemp = user2.docs[0].data()
            // if (dataTemp.photo != '') {
            //   let url = await this.firebaseSto.getURLImg(dataTemp.email, dataTemp.name)
            //   dataTemp.photo = url;
            let msgTemp = [];
            let readTemp = 0;
            this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
              if (chat.docs.length > 0) {
                chat.docChanges.forEach(data => {
                  if (data.newIndex != -1 && data.type != 'modified') {
                    let dataTemp = data.doc.data()
                    let d = new Date(data.doc.data().date)
                    dataTemp.dateTxt = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
                    msgTemp.push(dataTemp)
                    if (data.doc.data().status == 0) readTemp += 1;
                  } else if (data.type == 'modified') {
                    readTemp = 0;
                  }
                })
                this.readCount[i] = readTemp
              }
            })
            roomtemp[i] = { friend: dataTemp, messages: msgTemp };
            // roomtemp.push({ friend: dataTemp, messages: msgTemp })
            this.rooms = roomtemp;
            this.roomsTemp = roomtemp;
            console.log(this.roomsTemp);

            // } else {
            //   dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
            // let msgTemp = [];
            // let readTemp = 0;
            // this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
            //   console.log('98 about');

            //   if (chat.docs.length > 0) {
            //     chat.docChanges.forEach((data) => {
            //       if (data.newIndex != -1 && data.type != 'modified') {
            //         let dataTemp = data.doc.data()
            //         let d = new Date(data.doc.data().date)
            //         dataTemp.dateTxt = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
            //         msgTemp.push(dataTemp)
            //         if (data.doc.data().status == 0) readTemp += 1;
            //       } else if (data.type == 'modified') {
            //         readTemp = 0;
            //       }

            //     })
            //     this.readCount[i] = readTemp
            //   }
            // })

            // roomtemp[i] = { friend: dataTemp, messages: msgTemp };
            // this.rooms = roomtemp;
            // this.roomsTemp = roomtemp;
            // }
          })
          // if (i + 1 == data.size) loading.dismiss()
        })
      })
      loading.dismiss()
    })
  }

  signout() {
    console.log('135');
    this.storage.remove('authChat');
    this.app.getRootNav().setRoot(LoginPage)
  }

  deleteRoomChat(i) {
    console.log(i);
    console.log(this.rooms[i]);
    console.log(this.rooms.length);
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'ลบ',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.chatService.deleteRoomChat(this.user.email, this.rooms[i].friend.email).then(() => {
              console.log('delete success.');
              console.log(this.rooms.length);
              if(this.rooms.length == 1){
                this.rooms.splice(i, 1)
              }
            })
          }
        }, {
          text: 'ยกเลิก',
          role: 'cancel'
        }
      ]
    }).present();
  }

  search(ev: any) {
    const val = ev.target.value;

    console.log(this.rooms);
    console.log(this.roomsTemp);


    this.rooms = this.roomsTemp

    if (val && val.trim() != '') {
      this.rooms = this.rooms.filter((item) => {
        return (item.friend.email.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.friend.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
