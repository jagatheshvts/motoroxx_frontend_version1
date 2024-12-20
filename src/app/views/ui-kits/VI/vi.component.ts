import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { DateAdapter } from '@angular/material/core';






@Component({
  selector: 'app-vi',
  templateUrl: './vi.component.html',
  styleUrls: ['./vi.component.scss'],
  providers: [DatePipe]
})
export class ViComponent implements OnInit {
  total_vehicle: any;


  
  onintdate: Date = new Date();
  invoicetotal: any;
  taxableamount: any;
  estimatetotal: any;


    range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  totalgstreport: any;
  

  constructor(private LocalStoreService: LocalStoreService, private datePipe: DatePipe,private _adapter: DateAdapter<any>) { }

  ngOnInit(): void {

    this._adapter.setLocale('en'); // Set locale as per your requirement

    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');

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


    var status = "datewise_totalgst_vi-report"

      this.LocalStoreService.gettotal_gstdatewise(startdate,status).subscribe(data=>{

        this.total_vehicle = data.response.length

        var oninitdata 


        this.totalgstreport = data.response
        oninitdata = data.response


        this.totalgstreport.forEach(report=>{

          if(report.estimate && !report.invoice){
  
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
  
          }
  
          if(report.invoice){
  
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)
          }
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount.toFixed(2)


      })
}

  onDatepickerClosed(): void {

    let total_estimateamount = 0
    let total_invoiceamount = 0

    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
    if(startdate === enddate ){
      var status = "datewise_totalgst_vi-report"
      this.LocalStoreService.gettotal_gstdatewise(startdate,status).subscribe(data=>{

        this.total_vehicle = data.response.length

        this.totalgstreport = data.response
        this.totalgstreport.forEach(report=>{
          if(report.estimate && !report.invoice){
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
          }
          if(report.invoice){
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)
          }
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount.toFixed(2)
      })
    }else {
      var status = "rangewise_totalgst_vi-report"
      this.LocalStoreService.gettotal_gstrangeewise(startdate,enddate,status).subscribe(data=>{

        this.total_vehicle = data.response.length

        this.totalgstreport = data.response 
        this.totalgstreport.forEach(report=>{
          if(report.estimate && !report.invoice){
          total_estimateamount += parseFloat(report.estimate.estimate_amount)
          }
          if(report.invoice){
            total_invoiceamount += parseFloat(report.invoice.invoice_amount)
          }
        })
        this.estimatetotal = total_estimateamount
        this.invoicetotal = total_invoiceamount.toFixed(2)
      })
    }
  }

  total_rangewie_gstexcel(){

    console.log("entereedddddd est report")

    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')

    if(startdate === enddate ){
      
      var status = "datewise_totalgst_vi-report"
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

              
              
              if(data.estimate && !data.invoice ){
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
                  "VI Date" : this.datePipe.transform(data.createddate, 'dd-MM-yyyy'),
                  "Es Date" : this.datePipe.transform(data.estimate? data.estimate.date:'NA', 'dd-MM-yyyy'),
                  "In Date" : this.datePipe.transform(data.invoice? data.invoice.date:'NA', 'dd-MM-yyyy'),
                  "EST R.NO": (data.estimate?data.estimate.estimate_reference_number:"NA"),
                  "Inv R.NO": (data.invoice?data.invoice.invoice_reference_number:"NA"),
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
             var finame ="vi-report"

             console.log("the entered data inside the excel",afteroct_customers)
      
      this.LocalStoreService.exportAsmonthlyreport_data(afteroct_customers,finame)

      })
    }else{

      
      var status = "rangewise_totalgst_vi-report"
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

              
              
              if(data.estimate && !data.invoice ){
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
                  // this.datePipe.transform(data.createddate, 'dd-MM-yyyy')
                  "VI Date" :this.datePipe.transform(data.createddate, 'dd-MM-yyyy'),
                  "Es Date" : data.estimate ? this.datePipe.transform(data.estimate.date, 'dd-MM-yyyy') : 'NA',
                  "In Date" : data.invoice ? this.datePipe.transform(data.invoice.date, 'dd-MM-yyyy') : 'NA',
                  "EST R.NO": (data.estimate?data.estimate.estimate_reference_number:"NA"),
                  "Inv R.NO": (data.invoice?data.invoice.invoice_reference_number:"NA"),
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
             var finame ="vi-report"

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
