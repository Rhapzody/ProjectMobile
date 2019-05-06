import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RegisterServiceProvider } from '../../providers/register-service/register-service';
import { User } from '../../models/users';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TabsPage } from '../tabs/tabs';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user: User = new User();
  imageData: any

  @ViewChild('email') _email;
  @ViewChild('name') _name;
  @ViewChild('password') _password;
  @ViewChild('tel') _tel;

  valid_email: boolean = true;
  // valid_tel: boolean = true;

  logoProfile: string = "assets/imgs/user.png";


  constructor(public navCtrl: NavController,
    public navParams: NavParams, private registerService: RegisterServiceProvider, private camera: Camera, 
    private altController: AlertController, private loginService: LoginServiceProvider, public loadingCtrl: LoadingController,
    private firebaseSto: FirebaseStorageProvider, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  createUser() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present().then(() => {
      this.user.email = this._email.value
      this.user.name = this._name.value
      this.user.password = this._password.value
      this.user.tel = this._tel.value
      if (this.user.email == '' || this.user.name == '' || this.user.password == '' || this.user.tel == '' || this.user.email.trim() == '' || this.user.name.trim() == '' || this.user.password.trim() == '' || this.user.tel.trim() == '') {
        loading.dismiss().then(() => {
          this.altController.create({
            title: 'คำเตือน',
            subTitle: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
            buttons: ['OK']
          }).present()
        })
      } else {
        console.log(this.valid_email);

        if (this.valid_email) {
          if (this._tel.value.length > 9) {
            this.registerService.checkEmailDuplicate(this.user.email).then(data => {
              if (data.exists) {
                loading.dismiss().then(() => {
                  this.altController.create({
                    title: 'ERROR',
                    subTitle: 'Email นี้มีในระบบแล้ว',
                    buttons: ['OK']
                  }).present();
                })
              } else {
                if (!this.user.photo) {
                  this.user.photo = "";
                  this.registerService.createUser(this.user, 'https://png.pngtree.com/svg/20170827/people_106508.png').then(() => {
                    loading.dismiss().then(() => {
                      this.altController.create({
                        title: 'succes',
                        subTitle: 'สมัครสมาชิกเรียบร้อย',
                        buttons: [{
                          text: 'OK',
                          handler: () => {
                            this.getUserByEmailAndPass(this.user.email, this.user.password)
                          }
                        }]
                      }).present();
                    })
                  }).catch(() => {
                    loading.dismiss().then(() => {
                      this.altController.create({
                        title: 'error',
                        subTitle: 'db firestore.',
                        buttons: ['OK']
                      }).present();
                    })
                  })
                } else {
                  this.registerService.uploadImg(this.user).then((ref) => {
                    console.log(ref.downloadURL);

                    this.user.photo = this._name.value;
                    this.registerService.createUser(this.user, ref.downloadURL).then(() => {
                      loading.dismiss().then(() => {
                        this.altController.create({
                          title: 'succes',
                          subTitle: 'สมัครสมาชิกเรียบร้อย',
                          buttons: [{
                            text: 'OK',
                            handler: () => {
                              this.getUserByEmailAndPass(this.user.email, this.user.password)
                            }
                          }]
                        }).present();
                      })
                    }).catch(() => {
                      loading.dismiss().then(() => {
                        this.altController.create({
                          title: 'error',
                          subTitle: 'db firestore.',
                          buttons: ['OK']
                        }).present();
                      })
                    })
                  }).catch(() => {
                    loading.dismiss().then(() => {
                      this.altController.create({
                        title: 'error',
                        subTitle: 'upload file',
                        buttons: ['OK']
                      }).present();
                    })
                  })
                }
              }
            })
          } else {
            loading.dismiss().then(() => {
              this.altController.create({
                title: 'คำเตือน',
                subTitle: 'กรุณาใส่ เบอร์โทร ให้ครบ 10 ตัว',
                buttons: ['OK']
              }).present();
            })
          }
        } else {
          loading.dismiss().then(() => {
            this.altController.create({
              title: 'คำเตือน',
              subTitle: 'กรุณาใส่ email ให้ถูกต้อง',
              buttons: ['OK']
            }).present();
          })
        }
      }
    })

  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }

    this.camera.getPicture(options).then((imgData) => {
      this.logoProfile = 'data:image/jpeg;base64,' + imgData;
      this.user.photo = 'data:image/jpeg;base64,' + imgData;
    }, (err) => {
      alert(err)
    });
  }

  getUserByEmailAndPass(email, password) {
    this.loginService.checkEmailAndPassword(email, password).get().then(user => {

      if (!user.empty) {
        let usertemp: any;
        user.forEach(async data => {
          usertemp = data.data();
          if (usertemp.photo != '') {
            let url = await this.firebaseSto.getURLImg(usertemp.email, usertemp.photo)
            usertemp.photo = url;
            // loading.dismiss()
          } else {
            usertemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
            // loading.dismiss()

          }
          this.storage.set('authChat', usertemp.email)

          this.navCtrl.push(TabsPage, { "user": usertemp });

        })
      } else {
        alert('email or password invalid.')
      }
    })

  }

  validateEmail() {
    console.log('191');

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.valid_email = re.test(this._email.value);
  }

  validTel(e) {
    console.log(e);

    // let regExp = /[0-9]/;
    // if(e.target.value.length != 0)
    // if(!regExp.test(e.target.value)){
    //   e.preventDefault();
    // }
    if ((e.keyCode < 48 || e.keyCode > 57)) {
      e.preventDefault();
    }

  }

  validName(e) {

    if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122) || (e.keyCode >= 3585 && e.keyCode <= 3680)) {

    } else {
      e.preventDefault();
    }
  }

}
