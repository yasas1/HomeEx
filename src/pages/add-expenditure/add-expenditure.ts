import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';
import { Platform} from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-add-expenditure',
  templateUrl: 'add-expenditure.html',
})

export class AddAccountPage {

  public date:any;
  public category:any;
  public description:any;
  public amount:number;

  public isAddDisabled = true;

  public today: any;
  public maxDate: any = this.transformDateFormat1(new Date());

  public categories = [];

  someForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    private database: DatabaseProvider,
    public navParams: NavParams,
    private platform: Platform,
    private datePipe: DatePipe, 
    public formBuilder: FormBuilder,
    public alertViewer: AlertViewerProvider
    ) {
    this.today = this.transformDateFormat2(new Date());

    this.someForm = formBuilder.group({
      'date': ['', Validators.compose([Validators.required])],
      'category': ['', Validators.compose([Validators.required])],
      'description': ['', Validators.compose([Validators.required])],
      'amount': ['', Validators.compose([Validators.required])],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAccountPage');
    this.platform
      .ready()
      .then(() =>
      {
        setTimeout(() =>
        {
          this.setCategories(); 
        }, 1000);
      });
  }

  addExpenditure() {

    console.log(this.description);
    console.log(this.amount);
    console.log(this.date);
    console.log(this.category);

    let date = this.date;
    let category = this.category;
    let description = this.description;
    let amount = this.amount; 

    this.alertViewer.presentAlert("Expenditure ",date +" "+category+" "+description+" "+amount);

    this.database.insertExpenditure(date.to, category, description, amount);

  }

  getExpenditures(){
    this.database.getExpendituresByDate("2020-08-13").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) {

            this.alertViewer.presentAlert("Insert Error! ",expenditures[i].id+" "+expenditures[i].date+" "+expenditures[i].category+" "+expenditures[i].amount);
          }

        }
      }   

    });
  }

  /** Get categories from db and set category drop down ngModel */
  setCategories(){

    this.database.getCategories().then((result) => { 

      let categories;

      if(result != 0){

        categories =  result;  

        let categoriesLength = categories.length;

        if(categoriesLength > 0){

          for(let i=0; i < categoriesLength; i++) {

            this.categories.push({
              id:categories[i].id,
              name:categories[i].name,
            });
       
          }

        }
      }   

    });
  }

  insertCategories(){
    this.database.insertCategory("Food");
    this.database.insertCategory("Medicine");
    this.database.insertCategory("Clothes");
    this.database.insertCategory("Bills");
    this.database.insertCategory("Other");
  }

  transformDateFormat1(date):string {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); 
  }

  transformDateFormat2(date):string {
    return this.datePipe.transform(date, 'MMMM dd yyyy'); 
  }

}
