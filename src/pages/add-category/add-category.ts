import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Category } from '../../models/Category';
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage {

  public category = new Category();

  public dataArray:any=[];

  categoryForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: DatabaseProvider,
    public formBuilder: FormBuilder,
    public alertViewer: AlertViewerProvider
    ){

    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);

    this.categoryForm = formBuilder.group({
      'category': ['', Validators.compose([Validators.required])]
    });

  }

  ionViewDidLoad() {
    
  }

  addField(){

    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);

  }

  removeField(index){
    this.dataArray.splice(index);
  }

  onSubmit(){

    let size = this.dataArray.length;
    for(var i = 0; i < size; i++) { 
      this.database.insertCategory(this.dataArray[i].name);
    }

    this.dataArray =[];
    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);

  }

  getCategories(){

    this.database.getCategories().then((result) => { 

      let categories;

      if(result != 0){

        categories =  result;  

        let categoriesLength = categories.length;

        if(categoriesLength > 0){

          for(let i=0; i < categoriesLength; i++) {

            this.alertViewer.presentAlert("Categories! ","category "+categories[i].name);
       
          }
        }
      }  
    });

  }

  clear(){

    this.categoryForm.reset();
  }

  

}
