import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { DateAdapter } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chatscreen',
  templateUrl: './chatscreen.component.html',
  styleUrls: ['./chatscreen.component.scss'],
  providers: [DatePipe]

})
export class ChatscreenComponent implements OnInit {

  total_vehicle: any;
  onintdate: Date = new Date();
  invoicetotal: any;
  taxableamount: any;
  estimatetotal: any;

  selectedYearMonth: any;



    range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  totalgstreport: any;

  years: number[] = [];
  months: string[] = [];
  selectedYear: any;
  selectedMonth: any;

  selectedValue: string;

  constructor(private LocalStoreService: LocalStoreService, private datePipe: DatePipe,private _adapter: DateAdapter<any>,private toastr: ToastrService) {

    const currentYear = new Date().getFullYear();


    // Populate years array with last 10 years
    for (let year = currentYear; year >= currentYear - 10; year--) {
      this.years.push(year);
    }

   
    for (let month = 1; month <= 12; month++) {
      const formattedMonth = month < 10 ? `0${month}` : `${month}`; // Ensure two-digit format
      this.months.push(formattedMonth);
    }


    this.selectedYearMonth = `${currentYear}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;

    this.selectedMonth =(new Date().getMonth() + 1).toString().padStart(2, '0')

    console.log('the monthhhhhhhhhhhhh',this.selectedMonth)
    this.selectedYear  = currentYear

    
    
   }

  ngOnInit() {

    this._adapter.setLocale('en'); 

    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');

    this.range = new FormGroup({
      start: new FormControl(formattedDate),
      end: new FormControl(formattedDate)
    });

    this.oninitclick()
  }



  
  getMonthName(month: number): string {
    return new Date(0, month - 1).toLocaleString('en', { month: 'short' });
  }


  onSelectionChange(type: string) {

    let total_estimateamount = 0
    let total_invoiceamount = 0
    if (type === 'year') {
      console.log('Selected Year:', this.selectedYear);
    } else if (type === 'month') {
      console.log('Selected Month:', this.selectedMonth);
    }

    // Check if both month and year are selected
    if (this.selectedYear && this.selectedMonth) {

      var status = "rangewise_totalgst_vi-report"

      this.selectedYearMonth = `${this.selectedYear}-${this.selectedMonth}`;
      this.LocalStoreService.get_data_forwhatsappscreen(this.selectedYearMonth,status).subscribe(data=>{

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

  oninitclick(){

    let total_estimateamount = 0
    let total_invoiceamount = 0

    var startdate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')

    var status = "datewise_totalgst_vi-report"
      this.LocalStoreService.get_data_forwhatsappscreen(this.selectedYearMonth,status).subscribe(data=>{

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



sendWhatsApp(mobile: string, data: any) {
  if (!mobile) {
    console.error('Mobile number is not provided');
    return;
  }
  const customerName = data.customers[0].name.trim();
  const bookingReferenceId = data.booking_reference_id;
  const vehicleNumber = data.vehicledetails[0].vh_number;
  const vehicleBrand = data.vehicledetails[0].brand;
  const vehicleModel = data.vehicledetails[0].model;
  const serviceAmount = data.gs_selected_amount.split(',')[0].trim();
  const estimateAmount = data.estimate ? `Estimate Amount: ₹${data.estimate.estimate_amount}` : '';
  const invoiceAmount = data.invoice ? `Invoice Amount: ₹${data.invoice.invoice_amount}` : '';

  let message = `Hello ${customerName},\n`;
  message += `Your vehicle (${vehicleBrand} ${vehicleModel}, ${vehicleNumber}) has been successfully booked for service.\n`;
  message += `Booking ID: ${bookingReferenceId}\n`;

  if (estimateAmount) {
    message += `${estimateAmount}\n`;
  }

  if (invoiceAmount) {
    message += `${invoiceAmount}\n`;
  }
  message += `Thank you for choosing our service!`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  this.LocalStoreService.whatsapp_sentupdate(data._id).subscribe(data=>{

    this.toastr.info('Success!', 'invoice saved successfully');
    this.oninitclick()
  })
}


onStatusChange(event) {
  var cursor = ''
  console.log('Selected value:', event.value);
  
}


}
