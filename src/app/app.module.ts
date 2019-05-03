import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ChatPage } from '../pages/chat/chat';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { config } from './firestoreconfig';

import { UserServiceProvider } from '../providers/user-service/user-service';
import { HttpClientModule } from '@angular/common/http';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { RegisterServiceProvider } from '../providers/register-service/register-service';
import { RegisterPage } from '../pages/register/register';

import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import {  Base64 } from '@ionic-native/base64';
import { Camera } from '@ionic-native/camera'
import { FirebaseStorageProvider } from '../providers/firebase-storage/firebase-storage';
import { ModalprofilefriendPage } from '../pages/modalprofilefriend/modalprofilefriend';
import { AddfriendPage } from '../pages/addfriend/addfriend';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';

import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    ChatPage,
    ModalprofilefriendPage,
    AddfriendPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      mode:"ios"
    }),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    ChatPage,
    ModalprofilefriendPage,
    AddfriendPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserServiceProvider,
    LoginServiceProvider,
    RegisterServiceProvider,
    FileChooser,
    File,
    FilePath,
    ImagePicker,
    Base64,
    Camera,
    FirebaseStorageProvider,
    ChatServiceProvider,
    LocalNotifications,
    BackgroundMode
  ]
})
export class AppModule { }
