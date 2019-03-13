import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { ModalprofilefriendPage } from '../modalprofilefriend/modalprofilefriend';
import { AboutPage } from '../about/about';
import { AddfriendPage } from '../addfriend/addfriend';
import { User } from '../../models/users';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: User = new User()

  constructor(public navCtrl: NavController, private db: AngularFirestore, private modalCtrl: ModalController, private param: NavParams) {

  }

  ionViewWillEnter() {
    console.log(this.param.data);
    
    this.user = this.param.data;
    console.log(this.user);

  }

  presentModal() {
    const modal = this.modalCtrl.create(AddfriendPage, { user: this.user });
    modal.present();
    // this.navCtrl.push(AddfriendPage)
  }


}
