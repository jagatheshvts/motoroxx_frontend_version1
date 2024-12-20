import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import {FormGroup, FormControl} from '@angular/forms';
import { LocalStoreService } from 'src/app/shared/services/local-store.service'; 
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-est',
  templateUrl: './est.component.html',
  styleUrls: ['./est.component.scss'],
  animations: [SharedAnimations],
  providers: [DatePipe]
})
export class EstComponent implements OnInit {

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
  

  constructor(private LocalStoreService: LocalStoreService, private datePipe: DatePipe,private _adapter: DateAdapter<any>) { 

  
  }

  ngOnInit() {

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

    var startdate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')


    var status = "datewise_totalgst_est-report"

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
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount


      })
}

  onDatepickerClosed(): void {

    let total_estimateamount = 0
    let total_invoiceamount = 0

    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
    if(startdate === enddate ){
      var status = "datewise_totalgst_est-report"
      this.LocalStoreService.gettotal_gstdatewise(startdate,status).subscribe(data=>{
        this.totalgstreport = data.response
        this.totalgstreport.forEach(report=>{
          if(report.estimate){
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
          }
          if(report.invoice){
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)
          }
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount
      })
    }else {
      var status = "rangewise_totalgst_est-report"
      this.LocalStoreService.gettotal_gstrangeewise(startdate,enddate,status).subscribe(data=>{
        this.totalgstreport = data.response 
        this.totalgstreport.forEach(report=>{
          if(report.estimate){
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
          }
          if(report.invoice){
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)
          }
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount
      })
    }
  }

  total_rangewie_gstexcel(){

    console.log("entereedddddd est report")

    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')

    if(startdate === enddate ){
      
      var status = "datewise_totalgst_est-report"
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
                  // "Booking Id" : data.booking_reference_id,
                  "Est Date" : this.datePipe.transform(data.estimate.date, 'dd-MM-yyyy'),
                  "Customer" : data2.name,
                  "Mobile" : data2.mobile,
                  "Veh No": vehicleno,
                  "Brand": vehiclebrand,
                  "Model": vehiclemodel,
                  "Estimate" :estimatedata,
                  "Invoice":invoicedata,
                  "" : emptydata,
                  // "Estimate Total":this.estimatetotal,
                }
  
              })
             afteroct_customers.push(obj)
             })
             var finame ="Est-report"

             console.log("the entered data inside the excel",afteroct_customers)
      
      this.LocalStoreService.exportAsmonthlyreport_data(afteroct_customers,finame)

      })
    }else{

      
      var status = "rangewise_totalgst_est-report"
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
                  // "Booking Id" : data.booking_reference_id,
                  "Est Date" :this.datePipe.transform(data.estimate.date, 'dd-MM-yyyy'),
                  "Customer" : data2.name,
                  "Mobile" : data2.mobile,
                  "Veh No": vehicleno,
                  "Brand": vehiclebrand,
                  "Model": vehiclemodel,
                  "Estimate" :estimatedata,
                  "Invoice":invoicedata,
                  "" : emptydata,
                  // "Estimate Total":this.estimatetotal,
                }
  
              })
             afteroct_customers.push(obj)
             })
             var finame ="Est-report"

             console.log("the entered data inside the excel",afteroct_customers)
      
      this.LocalStoreService.exportAsmonthlyreport_data(afteroct_customers,finame)




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

}
