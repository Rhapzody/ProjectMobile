import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { User } from '../../models/users';
import { NavParams, LoadingController } from 'ionic-angular';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  selectedIndex = 0;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  user: User = new User();

  check: boolean = true;

  constructor(private param: NavParams, private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController, private chatService: ChatServiceProvider,
    private userService: UserServiceProvider, private storage: Storage, private localNotifications: LocalNotifications) {
    if (this.param.get('user')) {
      this.user = this.param.get('user')
      this.loadData()
    }
    else {
      // this.storage.get('authChat').then((value) => {
      //   if (value) {
      //     this.userService.checkEmailUser(value).then((docUser) => {
      //       if (!docUser.empty) {
      //         docUser.forEach(async data => {
      //           this.user = <User>data.data()
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
      this.loadData()
      //         })
      //       }
      //     })
      //   }
      // })
    }


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

  loadData() {
    console.log(this.user);
    if (this.user.email) {
      this.checkData(this.user.email)
    } else {
      this.storage.get('authChat').then((value) => {
        if (value) {
          console.log(value);
          this.checkData(value)
        }
      })
    }

  }

  checkData(email) {
    this.chatService.getRoomChat(email).onSnapshot(docRoom => {
      docRoom.docChanges.forEach((room, i) => {
        if (room.type != 'modified' && room.type != 'removed') {
          console.log(room.doc.data());
          let r = room.doc.data();
          this.chatService.getChat(email, r.user2).get().then((chatDoc) => {
            if (!this.check) {
              // this.localNotifications.schedule({
              //   title: 'My first Noti',
              //   text: 'Single ILocalNotification',
              //   foreground: true
              // });
              console.log('Noti');
              alert('Noti')
              console.log(this.check);
              alert(this.check)
              
            }

            if(i + 1 == docRoom.size) {
              this.check = false;
            }

          })
        }
      })
    })
  }

}
