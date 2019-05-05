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
                if (usertemp.photo != '') {
                  let url = await this.firebaseSto.getURLImg(usertemp.email, usertemp.photo)
                  usertemp.photo = url;
                  // loading.dismiss()
                } else {
                  usertemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
                  // loading.dismiss()

                }
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

  loadData = (usertemp) => {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    })

    loading.present().then(() => {
      console.log(usertemp);

      this.user = usertemp;
      // this.rooms = usertemp.rooms;
      // this.readCount = usertemp.readCount;
      // console.log(this.user);
      // console.log(this.rooms);
      // console.log(this.readCount);



      // loading.dismiss();
      this.chatService.getRoomChat(this.user.email).onSnapshot(async data => {
        console.log('72 about');
        // console.log(data.docChanges);
        let roomtemp = [];
        await data.docs.forEach((room, i) => {

          this.userService.checkEmailUser(room.data().user2).then(user2 => {
            let dataTemp = user2.docs[0].data()
            if (dataTemp.photo != '') {
              this.firebaseSto.getURLImg(dataTemp.email, dataTemp.name).then(url => {
                dataTemp.photo = url;
                let msgTemp = [];
                let readTemp = 0;
                this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
                  console.log('83 about');
                  // console.log(chat.docChanges);

                  if (chat.docs.length > 0) {
                    chat.docChanges.forEach(data => {
                      // console.log(data);
                      if (data.newIndex != -1 && data.type != 'modified') {
                        let dataTemp = data.doc.data()
                        let d = new Date(data.doc.data().date)
                        // console.log(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
                        dataTemp.date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
                        msgTemp.push(dataTemp)
                        if (data.doc.data().status == 0) readTemp += 1;
                      } else if (data.type == 'modified') {
                        readTemp = 0;

                        console.log(i);

                      }
                    })
                    this.readCount[i] = readTemp
                    console.log(this.readCount);
                  }
                })
                roomtemp.push({ friend: dataTemp, messages: msgTemp });
                this.rooms = roomtemp;
                this.roomsTemp = roomtemp;
                console.log(this.roomsTemp);
              })
            } else {
              dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
              let msgTemp = [];
              let readTemp = 0;
              this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
                console.log('98 about');

                if (chat.docs.length > 0) {
                  chat.docChanges.forEach((data) => {
                    // console.log(data);
                    if (data.newIndex != -1 && data.type != 'modified') {
                      let dataTemp = data.doc.data()
                      let d = new Date(data.doc.data().date)
                      // console.log(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
                      dataTemp.date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
                      msgTemp.push(dataTemp)
                      if (data.doc.data().status == 0) readTemp += 1;
                    } else if (data.type == 'modified') {
                      readTemp = 0;
                      console.log(i);
                    }

                  })
                  this.readCount[i] = readTemp
                  console.log(this.readCount);
                }
              })

              roomtemp.push({ friend: dataTemp, messages: msgTemp });
              this.rooms = roomtemp;
              this.roomsTemp = roomtemp
              console.log(this.rooms);


            }
          })
        })
        loading.dismiss()
      })
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

    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'ลบ',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.chatService.deleteRoomChat(this.user.email, this.rooms[i].friend.email).then(() => {
              console.log('delete success.');
              // this.rooms.splice(i, 1)
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
