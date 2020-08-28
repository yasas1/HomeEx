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
  public member:any;
  public category:any;
  public description:any;
  public amount:number;

  public isAddDisabled = true;

  public today: any;
  public maxDate: any = this.transformDateFormat1(new Date());

  public categories = [];

  public members = [];

  public unnecessary =0;

  expenditureForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    private database: DatabaseProvider,
    public navParams: NavParams,
    private platform: Platform,
    private datePipe: DatePipe, 
    public formBuilder: FormBuilder,
    public alertViewer: AlertViewerProvider,
    
    ) {
    this.today = this.transformDateFormat2(new Date());
    this.date = this.transformDateFormat1(new Date());

    this.expenditureForm = formBuilder.group({
      'date': ['', Validators.compose([Validators.required])],
      'member': ['', Validators.compose([Validators.required])],
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
          this.checkAndsetMembers();
        }, 1000);
      });
  }

  addExpenditure() {

    let date = this.date;
    let member = this.member;
    let category = this.category;
    let description = this.description;
    let amount = this.amount; 
    let unnecessary = this.unnecessary;

    this.database.insertExpenditure(date,member, category, description, unnecessary, amount);

    this.expenditureForm.reset();

  }

  clearInputFields(){

    this.expenditureForm.reset();
  }

  getExpenditures(){

    
    this.alertViewer.presentAlert("Get Expenditures! ","checked "+this.date);
    this.alertViewer.presentAlert("Get Expenditures! ","checked "+this.member);
    

    this.database.getExpendituresByDate("2020-08-17").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            this.alertViewer.presentAlert("Get Expenditures! ",expenditures[i].id+" "+expenditures[i].date+" "+expenditures[i].member+" "+expenditures[i].category+" "+expenditures[i].amount);
          }

        }
      }  
      else{
        expenditures = 0;
      } 

    });
  }

  /** check categories count from db and set categories*/
  private checkAndsetCategories(){

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
  private setCategoriesInDropDown(){

    this.database.getAllCategories().then((result) => { 

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
  private insertCategories(){
    this.database.insertCategory("Food");
    this.database.insertCategory("Medicine");
    /* this.database.insertCategory("Fashion");
    this.database.insertCategory("Bills");
    this.database.insertCategory("Furnitures");
    this.database.insertCategory("Other"); */
  }

  /** check members count from db and set categories*/
  private checkAndsetMembers(){

    this.database.getMembersCount().then((result) => {

      if(result != 0){
        this.setMembersInDropDown();
      }
      else{
        this.insertMember();
        this.setMembersInDropDown();
      }

    });

  }

  /** Get members from db and SET category drop down ngModel */
  private setMembersInDropDown(){

    this.database.getMembers().then((result) => { 

      let members;

      if(result != 0){

        members =  result;  

        let membersLength = members.length;

        if(membersLength > 0){

          for(let i=0; i < membersLength; i++) {

            this.members.push({
              id:members[i].id,
              name:members[i].name,
            });
       
          }
        }
      }  
    });

  }

  /** insert default Member */
  private insertMember(){
    this.database.insertMember("Common");
    this.database.insertMember("Yasas");
  }

  private transformDateFormat1(date):string {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); 
  }

  private transformDateFormat2(date):string {
    return this.datePipe.transform(date, 'MMMM dd yyyy'); 
  }

}
