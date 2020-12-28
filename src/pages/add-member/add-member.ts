import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController ,AlertController, Platform} from 'ionic-angular';
import { Category } from '../../models/Category';
import { AlertViewerProvider } from '../../providers/alert-viewer/alert-viewer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';
import { Member } from '../../models/Member';

/**
 * Generated class for the AddMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {

  public member = new Member();

  public dataArray:any=[];

  public memberList: Array<{id: number, name: string}>;

  public canAddField:boolean = true;

  memberForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private database: DatabaseProvider,
    public formBuilder: FormBuilder,
    private alertViewer: AlertViewerProvider,
    public updateModal : ModalController,
    private alertCtrl: AlertController
    ){

    this.member = new Member();
    this.member.name="";
    this.dataArray.push(this.member);

    this.memberForm = formBuilder.group({
      'member': ['', Validators.compose([Validators.required])]
    });

  }

  ionViewDidLoad() {

    this.platform
      .ready()
      .then(() =>
      {
        setTimeout(() =>
        {
          this.getMembers();
        }, 1000);
      });
    
  }

   /**  Add a new input field for category */
  addField(){

    this.member = new Member();
    this.member.name="";
    this.dataArray.push(this.member);

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
    this.member = new Category();
    this.member.name="";
    this.dataArray.push(this.member);
    this.canAddField = true;

  }


  onSubmit(){

    let size = this.dataArray.length;
    let atleastOneAdded = false;
    let allNull = true;

    if(size > 0){

      for(var i = 0; i < size; i++) { 
        let memberName = this.dataArray[i].name;  
        if(memberName != ""){
          allNull = false;
          this.database.checkMemberByName(memberName).then((result) => { 
            if(result != 1){
              try{         
                this.database.insertMember(memberName);
                atleastOneAdded = true;
              }catch(error){
                //this.alertViewer.presentAlert("Insert Error! ",error);
              }             
            }
            else{
              this.alertViewer.presentAlert("Member Here! ", ` Member "${memberName}" is already here `);
            }
          }).catch(error => {
            //this.alertViewer.presentAlert("Checking Error! ", error);
          });
        }
      }

      if(atleastOneAdded){
        this.alertViewer.presentAlert("Member Adding! ", "Successfully Added!");
        setTimeout(() =>
        {
          this.getMembers();
        }, 1000);
      }
      else if(allNull){
        this.alertViewer.presentAlert("Member! ","Name of a member should be entered ");
      }
  
      setTimeout(() =>
      {
        this.dataArray =[];
        this.member = new Category();
        this.member.name="";
        this.dataArray.push(this.member);
      }, size*500);
      
    }
  }

  getMembers(){

    this.database.getAllMembers().then((result) => { 

      let members;

      if(result != 0){

        members =  result;  

        let membersLength = members.length;

        if(membersLength > 0){

          this.memberList = [];

          for(let i=0; i < membersLength; i++) {

            this.memberList.push({
              id: members[i].id,
              name: members[i].name
            });
       
          }

        }
      }  
    });

  }

  
  /**  Update Category   */
  presentPromptToEdit(id, oldMember:string) {
    let alert = this.alertCtrl.create({
      title: 'Update Member',
      inputs: [
        {
          name: 'member',
          placeholder: oldMember
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

            this.database.checkMemberByName(data.member).then((result) => { 
              if(result != 1){      
                this.database.updateMemberyById(parseInt(id),data.member);                    
              }
              else{
                this.alertViewer.presentAlert("Member Here! ", ` Member "${data.member}" is already here `);
              }
            }).catch(error => {       
            });   
            setTimeout(() =>
            {
              this.getMembers();
            }, 1000);
            
          }
        }
      ]
    });
    alert.present();
  }

  /**  Delete Category */
  presentConfirmToDelete(id, member:string) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Deleting',
      message: 'Do you realy want to delete the member "' +member+ '" ?',
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

            this.database.deleteMemberById(parseInt(id));

            setTimeout(() =>
            {
              this.getMembers();
            }, 1000);
          }
        }
      ]
    });
    alert.present();
  }

}
