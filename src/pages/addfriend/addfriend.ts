import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { User } from '../../models/users';

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

  email_friend: string = '';
  checkFriend: boolean;
  data_friend: any;
  frieng_img: any;

  data_friend_request: Array<any> = [];
  request: any;
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private userService: UserServiceProvider, private firebaseSto: FirebaseStorageProvider, private altCon: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddfriendPage');
    this.user = this.navParams.get('user')
    console.log(this.user);

    this.userService.userCurrent.subscribe(user => {
      this.user = user
      console.log(this.user);
    })

    this.data_friend_request = []
    this.request = []
    this.userService.getRequestFriend(this.user.email).get().then((docReq) => {
      console.log(docReq.size);

      docReq.forEach((req) => {
        console.log(req.data());
        this.request.push(req.data())
        this.userService.checkEmailUser(req.data().user_req).then(docUserReq => {
          let dataTemp = docUserReq.docs[0].data();
          if (dataTemp.photo != '') {
            this.firebaseSto.getURLImg(dataTemp.email, dataTemp.name).then(url => {
              dataTemp.photo = url;
              this.data_friend_request.push(dataTemp)

            })
          } else {
            dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
            this.data_friend_request.push(dataTemp)

          }
        })
      })
    })
  }

  ionViewWillEnter() {
    // this.user = this.navParams.get('user')
    // console.log(this.user);

  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  onClickSearch() {
    console.log('33');
    if (this.user.email == this.email_friend) {
      this.altCon.create({
        title: 'email ตัวเอง จะหาทำพรือ',
        buttons: [
          {
            text: 'OK'
          }
        ]
      }).present()
    } else {
      this.userService.checkEmailUser(this.email_friend).then(data => {
        console.log(this.user.friends.length);

        if (data.docs[0]) {
          let request = this.request.find(this.findRequest)
          if (request) {
            this.altCon.create({
              title: 'มีอยู่ในคำขอเเล้วน้า',
              buttons: [
                {
                  text: 'OK'
                }
              ]
            }).present()
          } else {
            this.data_friend = data.docs[0].data()
            if (this.data_friend.photo == '') {
              this.frieng_img = "https://png.pngtree.com/svg/20170827/people_106508.png";
              if (this.user.friends.length > 0) {
                let findEmail = this.user.friends.find(this.findEmail)

                if (findEmail) {
                  this.checkFriend = true;
                } else {
                  this.checkFriend = false;
                }
              } else {
                this.checkFriend = false;

              }
            } else {
              this.firebaseSto.getURLImg(this.data_friend.email, this.data_friend.photo).then(url => {
                console.log(url);
                this.frieng_img = url;
                if (this.user.friends.length > 0) {
                  let findEmail = this.user.friends.find(this.findEmail)
                  if (findEmail) {
                    this.checkFriend = true;
                  } else {
                    this.checkFriend = false;
                  }
                } else {
                  this.checkFriend = false;

                }
              })
            }
          }
        } else {
          this.altCon.create({
            title: 'ไม่มี email นี้',
            buttons: [
              {
                text: 'OK'
              }
            ]
          }).present()
        }
      })
    }
  }

  findRequest = (request) => {
    console.log(request);

    return ((request.user_req == this.email_friend) && (request.user_rec == this.user.email))
  }

  findEmail = (email) => {
    console.log(email);
    return email.email == this.email_friend;
  }

  onClickADD() {
    this.userService.addFriend(this.user.email, this.email_friend, 1, this.user).then(() => {
      console.log(65);
      this.altCon.create({
        title: 'add success.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.data_friend = null;
              this.checkFriend = null;
            }
          }
        ]
      }).present()
    }, err => {
      this.altCon.create({
        title: err,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.data_friend = null;
              this.checkFriend = null;
            }
          }
        ]
      }).present()
    })
  }

  onClickRequestFriend(data, i) {
    console.log(data);
    console.log(i);
    
    this.userService.addFriend(this.user.email, data.email, 0, this.user).then(() => {
      // this.altCon.create({
      //   title: 'add request success.',
      //   buttons: [
      //     {
      //       text: 'OK'
      //     }
      //   ]
      // }).present()
    }, err => {
      this.altCon.create({
        title: err,
        buttons: [
          {
            text: 'OK'
          }
        ]
      }).present()
    })

    this.data_friend_request.splice(i, 1);
  }
}
