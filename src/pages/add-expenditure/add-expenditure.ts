import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  someForm: FormGroup;

  constructor(
    public navCtrl: NavController,
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAccountPage');
  }

  addAccount() {

    console.log(this.description);
    console.log(this.amount);
    console.log(this.date);
    console.log(this.category);

  }

  validateInput(){
    
  }

  transformDateFormat1(date):string {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); 
  }

  transformDateFormat2(date):string {
    return this.datePipe.transform(date, 'MMMM dd yyyy'); 
  }

}
