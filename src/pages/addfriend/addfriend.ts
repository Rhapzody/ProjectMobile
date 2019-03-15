import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { User } from 'firebase';

/**
 * Generated class for the AddfriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addfriend',
  templateUrl: 'addfriend.html',
})
export class AddfriendPage {

  email_friend;

  data_friend;
  frieng_img;

  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private userService: UserServiceProvider, private firebaseSto: FirebaseStorageProvider, private altCon: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddfriendPage');
  }

  ionViewWillEnter() {
    this.user = this.navParams.get('user')
    console.log(this.user);

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onClickSearch() {
    console.log('33');

    this.userService.checkEmailUser(this.email_friend).then(data => {
      console.log(data.docs[0].data());
      this.data_friend = data.docs[0].data()

      if (this.data_friend.photo == '') {
        this.frieng_img = "https://png.pngtree.com/svg/20170827/people_106508.png";
      } else {
        this.firebaseSto.getURLImg(this.data_friend.email, this.data_friend.photo).then(url => {
          console.log(url);
          this.frieng_img = url;
        })
      }
    })
  }

  onClickADD() {
    this.userService.addFriend(this.user.email, this.email_friend).then(() => {
      console.log(65);
      this.altCon.create({
        title: 'add success.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.data_friend = null
            }
          }
        ]
      }).present()
    })
  }
}
