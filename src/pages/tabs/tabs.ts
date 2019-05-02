import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { User } from '../../models/users';
import { NavParams, LoadingController } from 'ionic-angular';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { async } from '@firebase/util';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';
import { Room } from '../../models/rooms';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  selectedIndex = 0;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  rooms: Array<any> = []

  readCount: Array<number> = [];

  user: User = new User();

  constructor(private param: NavParams, private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController, private chatService: ChatServiceProvider, private userService: UserServiceProvider, private storage: Storage) {
    if (this.param.get('user')) {
      this.user = this.param.get('user')
      // this.loadData()
    } 
    // else {
    //   this.storage.get('authChat').then((value) => {
    //     if (value) {
    //       this.userService.checkEmailUser(value).then((docUser) => {
    //         if (!docUser.empty) {
    //           docUser.forEach(async data => {
    //             let usertemp = <User>data.data();
    //             if (usertemp.photo != '') {
    //               let url = await this.firebaseSto.getURLImg(usertemp.email, usertemp.photo)
    //               usertemp.photo = url;
    //               // loading.dismiss()
    //             } else {
    //               usertemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
    //               // loading.dismiss()

    //             }
    //             this.user = usertemp
    //             this.loadData()
    //           })
    //         }
    //       })
    //     }
    //   })
    // }
  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {

  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {
    ;
  }

  ionTabsWillChange() {
    alert('31 tabs')
  }

  // loadData() {
  //   let loading = this.loadingCtrl.create({
  //     content: "Please wait..."
  //   })

  //   loading.present().then(() => {
  //     // this.user = usertemp;
  //     this.chatService.getRoomChat(this.user.email).onSnapshot(async data => {
  //       console.log('72 about');
  //       // console.log(data.docChanges);
  //       let roomtemp = [];
  //       await data.docs.forEach((room, i) => {
  //         this.readCount[i] = 0;
  //         this.userService.checkEmailUser(room.data().user2).then(user2 => {
  //           let dataTemp = user2.docs[0].data()
  //           if (dataTemp.photo != '') {
  //             this.firebaseSto.getURLImg(dataTemp.email, dataTemp.name).then(url => {
  //               dataTemp.photo = url;
  //               let msgTemp = [];
  //               let readTemp = 0;
  //               this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
  //                 console.log('83 about');
  //                 // console.log(chat.docChanges);

  //                 if (chat.docs.length > 0) {
  //                   chat.docChanges.forEach(data => {
  //                     // console.log(data);
  //                     if (data.newIndex != -1 && data.type != 'modified') {
  //                       msgTemp.push(data.doc.data())
  //                       if (data.doc.data().status == 0) readTemp += 1;
  //                     } else if (data.type == 'modified') {
  //                       readTemp = 0;

  //                       console.log(i);

  //                     }
  //                   })
  //                   this.readCount[i] = readTemp
  //                   // console.log(this.readCount);
  //                 }
  //               })
  //               // roomtemp.push({ friend: dataTemp, messages: msgTemp });
  //               // this.rooms = roomtemp;
  //               this.rooms[i] = { friend: dataTemp, messages: msgTemp }
  //               // console.log(this.rooms);
  //             })
  //           } else {
  //             dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
  //             let msgTemp = [];
  //             let readTemp = 0;
  //             this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
  //               console.log('98 about');

  //               if (chat.docs.length > 0) {
  //                 chat.docChanges.forEach((data) => {
  //                   // console.log(data);
  //                   if (data.newIndex != -1 && data.type != 'modified') {
  //                     msgTemp.push(data.doc.data())
  //                     if (data.doc.data().status == 0) this.readCount[i] += 1;
  //                   } else if (data.type == 'modified') {
  //                     this.readCount[i] = 0;

  //                     console.log(i);

  //                   }

  //                 })
  //                 // this.readCount[i] = readTemp
  //                 // console.log(this.readCount);
  //               }
  //             })

  //             // roomtemp.push({ friend: dataTemp, messages: msgTemp });
  //             this.rooms[i] = { friend: dataTemp, messages: msgTemp };
  //             // console.log(this.rooms);


  //           }
  //         })
  //       })
  //       loading.dismiss()
  //     })
  //   })
  // }

}
