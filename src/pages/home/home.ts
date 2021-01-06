import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Array<{day: string, date: any, spends: string}>;
  today: any;
  date:any;
  newDateToday = new Date();

  months = ['January','February','March','April','May','June','July','August','September','October','November','December']; 
  month:any;

  years = [];
  year:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private datePipe: DatePipe
    ){

    this.today = this.transformDateFormat2( this.newDateToday);
    this.date = this.transformDateFormat1(this.newDateToday);

    this.month = this.months[this.newDateToday.getMonth()];

    this.year = this.newDateToday.getFullYear();
    this.years.push(this.year);
    this.years.push(this.year-1);
    

    let numOfDays = this.daysInMonth(this.newDateToday);
    let displayDays = this.getDaysInMonth(this.newDateToday);

    this.items = [];
    for (let i = 0; i < numOfDays; i++) {
      this.items.push({
        day: i+1 + '  '+ displayDays[i].dayName ,
        date: displayDays[i].date ,
        spends: 'Total Spending ' + displayDays[i].date
      });
    }
    
  }

  itemTapped(event, item) {
    this.navCtrl.push(HomePage, {
      item: item
    });
  }

  private daysInMonth(anyDateInMonth:any) {
  return new Date(anyDateInMonth.getFullYear(),anyDateInMonth.getMonth()+1,0).getDate();
  }

  private getDaysInMonth(anyDateInMonth:any): any {

    let year = anyDateInMonth.getFullYear();
    let month = anyDateInMonth.getMonth()+1;

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
