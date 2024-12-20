import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { LocalStoreService } from 'src/app/shared/services/local-store.service'; 
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { SpareprofitPageComponent } from '../spareprofit-page/spareprofit-page.component';

@Component({
  selector: 'app-inv',
  templateUrl: './inv.component.html',
  styleUrls: ['./inv.component.scss'],
  providers: [DatePipe]

})
export class InvComponent implements OnInit {

  onintdate: Date = new Date();
  // estimatetotal: number;
  invoicetotal: any;
  taxableamount: any;
  estimatetotal: any;


  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  totalgstreport: any;
  referencename: any;
  totalspareprofitsum =0 ;
  // totalspareprofitsum: number;

  constructor(private LocalStoreService: LocalStoreService,private dialog: MatDialog, private datePipe: DatePipe,private _adapter: DateAdapter<any>,private model: NgbModal) { }

  ngOnInit() {

    
    this._adapter.setLocale('en'); // Set locale as per your requirement

    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');

    // Initialize the form group with start and end date set to today's date
    this.range = new FormGroup({
      start: new FormControl(formattedDate),
      end: new FormControl(formattedDate)
    });

    this.oninitclick()
  }

  
  oninitclick(){

    let total_estimateamount = 0
    let total_invoiceamount = 0
    let totalspareprofit = 0
    let filteredSpares 
    

    var startdate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')


    var status = "datewise_totalgst_inv-report"

      this.LocalStoreService.gettotal_gstdatewise(startdate,status).subscribe(data=>{

        var oninitdata 


        this.totalgstreport = data.response
        oninitdata = data.response


        this.totalgstreport.forEach(report=>{

          if(report.estimate){
  
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
  
          }
  
          if(report.invoice){
  
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)

          

          }
          if(report.invoice.all_spares.length > 1){
            
            filteredSpares = report.invoice.all_spares.filter(spare => {
             const formattedspares = spare.spare.toLowerCase().replace(/\s/g, ''); // Convert to lowercase and remove spaces
             return formattedspares !== 'gsp' && formattedspares !== 'gsp';
         });

         filteredSpares.forEach(filterspares=>{
          if(filterspares.rate && filterspares.buyingprice ){
            totalspareprofit += parseFloat(filterspares.rate) - parseFloat(filterspares.buyingprice)
           this.totalspareprofitsum = totalspareprofit

          }
           

         })

       }
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount


      })
}

  onDatepickerClosed(): void {

    let total_estimateamount = 0
    let total_invoiceamount = 0
    let filteredSpares 
    let totalspareprofit = 0


    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
    if(startdate === enddate ){
      var status = "datewise_totalgst_inv-report"
      this.LocalStoreService.gettotal_gstdatewise(startdate,status).subscribe(data=>{
        this.totalgstreport = data.response
        this.totalgstreport.forEach(report=>{
          if(report.estimate){
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
          }
          if(report.invoice){
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)
          }

          if(report.invoice.all_spares.length > 1){
            
               filteredSpares = report.invoice.all_spares.filter(spare => {
                const formattedspares = spare.spare.toLowerCase().replace(/\s/g, ''); // Convert to lowercase and remove spaces
                return formattedspares !== 'gsp' && formattedspares !== 'gsp';
            });

            filteredSpares.forEach(filterspares=>{
              if(filterspares.rate && filterspares.buyingprice){

                totalspareprofit += parseFloat(filterspares.rate) - parseFloat(filterspares.buyingprice)
                this.totalspareprofitsum = totalspareprofit

              }
             

            })

          }

        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount.toFixed(2)
      })
    }else {
      var status = "rangewise_totalgst_inv-report"
      this.LocalStoreService.gettotal_gstrangeewise(startdate,enddate,status).subscribe(data=>{
        this.totalgstreport = data.response 
        this.totalgstreport.forEach(report=>{
          if(report.estimate){
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
          }
          if(report.invoice){
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)
          }

          if(report.invoice.all_spares.length > 1){
            
            filteredSpares = report.invoice.all_spares.filter(spare => {
             const formattedspares = spare.spare.toLowerCase().replace(/\s/g, ''); // Convert to lowercase and remove spaces
             return formattedspares !== 'gsp' && formattedspares !== 'gsp';
         });

         filteredSpares.forEach(filterspares=>{
          if(filterspares.buyingprice && filterspares.rate){
            totalspareprofit += parseFloat(filterspares.rate) - parseFloat(filterspares.buyingprice)
           this.totalspareprofitsum = totalspareprofit

           console.log("the ending data of the spareprofit in else",this.totalspareprofitsum)

          }
           

         })

       }
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount.toFixed(2)
      })
    }
  }

 

formatEstimateAmount(estimateAmount: any): string {
  if (typeof estimateAmount === 'number' || typeof estimateAmount === 'string') {
    const parsedAmount = Number(estimateAmount);
    if (!isNaN(parsedAmount)) {
      return parsedAmount.toFixed(2);
    }
  }
  return 'not estimated';
}

formatInvoiceAmount(invoiceAmount: any): string {
  if (typeof invoiceAmount === 'number' || typeof invoiceAmount === 'string') {
    const parsedAmount = Number(invoiceAmount);
    if (!isNaN(parsedAmount)) {
      return parsedAmount.toFixed(2);
    }
  }
  return 'not Invoiced';
}


total_rangewie_gstexcel(){

  var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
  var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')

  if(startdate === enddate ){
    
    var status = "datewise_totalgst_inv-report"
    this.LocalStoreService.gettotal_gstdatewise(startdate,status).subscribe(data=>{

      var obj = {}
      let estimatedata
      let vehicleno
      let vehiclebrand
      let vehiclemodel
      let estimatespares
      let invoicedata
      var afteroct_customers = [];
           var alldata = data.response

           console.log("the data of estimate in the estimate report",data.response)

           alldata.forEach(data=>{

            
            
            if(data.estimate){
             estimatedata = data.estimate.estimate_amount
            }else{
              estimatedata = "Not Estimated"
            }

            if(data.invoice){
              invoicedata = data.invoice.invoice_amount
            }else{
              invoicedata = "Not Invoiced"
            }
            data.customers.forEach(data2=>{
              data.vehicledetails.forEach(data3=>{
                vehicleno = data3.vh_number,
                vehiclebrand = data3.brand
                vehiclemodel = data3.model
              })
              let emptydata
              let emptydata2
              obj ={
                "Inv Date" :this.datePipe.transform(data.invoice.date, 'dd-MM-yyyy'),
                "Customer" : data2.name,
                "Mobile" : data2.mobile,
                "Veh No": vehicleno,
                "Brand": vehiclebrand,
                "Model": vehiclemodel,
                "Estimate" :estimatedata,
                "Invoice":invoicedata,
                "" : emptydata,
              }
            })
           afteroct_customers.push(obj)
           })
           var finame ="inv-report"
    this.LocalStoreService.exportAsmonthlyreport_data(afteroct_customers,finame)
    })
  }else{
    var status = "rangewise_totalgst_inv-report"
    this.LocalStoreService.gettotal_gstrangeewise(startdate,enddate,status).subscribe(data=>{
      var obj = {}
      let estimatedata
      let vehicleno
      let vehiclebrand
      let vehiclemodel
      let estimatespares
      let invoicedata
      var afteroct_customers = [];
           var alldata = data.response
           alldata.forEach(data=>{
            if(data.estimate){
             estimatedata = data.estimate.estimate_amount
            }else{
              estimatedata = "Not Estimated"
            }
            if(data.invoice){
              invoicedata = data.invoice.invoice_amount
            }else{
              invoicedata = "Not Invoiced"
            }
            data.customers.forEach(data2=>{
              data.vehicledetails.forEach(data3=>{
                vehicleno = data3.vh_number,
                vehiclebrand = data3.brand
                vehiclemodel = data3.model
              })
              let emptydata
              let emptydata2
              obj ={
                "Inv Date" :this.datePipe.transform(data.invoice.date, 'dd-MM-yyyy'),
                "Customer" : data2.name,
                "Mobile" : data2.mobile,
                "Veh No" : vehicleno,
                "Brand": vehiclebrand,
                "Model": vehiclemodel,
                "Estimate" :estimatedata,
                "Invoice":invoicedata,
                "" : emptydata,
              }
            })
           afteroct_customers.push(obj)
           })
           var finame ="inv-report"
    this.LocalStoreService.exportAsmonthlyreport_data(afteroct_customers,finame)

    })


  }

}

dialogref: any;
updatedinvid:any
invirefjobid:any
invirefbookingid:any
editinvimateid(invoiceideditpage,bookjobid,reference,alldata){
  console.log("enterd to edit invoice")
  this.invirefbookingid = reference
  this.invirefjobid = bookjobid
  alldata.customers.forEach(data=>{
    this.referencename = data.name
  })
    this.dialogref = this.dialog.open(invoiceideditpage, {

    });
}


// editinvibook(){
//   this.LocalStoreService.editinvibookjobid(this.invirefjobid,this.updatedinvid).subscribe(data=>{
//     this.updatedinvid = ''
//     this.invirefjobid =''
//     this.dialogref.close()
//   })
// }

}
