import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterServiceProvider } from '../../providers/register-service/register-service';
import { AngularFireStorage } from 'angularfire2/storage';
import { User } from '../../models/users';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
    public navParams: NavParams, private fstorage: AngularFireStorage, private registerService: RegisterServiceProvider, private camera: Camera, private altController: AlertController) {
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
      this.registerService.checkEmailDuplicate(this.user.email).subscribe(data => {
        if (data) {
          this.altController.create({
            title: 'ERROR',
            subTitle: 'Email นี้มีในระบบแล้ว',
            buttons: ['OK']
          }).present();
        } else {
          if (!this.user.photo) {
            this.user.photo = "";
            this.registerService.createUser(this.user).then(() => {
              this.altController.create({
                title: 'succes',
                subTitle: 'สมัครสมาชิกเรียบร้อย',
                buttons: ['OK']
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
                  buttons: ['OK']
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
      // sourceType:sourceType,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }

    this.camera.getPicture(options).then((imgData) => {
      this.logoProfile = 'data:image/jpeg;base64,' + imgData;
      this.user.photo = 'data:image/jpeg;base64,' + imgData;
      // this.fstorage.ref('profile/thanabodee@gmail.com/thanabodee').putString(this.logoProfile, firebase.storage.StringFormat.DATA_URL).then(d => {
      //   alert(JSON.stringify(d))
      // }).catch(err => {
      //   alert(JSON.stringify(err))
      // })
    }, (err) => {
      alert(err)
    });
  }
}
