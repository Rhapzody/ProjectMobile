import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { User } from '../../models/users';
import { NavParams, LoadingController, NavController } from 'ionic-angular';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

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
    private userService: UserServiceProvider, private storage: Storage, private localNotifications: LocalNotifications, public navCtrl: NavController, private backgroundMode: BackgroundMode) {
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
    this.backgroundMode.on('enable').subscribe(() => {
    this.chatService.getRoomChat(email).onSnapshot(docRoom => {
      console.log('105');
      console.log(this.navCtrl.getActive().name);

      docRoom.docChanges.forEach((room, i) => {
        console.log(i);
        console.log(room);

        // if (room.type != 'modified' && room.type != 'removed') {
        console.log(room.doc.data());
        let r = room.doc.data();
        this.chatService.getChat(email, r.user2).get().then((chatDoc) => {

          if (chatDoc.size > 0) {
            console.log(chatDoc.docChanges);

            console.log(chatDoc.docChanges[chatDoc.size - 1].type);
            if (!this.check) {
              // this.localNotifications.schedule({
              //   title: 'My first Noti',
              //   text: 'Single ILocalNotification',
              //   foreground: true
              // });

              if (chatDoc.docChanges[chatDoc.size - 1].type == 'added' || room.type == 'added') {
                if (chatDoc.docChanges[chatDoc.size - 1].doc.data().sender != email) {
                  this.localNotifications.schedule({
                    title: r.user2,
                    text: chatDoc.docChanges[chatDoc.size - 1].doc.data().content,
                    foreground: true
                  });
                }

              }

            }

            if (i + 1 == docRoom.size) {
              this.check = false;
            }
          }

        })
        // }
      })
    })
    })

    this.backgroundMode.enable();
  }

}
