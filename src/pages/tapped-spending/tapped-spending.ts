import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Spending } from '../../models/Spending';

/**
 * Generated class for the TappedSpendingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tapped-spending',
  templateUrl: 'tapped-spending.html',
})
export class TappedSpendingPage {

  selectedSpending: Spending;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.selectedSpending = navParams.get('spending');
  }

  ionViewDidLoad() {
    
  }

}
