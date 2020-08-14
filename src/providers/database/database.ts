//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform} from 'ionic-angular';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';
import { AlertViewerProvider } from '../alert-viewer/alert-viewer';


/*
  @author Yasas Ranawaka
  @date Aug 11 2020
*/

@Injectable()
export class DatabaseProvider {

  private databaseObj: SQLiteObject;

  /** Database name */
  private readonly database_name: string = "Home_Expenditure.db";

  /** Database tables names */
  private readonly expenditureTable: string = "expenditure"
  private readonly categoryTable: string = "category";

  constructor(
    //public http: HttpClient,
    private platform: Platform,
    private sqlite: SQLite,
    public alertViewer: AlertViewerProvider
    ) {
    console.log('Hello DatabaseProvider Provider');
    this.platform.ready().then(() => {
      this.createDB();  
    }).catch(error => {
      this.alertViewer.presentAlert("Error ","Database creating Error!");
    });
  }

  /**  Database creating */
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
      }).then(() => {
        this.createExpenditureTable(this.expenditureTable); // create expenditure Table
        this.createCategoryTable(this.categoryTable); // create category Table
      })
      .catch(e => {
        this.alertViewer.presentAlert("Table Creating! ","Table Creating Error! ");
      })
  }

  /**  Create Expenditure table  */
  createExpenditureTable( table : string ) {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${table} (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, category_id INT, description TEXT, amount INT)
    `, [])
      .catch(e => {
        this.alertViewer.presentAlert("Table Creating! ","Expenditure Table Creating Error");
      });
  }

  /**  Create Expenditure table  */
  createCategoryTable( table : string ) {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${table} (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT)
    `, [])
      .catch(e => {
        this.alertViewer.presentAlert("Table Creating! ","Expenditure Table Creating Error");
      });
  }

  /**  Table droping function (if you need) */
  dropTable(table:string) {
    this.databaseObj.executeSql(`
    DROP TABLE ${table}
    `, [])
      .then(() => {
        this.alertViewer.presentAlert("Table Dropped! ", `${ table } Table Droped`);
      })
      .catch(e => {
        this.alertViewer.presentAlert("Table Dropped! ","Error");
      });
  }

  /**  Insert expenditure  */
  insertExpenditure(date:string, category_id:number, description:string, amount:number ) {
    
    this.databaseObj.executeSql(`
      INSERT INTO expenditure (date,category_id,description,amount) VALUES ('${date}','${category_id}','${description}','${amount}')
    `, [this.alertViewer.presentAlert("Insert Successfull! ","Expenditure inserting Successfull")])
      .catch(e => {
        this.alertViewer.presentAlert("Insert Error! ","Expenditure inserting error");
      });
  }

  /**  Insert expenditure  */
  insertCategory(name:string) {
    
    this.databaseObj.executeSql(`
      INSERT INTO category (name) VALUES ('${name}')
    `, [])
      .catch(e => {
        this.alertViewer.presentAlert("Insert Error! ","Category inserting error");
      });
  }

  /**  Get Expenditures by date */
  getExpendituresByDate(date:string) {

    return this.databaseObj.executeSql(`
      SELECT e.id, c.name, e.date, e.description, e.amount FROM expenditure e JOIN category c ON e.category_id = c.id WHERE e.date='${date}'
      `, [])
        .then((data) => {

          let expenditures= [];

          if(data.rows.length > 0){

            for(let i=0; i <data.rows.length; i++) {

              expenditures.push({
                id:data.rows.item(i).id,
                date:data.rows.item(i).date,
                category:data.rows.item(i).name,             
                description:data.rows.item(i).description,
                amount:data.rows.item(i).amount
              });
            }
            return expenditures;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Expenditures Getting Error! ","Get error"+JSON.stringify(error));
        }
    );
  }

  /**  Get Categories by date */
  getCategories() {

    return this.databaseObj.executeSql(`
      SELECT * FROM category 
      `, [])
        .then((data) => {

          let categories= [];
          if(data.rows.length > 0){

            for(let i=0; i <data.rows.length; i++) {

              categories.push({
                id:data.rows.item(i).id,
                name:data.rows.item(i).name
              });

            }
            return categories;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Categories Getting Error! ","Get error"+JSON.stringify(error));
        }
    );
  }

  getCategoriesCount() {

    return this.databaseObj.executeSql(`
      SELECT COUNT(*) as count FROM category 
      `, [])
        .then((data) => {

          if( Number(data.rows.item(0).count) > 0){

            return data;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Categories Getting Error! ","Get error"+JSON.stringify(error));
        }
    );
  }

  /**  Update Expenditure by id */
  updateExpenditureById(id:number,date:string,category_id:number,description:string,amount:number) {
    this.databaseObj.executeSql(`
      UPDATE expenditure
      SET date = '${date}', category_id = '${category_id}', description = '${description}',amount = '${amount}'
      WHERE id = '${id}'
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Updating Error! ","Expenditure updating error");
      }
    );
  }

  /**  Delete Expenditure by id */
  deleteExpenditureById(id:number) {
    this.databaseObj.executeSql(`
      DELETE FROM expenditure 
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Deleting Error! ","Expenditure updating error");
      }
    );
  }


}
