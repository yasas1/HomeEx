import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Category } from '../../models/Category';
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';

/**
 * Generated class for the AddCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage {

  category = new Category();

  dataArray = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertViewer: AlertViewerProvider
     ) {
  }

  ionViewDidLoad() {
    this.dataArray.push(this.category);
  }

  onSubmit(){

  }

  addFrom(){

    this.category = new Category();
    this.dataArray.push(this.category);

  }

}
