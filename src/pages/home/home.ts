import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AddfriendPage } from '../addfriend/addfriend';
import { User } from '../../models/users';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { ModalprofilefriendPage } from '../modalprofilefriend/modalprofilefriend';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: User;
  friends: Array<User>;

  constructor(public navCtrl: NavController, private db: AngularFirestore, private modalCtrl: ModalController, private param: NavParams, private userService: UserServiceProvider, 
    private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController) {

  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log('didload 28 home');
    
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    })

    loading.present().then(() => {
      this.user = this.param.data;
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
                  this.friends = friendTemp;
                  loading.dismiss()
                }
              })
            } else {
              dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
              friendTemp.push(dataTemp);
              if (i + 1 == this.user.friends.length) {
                this.friends = friendTemp;
                loading.dismiss()
              }
            }
          })
        })
      } else {
        loading.dismiss()
      }
    })
  }

  ionViewDidEnter() {

  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

  presentModal() {
    const modal = this.modalCtrl.create(AddfriendPage, { user: this.user });
    modal.present();
    // this.navCtrl.push(AddfriendPage)
  }

  onClickChancePage(friend){
    console.log(friend);
    this.navCtrl.push(ModalprofilefriendPage, {friend, user: this.user})
  }


}
