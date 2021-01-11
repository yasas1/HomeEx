import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TappedSpendingPage } from './tapped-spending';

@NgModule({
  declarations: [
    TappedSpendingPage,
  ],
  imports: [
    IonicPageModule.forChild(TappedSpendingPage),
  ],
})
export class TappedSpendingPageModule {}
