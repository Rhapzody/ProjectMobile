import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterServiceProvider } from '../../providers/register-service/register-service';
import { User } from '../../models/users';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TabsPage } from '../tabs/tabs';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  logoProfile: string = "https://png.pngtree.com/svg/20170827/people_106508.png";


  constructor(public navCtrl: NavController,
    public navParams: NavParams, private registerService: RegisterServiceProvider, private camera: Camera, private altController: AlertController, private loginService: LoginServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  createUser() {
    this.user.email = this._email.value
    this.user.name = this._name.value
    this.user.password = this._password.value
    if (this.user.email == '' || this.user.name == '' || this.user.password == '') {
      console.log('50');
      this.altController.create({
        title: 'คำเตือน',
        subTitle: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        buttons: ['OK']
      }).present()
    } else {
      console.log('53');

      this.registerService.checkEmailDuplicate(this.user.email).then(data => {
        console.log(data);

        if (data.exists) {
          this.altController.create({
            title: 'ERROR',
            subTitle: 'Email นี้มีในระบบแล้ว',
            buttons: ['OK']
          }).present();
        } else {
          console.log('63');

          if (!this.user.photo) {
            this.user.photo = "";
            this.registerService.createUser(this.user).then(() => {
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
            }).catch(() => {
              this.altController.create({
                title: 'error',
                subTitle: 'db firestore.',
                buttons: ['OK']
              }).present();
            })
          } else {
            this.registerService.uploadImg(this.user).then(() => {
              this.user.photo = this._name.value;
              this.registerService.createUser(this.user).then(() => {
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
              }).catch(() => {
                this.altController.create({
                  title: 'error',
                  subTitle: 'db firestore.',
                  buttons: ['OK']
                }).present();
              })
            }).catch(() => {
              this.altController.create({
                title: 'error',
                subTitle: 'upload file',
                buttons: ['OK']
              }).present();
            })
          }
        }

      })
    }
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
    this.loginService.checkEmailAndPassword(email, password).then(user => {

      if (!user.empty) {
        user.forEach(data => {
          this.navCtrl.push(TabsPage, { "user": data.data() });
        })
      } else {
        alert('email or password invalid.')
      }
    })

  }
}
