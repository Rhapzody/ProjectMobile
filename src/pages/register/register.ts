import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { RegisterServiceProvider } from '../../providers/register-service/register-service';
import { AngularFireStorage } from 'angularfire2/storage';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { User } from '../../models/users';

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

  @ViewChild('email') _email;
  @ViewChild('name') _name;
  @ViewChild('password') _password;

  logoProfile:string = "https://png.pngtree.com/svg/20170827/people_106508.png";


  constructor(public navCtrl: NavController, public navParams: NavParams, private fileChooser: FileChooser, private file: File, private fstorage: AngularFireStorage, private filePath: FilePath, private imagePicker: ImagePicker, private registerService: RegisterServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  chooseFile() {
    this.fileChooser.open().then(uri => {
      alert(uri)

      // this.file.resolveLocalFilesystemUrl(uri).then((newUrl) => {
      //   alert(JSON.stringify(newUrl.name));

      //   let dirPath = newUrl.toInternalURL();
      //   let dirPathSegments = dirPath.split('/');
      //   dirPathSegments.pop();
      //   dirPath = dirPathSegments.join('/');

      //   alert(dirPath)
      //   this.file.readAsArrayBuffer(dirPath, newUrl.name).then((buffer) => {
      //     alert('666');
      //     this.upload(buffer, newUrl.name);
      //   }).catch((err) => {
      //     alert(JSON.stringify(err))
      //   })
      // })

      this.filePath.resolveNativePath(uri).then(resolvedFilePath => {
        alert(resolvedFilePath);
        let path = resolvedFilePath.substring(0, resolvedFilePath.lastIndexOf('/'));
        let file = resolvedFilePath.substring(resolvedFilePath.lastIndexOf('/') + 1, resolvedFilePath.length);
        this.readCsvData(path, file)
        this.logoProfile = resolvedFilePath
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    })
  }

  upload(buffer, name) {

    alert('555')
    let blob = new Blob([buffer], { type: "image/jpg" })

    this.fstorage.ref('profile/' + name).put(blob).then(d => {
      alert(d)
    }).catch(err => {
      alert(JSON.stringify(err))
    })
  }

  private readCsvData(path, file) {

    alert(file)
    alert(path)
   
    // this.file.readAsBinaryString(path, file)
    //   .then(content => {
    //     console.log("File-Content: " + JSON.stringify(content));
    //     // alert(content)
    //     this.fstorage.ref('profile/' + file).putString(content).then(d=>{
    //       alert(d)
    //     }).catch(err=>{
    //       alert(JSON.stringify(err))
    //     })
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     alert(JSON.stringify(err));
    //   });

    this.file.readAsArrayBuffer(path, file).then(content => {
      const read = new FileReader()
      read.onload = e => {
        this.logoProfile = read.result as string;
      }
      read.readAsDataURL(file)
      alert(read.result)
      alert(JSON.stringify(content))

      // this.fstorage.ref('profile/' + file).put(content).then(d => {
      //   alert(d)
      // }).catch(err => {
      //   alert(JSON.stringify(err))
      // })

    })
  }

  getPhoto(e) {
    alert(e.target.files[0])
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      alert(results)
      for (var i = 0; i < results.length; i++) {
          this.logoProfile = results[i];
          alert(results[i])
          // this.base64.encodeFile(results[i]).then((base64File: string) => {
          //   this.regData.avatar = base64File;
          // }, (err) => {
          //   console.log(err);
          // });
      }
    }, (err) => { });
  }

  file2(e){
    alert(e.target.files[0])
  }

  createUser(){
    this.user.email = this._email.value
    this.user.name = this._name.value
    this.user.password = this._password.value
    if(!this.user.photo){
      this.user.photo = "";
    }
    this.registerService.createUser(this.user)
  }
}
