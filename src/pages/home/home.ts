import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DatePipe } from '@angular/common'; 
//import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';
import { DatabaseProvider } from '../../providers/database/database';
import { TappedSpendingPage } from '../tapped-spending/tapped-spending';
import { Spending } from '../../models/Spending';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public spendings: Array<Spending>;
  public today: any;
  public date:any;

  private newDateToday = new Date();

  public months = ['January','February','March','April','May','June','July','August','September','October','November','December']; 
  public month:any;

  public years = [];
  public year:any;

  private expenditures: Array<{date: string, total: any}>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private datePipe: DatePipe,
    private database: DatabaseProvider,
    private platform: Platform,
    //private alertViewer: AlertViewerProvider
    ){

    this.today = this.transformDateFormat2( this.newDateToday);
    this.date = this.transformDateFormat1(this.newDateToday);

    this.month = this.months[this.newDateToday.getMonth()];

    this.year = this.newDateToday.getFullYear();
    this.years.push(this.year);
    this.years.push(this.year-1);
    
  }

  ionViewDidLoad() {
    
    this.platform
      .ready()
      .then(() =>
      {
        setTimeout(() =>
        {
          this.spendings = [];
          this.spendingsInitializer();
        }, 400);
      });
  }

  /** Initialize the spending day list with current month upto today */
  private spendingsInitializer(){

    let year = this.newDateToday.getFullYear();
    let month = this.newDateToday.getMonth()+1;

    let displayDays = this.getDaysInMonth(year,month);

    //set dates to get total spendings foreach day
    let dateStart =  this.transformDateFormat1(new Date(year.toString()+'-'+month.toString()+'-'+1));
    let dateEnd =  this.transformDateFormat1(new Date(year.toString()+'-'+month.toString()+'-'+this.newDateToday.getDate()));
    
    //update global expenditure array 
    this.getExpenditures(dateStart,dateEnd);

    setTimeout(() =>
    {
      
      let expendituresLength = this.expenditures.length;
      

      for (let i = 0; i < this.newDateToday.getDate(); i++) {
        let spends = 0;

        //set total spendings from dates
        for (let j = 0; j < expendituresLength; j++) {
          if( this.compareDate(this.expenditures[j].date , displayDays[i].date)==0){
            spends = this.expenditures[j].total;
            break;
          }
        }

        //push into spending array
        let spending = new Spending();
        spending.day = i+1 + ' '+ displayDays[i].dayName;
        spending.date = displayDays[i].date;
        spending.spends = spends.toString();
        this.spendings.push(spending);
        
      }

    }, 700); 

  }

  /** display day list for the selected month and year */
  onMonthYearChange($event){
    
    let year = parseInt(this.year);
    let month = this.months.indexOf(this.month)+1;

    let displayDays = this.getDaysInMonth(year, month);
    let daysInMonth = this.daysInMonth(year, month);

    //set dates to get total spendings foreach day
    let dateStart =  this.transformDateFormat1(new Date(year.toString()+'-'+month.toString()+'-'+1));
    let dateEnd =  this.transformDateFormat1(new Date(year.toString()+'-'+month.toString()+'-'+daysInMonth));
   
    //update global expenditure array 
    this.getExpenditures(dateStart,dateEnd);

    setTimeout(() =>
    {
      let expendituresLength = this.expenditures.length;
      this.spendings = [];
      
      for (let i = 0; i < daysInMonth; i++) {
        let spends = 0;

        //set total spendings from dates
        for (let j = 0; j < expendituresLength; j++) {
          if( this.compareDate(this.expenditures[j].date , displayDays[i].date)==0){
            spends = this.expenditures[j].total;
            break;
          }
        }

        //push into spending array
        let spending = new Spending();
        spending.day = i+1 + ' '+ displayDays[i].dayName;
        spending.date = displayDays[i].date;
        spending.spends = spends.toString();
        this.spendings.push(spending);
        
      }

    }, 700); 

  }

  /** navigate to new page when a day is tapped */
  spendingTapped(event, spending) {
    this.navCtrl.push(TappedSpendingPage, {
      spending: spending
    });
  }

  /** takes expenditures group by dates and updated in global expenditures */
  public getExpenditures(datestart:string, dateEnd:string){

    this.expenditures = [];

    this.database.getExpendituresForMonth(datestart,dateEnd).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            this.expenditures.push({
              date: expenditures[i].date ,
              total:  expenditures[i].total
            });
          }

        }
      }  
      else{
        expenditures = 0;
      } 
    });
  }

   /** get the count of days for a month */
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

  private compareDate(date1: string, date2: string): number{

    let d1 = new Date(date1); let d2 = new Date(date2);

    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;
  
    // Check if the first is less than second
    if (d1 < d2) return -1;
  }

}
