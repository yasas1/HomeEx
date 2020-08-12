import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAccountPage } from './add-expenditure';

@NgModule({
  declarations: [
    AddAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAccountPage),
  ],
})
export class AddAccountPageModule {}
