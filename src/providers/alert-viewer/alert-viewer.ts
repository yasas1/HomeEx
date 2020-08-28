import {AlertController} from 'ionic-angular';
import { Injectable } from '@angular/core';

/*
  Generated class for the AlertViewerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertViewerProvider {

  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertViewerProvider Provider');
  }

  public presentAlert(alertTitle:string, alertMessage:string) {

    let alert = this.alertCtrl.create({
      title: alertTitle,
      message: alertMessage,
      buttons: ['Dismiss']
    });
    alert.present();

    setTimeout(()=>alert.dismiss(),3000);
  }

}
