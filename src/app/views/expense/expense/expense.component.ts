import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  providers: [DatePipe]

})
export class ExpenseComponent implements OnInit {

  totalPayment: number = 0;
  expenseheads: any;
  selectedHead: any = "";
  oninitdata:any
  invoicetotal: any;
  taxableamount: any;
  estimatetotal: any;
  selectedSupplier: any ="";


    range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  totalgstreport: any;
  clickedexpensehead: any;
  suppliernames:any= '';
  allsupplierdata: any;
  forparticularpopup_alldata: any;
  forparticularpopup_index: any;
  forparticularpopup_length: any;
  particularpopupdata: any;
  particularpopupdata_for: any;
  particularpopupdata_transdate: any;
  particularpopupdata_transref: any;
  particularpopupdata_amount: any;
  dialogref: any;
  

  constructor( private LocalStoreService: LocalStoreService,private datePipe: DatePipe,private _adapter: DateAdapter<any>,private dialog: MatDialog,) { }

  ngOnInit() {
    
    this.getexpenseheads()
    this.getvendardata()
    this._adapter.setLocale('en'); // Set locale as per your requirement

     var onintdate = new Date();
    var enddate = this.datePipe.transform(onintdate,'yyyy-MM-dd')
    var startOfMonth = new Date(onintdate.getFullYear(), onintdate.getMonth(), 1);
    var startdate = this.datePipe.transform(startOfMonth,'yyyy-MM-dd')

    this.range = new FormGroup({
      start: new FormControl(startdate),
      end: new FormControl(enddate)
    });

    this.oninitclick()
  }


  oninitclick(){
    var onintdate = new Date();
    var enddate = this.datePipe.transform(onintdate,'yyyy-MM-dd')
    var startOfMonth = new Date(onintdate.getFullYear(), onintdate.getMonth(), 1);
    var startdate = this.datePipe.transform(startOfMonth,'yyyy-MM-dd')
    console.log("the data inside the onmonth start",startdate)
      this.clickedexpensehead = ''
      this.LocalStoreService.getdataby_expensehead(startdate,enddate,this.clickedexpensehead,this.suppliernames).subscribe(data=>{
        this.oninitdata = data.response
        this.totalPayment = this.oninitdata.reduce((sum, data) => {
          const paymentSum = data.transaction.reduce((total, transaction) => {
            return total + (transaction.receiptpayment?.payment || 0);
          }, 0);
          return sum + paymentSum;
        }, 0);
      })
}


onexpenseChange(event: any) {

   this.clickedexpensehead= event.target.value

  var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
  var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')

  this.suppliernames =''
  this.LocalStoreService.getdataby_expensehead(startdate,enddate,this.clickedexpensehead,this.suppliernames).subscribe(data=>{
    this.oninitdata = data.response
    this.totalPayment = this.oninitdata.reduce((sum, data) => {
      const paymentSum = data.transaction.reduce((total, transaction) => {
        return total + (transaction.receiptpayment?.payment || 0);
      }, 0);
      return sum + paymentSum;
    }, 0);
  })

}

getexpenseheads(){

  this.LocalStoreService.getexpenseheads().subscribe(data=>{
    this.expenseheads = data.response

  console.log("thed ata inside the allheads",this.expenseheads)

  })
}


  onDatepickerClosed(): void {
    let totalexpense = 0

    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')

    console.log('the data reange',startdate,enddate)

  
    this.LocalStoreService.getdataby_expensehead(startdate,enddate,this.clickedexpensehead,this.suppliernames).subscribe(data=>{
      this.oninitdata = data.response

    this.totalPayment = this.oninitdata.reduce((sum, data) => {
      const paymentSum = data.transaction.reduce((total, transaction) => {
        return total + (transaction.receiptpayment?.payment || 0);
      }, 0);
      return sum + paymentSum;
    }, 0);
    })
  }


  onsupplierChange(event: any) {
    console.log('Selected ID:', event.target.value);

    this.suppliernames = event.target.value

    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
  
    this.clickedexpensehead =''
    this.LocalStoreService.getdataby_expensehead(startdate,enddate,this.clickedexpensehead,this.suppliernames).subscribe(data=>{
      this.oninitdata = data.response

    this.totalPayment = this.oninitdata.reduce((sum, data) => {
      const paymentSum = data.transaction.reduce((total, transaction) => {
        return total + (transaction.receiptpayment?.payment || 0);
      }, 0);
      return sum + paymentSum;
    }, 0);
    })
  }


  getvendardata() {
    var cursor = '';
    this.LocalStoreService.getvendardata(cursor).subscribe(data => {
      this.allsupplierdata = data.response;
   
    });
  }

    openparticularpopup(particularpage, data,alldata,index) {

      this.forparticularpopup_alldata = alldata
      this.forparticularpopup_index = index
      this.forparticularpopup_length = alldata.length
  
      this.particularpopupdata = alldata[index].receiptpayment.joinedparticulars || alldata[index].receiptpayment.particulars
    
      this.particularpopupdata_for = alldata[index].receiptpayment.for 
      this.particularpopupdata_transdate = alldata[index].receiptpayment.date 
      this.particularpopupdata_transref = alldata[index].receiptpayment.particulars 
      this.particularpopupdata_amount = alldata[index].receiptpayment.totalreceipt_amount || alldata[index].receiptpayment.payment
      
      this.particularpopupdata = alldata[index].receiptpayment.joinedparticulars || alldata[index].receiptpayment.particulars
  
      this.dialogref = this.dialog.open(particularpage, {
        width: '32%',
        // height:'80%'
      });
  }


  previousparticular(){

    if(this.forparticularpopup_index > 0){
      this.forparticularpopup_index--
      }
    if(this.forparticularpopup_alldata[this.forparticularpopup_index]){
    this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for 
    this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date 
    this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars 
    this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
    this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
    }
  }

  nextparticular(){

    var totalcontent = this.forparticularpopup_length - 2
    if(totalcontent >= this.forparticularpopup_index){
    this.forparticularpopup_index++
    }
    if(this.forparticularpopup_alldata[this.forparticularpopup_index]){
    this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for 
    this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date 
    this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars 
    this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
    this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
    }


  }







  

}
