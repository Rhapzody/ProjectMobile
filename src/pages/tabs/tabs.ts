import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { User } from '../../models/users';
import { NavParams, LoadingController, NavController, App, Tabs } from 'ionic-angular';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { async } from '@firebase/util';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('sTabs') sTabs: Tabs;
  selectedIndex = 0;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  user: User = new User();

  check: boolean = true;
  checkReq: boolean = true;

  constructor(private param: NavParams, private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController, private chatService: ChatServiceProvider,
    private userService: UserServiceProvider, private storage: Storage, private localNotifications: LocalNotifications, public navCtrl: NavController, private backgroundMode: BackgroundMode,
    private app: App) {
    if (this.param.get('user')) {
      this.user = this.param.get('user')
      this.loadData()
    }
    else {
      this.loadData()
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
      let currentPage = this.app.getActiveNav().getViews();
      docRoom.docChanges.forEach((room, i) => {
        let r = room.doc.data();
        this.chatService.getChat(email, r.user2).get().then((chatDoc) => {
          if (chatDoc.size > 0) {

            if (!this.check) {
              if (chatDoc.docChanges[chatDoc.size - 1].type == 'added' || room.type == 'added') {
                if (currentPage[currentPage.length - 1].name != 'ChatPage') {
                  this.localNotifications.schedule({
                    title: r.user2,
                    text: chatDoc.docChanges[chatDoc.size - 1].doc.data().content,
                    foreground: true
                  });

                  let observable = this.localNotifications.on('click').subscribe((notification) => {
                    this.sTabs.select(1);
                    observable.unsubscribe();
                  })

                }
                else {
                  if (currentPage[currentPage.length - 1].data.room.friend.email != r.user2) {
                    this.localNotifications.schedule({
                      title: r.user2,
                      text: chatDoc.docChanges[chatDoc.size - 1].doc.data().content,
                      foreground: true
                    });

                    let observable = this.localNotifications.on('click').subscribe((notification) => {
                      this.selectedIndex = 1;
                      this.sTabs.select(1);
                      observable.unsubscribe();
                    })
                  }
                }

              }

            }

            if (i + 1 == docRoom.size) {
              this.check = false;
            }
          }

        })
      })
    })

    this.userService.getRequestFriend(email).onSnapshot((docReq) => {
      docReq.docChanges.forEach((req, i) => {
        if (!this.checkReq) {
          if (req.type == 'added') {
            this.localNotifications.schedule({
              title: req.doc.data().user_req,
              text: 'ส่งคำขอเป็นเพื่อนกับคุณ',
              foreground: true
            });

            let observable = this.localNotifications.on('click').subscribe((notification) => {
              this.selectedIndex = 1;
              this.sTabs.select(0);
              observable.unsubscribe();
            })
          }
        }
        if (i + 1 == docReq.size) this.checkReq = false;


      })
    })

  }
}
