import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Spending } from '../../models/Spending';
import { DatePipe } from '@angular/common'; 
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

  public today: any;
  public spendingDate:any;

  private newDateToday = new Date();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private datePipe: DatePipe,
    ) {

    this.today = this.transformDateFormat2( this.newDateToday);
    this.selectedSpending = navParams.get('spending');
    this.spendingDate = this.transformDateFormat3( new Date(this.selectedSpending.date));
  }

  ionViewDidLoad() {
    
  }

  private transformDateFormat1(date):string {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); 
  }

  private transformDateFormat2(date):string {
    return this.datePipe.transform(date, 'MMMM dd yyyy'); 
  }

  private transformDateFormat3(date):string {
    return this.datePipe.transform(date, 'EEEE MMMM dd yyyy'); 
  }

}
