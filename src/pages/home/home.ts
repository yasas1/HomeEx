import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common'; 
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Array<{day: string, date: any, spends: string}>;
  today: any;
  date:any;
  private newDateToday = new Date();

  months = ['January','February','March','April','May','June','July','August','September','October','November','December']; 
  month:any;

  years = [];
  year:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private datePipe: DatePipe,
    private alertViewer: AlertViewerProvider,
    ){

    this.today = this.transformDateFormat2( this.newDateToday);
    this.date = this.transformDateFormat1(this.newDateToday);

    this.month = this.months[this.newDateToday.getMonth()];

    this.year = this.newDateToday.getFullYear();
    this.years.push(this.year);
    this.years.push(this.year-1);

    this.items = [];

    this.itemInitialize();
    
  }

  /** Initialize the spending day list with current month upto today */
  private itemInitialize(){

    let displayDays = this.getDaysInMonth(this.newDateToday.getFullYear(),this.newDateToday.getMonth()+1);

    for (let i = 0; i < this.newDateToday.getDate(); i++) {
      this.items.push({
        day: i+1 + '    '+ displayDays[i].dayName ,
        date: displayDays[i].date ,
        spends:  displayDays[i].date
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(HomePage, {
      item: item
    });
  }

  onChange($event){
    //$event.target.value
    this.alertViewer.presentAlert("1 Here! ", this.month);
    this.alertViewer.presentAlert("2 Here! ", this.year);
    
    let year = parseInt(this.year);
    let month = this.months.indexOf(this.month)

    let displayDays = this.getDaysInMonth(year, month+1);
    let daysInMonth = this.daysInMonth(year, month+1);

    this.alertViewer.presentAlert("3 Here! ", displayDays[1].dayName);
    this.alertViewer.presentAlert("4 Here! ", daysInMonth.toString());

    setTimeout(() =>
    {
      this.items = [];
      for (let i = 0; i < daysInMonth; i++) {
        this.items.push({
          day: i+1 + '    '+ displayDays[i].dayName ,
          date: displayDays[i].date ,
          spends:  displayDays[i].date
        });
      }
    }, 500);

    
    
  }

  private daysInMonth(year:any,month:any) {
    return new Date(year,month,0).getDate();
  }

  /** get the date with day name for the month */
  private getDaysInMonth(year:any,month:any): any {

    let numOfDays = new Date(year,month,0).getDate(); 
    let days = [];
    let DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; 
    let dateString :string;
    let date :string;
    let dayName:string;

    for(let i=1; i<=numOfDays; i++)
    {
      dateString = year.toString()+'-'+month.toString()+'-'+i;
      dayName = DAYS[new Date(dateString).getDay()];  
      date =  this.transformDateFormat1(new Date(dateString));
      days.push({dayName:dayName,date:date})          
    }

    return days;
  }

  private transformDateFormat1(date):string {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); 
  }

  private transformDateFormat2(date):string {
    return this.datePipe.transform(date, 'MMMM dd yyyy'); 
  }

}
