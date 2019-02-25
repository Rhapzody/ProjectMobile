import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { RegisterServiceProvider } from '../../providers/register-service/register-service';
import { AngularFireStorage } from 'angularfire2/storage';
import { FilePath } from '@ionic-native/file-path';

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


  constructor(public navCtrl: NavController, public navParams: NavParams, private fileChooser: FileChooser, private file: File, private fstorage: AngularFireStorage, private filePath: FilePath) {
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

        let path = resolvedFilePath.substring(0, resolvedFilePath.lastIndexOf('/'));
        let file = resolvedFilePath.substring(resolvedFilePath.lastIndexOf('/') + 1, resolvedFilePath.length);
        this.readCsvData(path, file)

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
      alert(JSON.stringify(content))

      this.fstorage.ref('profile/' + file).put(content).then(d => {
        alert(d)
      }).catch(err => {
        alert(JSON.stringify(err))
      })

    })
  }
}
