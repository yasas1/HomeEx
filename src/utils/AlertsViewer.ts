import {AlertController} from 'ionic-angular';

export class AlertViewer{

    constructor(private alertCtrl: AlertController) {
    }

    presentAlert(alertTitle:string, alertMessage:string) {

        let alert = this.alertCtrl.create({
          title: alertTitle,
          message: alertMessage,
          buttons: ['Dismiss']
        });
        alert.present();
    }

}