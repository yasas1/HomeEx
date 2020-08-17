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

  public unnecessary =0;

  expenditureForm: FormGroup;

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

    this.expenditureForm = formBuilder.group({
      'date': ['', Validators.compose([Validators.required])],
      'category': ['', Validators.compose([Validators.required])],
      'description': ['', Validators.compose([Validators.required])],
      'amount': ['', Validators.compose([Validators.required])],
      'unnecessary': ['', Validators.compose([Validators.required])],
    });

  }

  ionViewDidLoad() {
    
    this.platform
      .ready()
      .then(() =>
      {
        setTimeout(() =>
        {
          this.checkAndsetCategories();
        }, 1000);
      });
  }

  addExpenditure() {

    let date = this.date;
    let category = this.category;
    let description = this.description;
    let amount = this.amount; 
    let unnecessary = this.unnecessary;

    this.database.insertExpenditure(date, category, description, unnecessary, amount);

    this.expenditureForm.reset();

  }

  clearInputFields(){

    this.expenditureForm.reset();
  }

  getExpenditures(){

    
    this.alertViewer.presentAlert("Get Expenditures! ","checked "+this.unnecessary);
    

    this.database.getExpendituresByDate("2020-08-14").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) {

            this.alertViewer.presentAlert("Get Expenditures! ",expenditures[i].id+" "+expenditures[i].date+" "+expenditures[i].category+" "+expenditures[i].amount);
          }

        }
      }  
      else{
        expenditures = 0;
      } 

    });
  }

  /** check categories count from db and set categories*/
  checkAndsetCategories(){

    this.database.getCategoriesCount().then((result) => {

      if(result != 0){
        this.setCategoriesInDropDown();
      }
      else{
        this.insertCategories();
        this.setCategoriesInDropDown();
      }

    });

  }

  /** Get categories from db and SET category drop down ngModel */
  setCategoriesInDropDown(){

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

  /** insert default categories */
  insertCategories(){
    this.database.insertCategory("Food");
    this.database.insertCategory("Medicine");
    this.database.insertCategory("Fashion");
    this.database.insertCategory("Bills");
    this.database.insertCategory("Furnitures");
    this.database.insertCategory("Other");
  }

  transformDateFormat1(date):string {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); 
  }

  transformDateFormat2(date):string {
    return this.datePipe.transform(date, 'MMMM dd yyyy'); 
  }

}
