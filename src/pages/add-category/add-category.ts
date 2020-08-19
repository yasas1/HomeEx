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

  public canAddField:boolean = true;

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

    let size = this.dataArray.length;

    if(size >=5){
      this.canAddField = false;
    }
    else{
      this.canAddField = true;
    }

  }

  removeField(index){
    
    this.dataArray.splice(index);

    let size = this.dataArray.length;

    if(size >=5){
      this.canAddField = false;
    }
    else{
      this.canAddField = true;
    }
  }

  onSubmit(){

    let size = this.dataArray.length;

    for(var i = 0; i < size; i++) { 

      this.database.checkCategoryByName(this.dataArray[i].name).then((result) => { 

        if(result == 0){
          this.database.insertCategory(this.dataArray[i].name);
        }
        else{
          this.alertViewer.presentAlert("Categories! ","Category \""+this.dataArray[i].name+"\""+ "is already heare!");
        }

      });

      
    }

    this.dataArray =[];
    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);

  }

  getCategories(){

    this.database.getAllCategories().then((result) => { 

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
