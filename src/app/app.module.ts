import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { SQLite } from '@ionic-native/sqlite';
import { DatePipe } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AddAccountPage } from '../pages/add-expenditure/add-expenditure';
import { DatabaseProvider } from '../providers/database/database';
import { NetworkProvider } from '../providers/network/network';
import { AlertViewerProvider } from '../providers/alert-viewer/alert-viewer';
import { AddCategoryPage } from '../pages/add-category/add-category';
import { AddMemberPage } from '../pages/add-member/add-member';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AddAccountPage,
    AddCategoryPage,
    AddMemberPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AddAccountPage,
    AddCategoryPage,
    AddMemberPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    NetworkProvider,
    AlertViewerProvider
  ]
})
export class AppModule {}
