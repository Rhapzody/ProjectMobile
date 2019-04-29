import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, LoadingController, App } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AddfriendPage } from '../addfriend/addfriend';
import { User } from '../../models/users';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { ModalprofilefriendPage } from '../modalprofilefriend/modalprofilefriend';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: User;
  friends: Array<User>;

  constructor(public navCtrl: NavController, private db: AngularFirestore, private modalCtrl: ModalController, private param: NavParams, private userService: UserServiceProvider,
    private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController, private storage: Storage, public app: App) {
    console.log(this.param.data.email);

  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log('didload 28 home');

    if (this.param.data.email) {
      this.loadData(this.param.data);
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

  ionViewDidEnter() {

  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

  presentModal() {
    let modal = this.modalCtrl.create(AddfriendPage, { user: this.user });
    modal.onDidDismiss(() => {
      console.log('89 home');

    })
    modal.present();
    // this.navCtrl.push(AddfriendPage, { user: this.user })
  }

  onClickChancePage(friend) {
    console.log(friend);
    this.navCtrl.push(ModalprofilefriendPage, { friend, user: this.user })
  }

  Telephone(friend) {
    window.location.href = 'tel:' + friend.tel;
  }

  loadData(userTemp: User) {
    console.log(userTemp);

    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    })

    loading.present().then(() => {
      this.userService.changeUser(userTemp)
      this.userService.userCurrent.subscribe(user => {
        this.user = user
        let friendTemp = []
        if (this.user.friends.length > 0) {
          this.user.friends.forEach((friend, i) => {
            this.userService.checkEmailUser(friend.email).then(doc => {
              let dataTemp = doc.docs[0].data()
              if (dataTemp.photo != '') {
                this.firebaseSto.getURLImg(dataTemp.email, dataTemp.name).then(url => {
                  dataTemp.photo = url;
                  friendTemp.push(dataTemp);
                  if (i + 1 == this.user.friends.length) {
                    friendTemp.sort((a, b) => (a.email > b.email)? 1:(a.email < b.email)? -1:0)
                    this.friends = friendTemp;
                    console.log(this.friends);
                    
                    loading.dismiss()
                  }
                })
              } else {
                dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
                friendTemp.push(dataTemp);
                if (i + 1 == this.user.friends.length) {
                  friendTemp.sort((a, b) => (a.email > b.email)? 1:(a.email < b.email)? -1:0)
                  this.friends = friendTemp;
                  console.log(friendTemp);
                  loading.dismiss()
                }
              }
            })
          })
        } else {
          loading.dismiss()
        }
      })
    })
  }

  signout() {
    console.log('135');
    this.storage.remove('authChat');
    this.app.getRootNav().setRoot(LoginPage)
  }

}
