import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';

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
    private datePipe: DatePipe, 
    public formBuilder: FormBuilder
    ) {
    this.today = this.transformDateFormat2(new Date());

    this.someForm = formBuilder.group({
      'date': ['', Validators.compose([Validators.required])],
      'category': ['', Validators.compose([Validators.required])],
      'description': ['', Validators.compose([Validators.required])],
      'amount': ['', Validators.compose([Validators.required])],
    });

    this.categories.push({
      id:1,
      name:"Foof",
    });

    this.categories.push({
      id:2,
      name:"Medicine",
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAccountPage');
  }

  addAccount() {

    console.log(this.description);
    console.log(this.amount);
    console.log(this.date);
    console.log(this.category);

    /* let date = this.date;
    let category = this.category;
    let description = this.description;
    let amount = this.amount; */

    

  }

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
