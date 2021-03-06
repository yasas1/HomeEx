import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController ,AlertController, Platform} from 'ionic-angular';
import { Category } from '../../models/Category';
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';
import { DatePipe } from '@angular/common'; 
/*
 *
 * @author Yasas Ranawaka
 * 
 *  Category Management
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

  public today: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public database: DatabaseProvider,
    public formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public alertViewer: AlertViewerProvider,
    public updateModal : ModalController,
    public alertCtrl: AlertController
    ){

    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);
    this.today = this.transformDateFormat2(new Date());
    this.categoryForm = formBuilder.group({
      'category': ['', Validators.compose([Validators.required])]
    });

  }

  ionViewDidLoad() {

    this.platform
      .ready()
      .then(() =>
      {
        setTimeout(() =>
        {
          this.getCategories();
        }, 1000);
      });
    
  }

   /**  Add a new input field for category */
  addField(){

    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);

    let size = this.dataArray.length;

    if(size >= 5){
      this.canAddField = false;
    }
    else{
      this.canAddField = true;
    }

  }

  /**  remove this input field  */
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

  /**  Clear/Remove all additional Category input fields  */
  clear(){ 

    this.dataArray =[];
    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);
    this.canAddField = true;

  }


  onSubmit(){

    let size = this.dataArray.length;
    let atleastOneAdded = false;
    let allNull = true;

    if(size > 0){

      for(var i = 0; i < size; i++) { 
        let categoryName = this.dataArray[i].name;  
        if(categoryName != ""){
          allNull = false;
          this.database.checkCategoryByName(categoryName).then((result) => { 
            if(result != 1){
              try{         
                this.database.insertCategory(categoryName);
                atleastOneAdded = true;
              }catch(error){
                //this.alertViewer.presentAlert("Insert Error! ",error);
              }             
            }
            else{
              this.alertViewer.presentAlert("Category Here! ", ` Category "${categoryName}" is already here `);
            }
          }).catch(error => {
            //this.alertViewer.presentAlert("Checking Error! ", error);
          });
        }
      }
      setTimeout(() =>
        {
        if(atleastOneAdded){
          this.alertViewer.presentAlert("Category Adding! ", "Successfully Added!");
          setTimeout(() =>
          {
            this.getCategories();
          }, 500);
        }
        else if(allNull){
          this.alertViewer.presentAlert("Category! ","Name of a category should be entered ");
        }
      }, 1000);

      this.canAddField = true;
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

            this.categoryList.push({
              id: categories[i].id,
              name: categories[i].name
            });
       
          }

        }
      }  
    });

  }

  
  /**  Update Category   */
  presentPromptToEdit(id, oldCategory:string) {
    let alert = this.alertCtrl.create({
      title: 'Update Category',
      inputs: [
        {
          name: 'category',
          placeholder: oldCategory
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {

            this.database.checkCategoryByName(data.category).then((result) => { 
              if(result != 1){      
                this.database.updateCategoryById(parseInt(id),data.category);                    
              }
              else{
                this.alertViewer.presentAlert("Category Here! ", ` Category "${data.category}" is already here `);
              }
            }).catch(error => {       
            });   
            setTimeout(() =>
            {
              this.getCategories();
            }, 1000);
            
          }
        }
      ]
    });
    alert.present();
  }

  /**  Delete Category */
  presentConfirmToDelete(id, category:string) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Deleting',
      message: 'Do you realy want to delete the category "' +category+ '" ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {

            this.database.deleteCategoryeById(parseInt(id));

            setTimeout(() =>
            {
              this.getCategories();
            }, 1000);
          }
        }
      ]
    });
    alert.present();
  }

  private transformDateFormat2(date):string {
    return this.datePipe.transform(date, 'MMMM dd yyyy'); 
  }
  

}
