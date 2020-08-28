import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Category } from '../../models/Category';
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';

/*
 *
 * @author Yasas Ranawaka
 * 
 *  Categories work
*/

@IonicPage()
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage {

  public category = new Category();

  public dataArray:any=[];

  public categoryList: Array<{id: number, name: string}>;

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

    if(size >= 6){
      this.canAddField = false;
    }
    else{
      this.canAddField = true;
    }

  }

  removeField(index){

    this.dataArray.splice(index);

    let size = this.dataArray.length;

    if(size >=6){
      this.canAddField = false;
    }
    else{
      this.canAddField = true;
    }
  }

  onSubmit(){

    let size = this.dataArray.length;

    let atleastOneAdded = false;

    if(size > 0){

      for(var i = 0; i < size; i++) { 

        let categoryName = this.dataArray[i].name;
  
        if(categoryName != ""){

          this.database.checkCategoryByName(categoryName).then((result) => { 
  
            if(result != 1){
    
              try{         

                this.database.insertCategory(categoryName);

                atleastOneAdded = true;

              }catch(error){

                this.alertViewer.presentAlert("Insert Error! ",error);
              }
              
            }
            else{
              this.alertViewer.presentAlert("Category Here! ", ` Category "${categoryName}" is already here `);
            }

          }).catch(error => {
            this.alertViewer.presentAlert("Checking Error! ", error);
          });

        }
        
      }

      if(atleastOneAdded){
        this.alertViewer.presentAlert("Category Adding! ", "Successfully Added!");
      }
      else{
        this.alertViewer.presentAlert("Category! ","Name of a category should be entered ");
      }
  
      setTimeout(() =>
      {
        this.dataArray =[];
        this.category = new Category();
        this.category.name="";
        this.dataArray.push(this.category);
      }, size*500);

    }
    

  }

  getCategories(){

    this.database.getAllCategories().then((result) => { 

      let categories;

      if(result != 0){

        categories =  result;  

        let categoriesLength = categories.length;

        if(categoriesLength > 0){

          this.categoryList = [];

          for(let i=0; i < categoriesLength; i++) {

            this.alertViewer.presentAlert("Categories! ","category "+categories[i].name);

            this.categoryList.push({
              id: categories[i].id,
              name: categories[i].name
            });
       
          }

        }
      }  
    });

  }

  clear(){ 

    this.dataArray =[];
    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);

  }

  editCategory(id){
    this.alertViewer.presentAlert("Edit! ","Edit Button "+id);
  }

  deleteCategory(id){
    this.alertViewer.presentAlert("Delete! ","Delete Button "+id);
  }

  

}
