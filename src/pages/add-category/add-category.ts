import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Category } from '../../models/Category';
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    this.alertViewer.presentAlert("Categories! ","category "+this.dataArray[0].name);
  }

  clear(){

    this.categoryForm.reset();
  }

  

}
