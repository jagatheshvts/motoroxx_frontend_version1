// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl } from '@angular/forms';
// import { DatePipe } from '@angular/common';
// import { LocalStoreService } from 'src/app/shared/services/local-store.service';
// import { DateAdapter } from '@angular/material/core';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-chatscreen',
//   templateUrl: './chatscreen.component.html',
//   styleUrls: ['./chatscreen.component.scss'],
//   providers: [DatePipe]

// })
// export class ChatscreenComponent implements OnInit {

//   total_vehicle: any;
//   onintdate: Date = new Date();
//   invoicetotal: any;
//   taxableamount: any;
//   estimatetotal: any;

//   selectedYearMonth: any;
//   range = new FormGroup({
//     start: new FormControl(),
//     end: new FormControl()
//   });
//   totalgstreport: any;

//   years: number[] = [];
//   months: string[] = [];
//   selectedYear: any;
//   selectedMonth: any;

//   selectedUser: any = null;
//   selectedUserId: string = '';
//   messageTemplates: any[] = [];
//   selectedTemplate: any = null;
//   selectedTemplateName: string = '';
//   showPopup: boolean = false;
//   previewMessage: string = '';

//   constructor(private LocalStoreService: LocalStoreService, private datePipe: DatePipe, private _adapter: DateAdapter<any>, private toastr: ToastrService) {

//     const currentYear = new Date().getFullYear();


//     // Populate years array with last 10 years
//     for (let year = currentYear; year >= currentYear - 10; year--) {
//       this.years.push(year);
//     }


//     for (let month = 1; month <= 12; month++) {
//       const formattedMonth = month < 10 ? `0${month}` : `${month}`; // Ensure two-digit format
//       this.months.push(formattedMonth);
//     }


//     this.selectedYearMonth = `${currentYear}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;

//     this.selectedMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')

//     console.log('the monthhhhhhhhhhhhh', this.selectedMonth)
//     this.selectedYear = currentYear



//   }

//   ngOnInit() {

//     this._adapter.setLocale('en');

//     const today = new Date();
//     const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');

//     this.range = new FormGroup({
//       start: new FormControl(formattedDate),
//       end: new FormControl(formattedDate)
//     });

//     this.oninitclick();
//     this.getTemplateName();
//   }




//   getMonthName(month: number): string {
//     return new Date(0, month - 1).toLocaleString('en', { month: 'short' });
//   }


//   onSelectionChange(type: string) {

//     let total_estimateamount = 0
//     let total_invoiceamount = 0
//     if (type === 'year') {
//       console.log('Selected Year:', this.selectedYear);
//     } else if (type === 'month') {
//       console.log('Selected Month:', this.selectedMonth);
//     }

//     // Check if both month and year are selected
//     if (this.selectedYear && this.selectedMonth) {

//       var status = "rangewise_totalgst_vi-report"

//       this.selectedYearMonth = `${this.selectedYear}-${this.selectedMonth}`;
//       this.LocalStoreService.get_data_forwhatsappscreen(this.selectedYearMonth, status).subscribe(data => {

//         this.total_vehicle = data.response.length

//         this.totalgstreport = data.response
//         this.totalgstreport.forEach(report => {
//           if (report.estimate && !report.invoice) {
//             total_estimateamount += parseFloat(report.estimate.estimate_amount)
//           }
//           if (report.invoice) {
//             total_invoiceamount += parseFloat(report.invoice.invoice_amount)
//           }
//         })
//         this.estimatetotal = total_estimateamount
//         this.invoicetotal = total_invoiceamount.toFixed(2)
//       })

//     }
//   }

//   oninitclick() {

//     let total_estimateamount = 0
//     let total_invoiceamount = 0

//     var startdate = this.datePipe.transform(this.onintdate, 'yyyy-MM-dd')

//     var status = "datewise_totalgst_vi-report"
//     this.LocalStoreService.get_data_forwhatsappscreen(this.selectedYearMonth, status).subscribe(data => {

//       this.total_vehicle = data.response.length

//       var oninitdata


//       this.totalgstreport = data.response
//       oninitdata = data.response


//       this.totalgstreport.forEach(report => {

//         if (report.estimate && !report.invoice) {

//           total_estimateamount += parseFloat(report.estimate.estimate_amount)

//         }

//         if (report.invoice) {

//           total_invoiceamount += parseFloat(report.invoice.invoice_amount)
//         }
//       })
//       this.estimatetotal = total_estimateamount
//       this.invoicetotal = total_invoiceamount.toFixed(2)


//     })
//   }


//   formatEstimateAmount(estimateAmount: any): string {
//     if (typeof estimateAmount === 'number' || typeof estimateAmount === 'string') {
//       const parsedAmount = Number(estimateAmount);
//       if (!isNaN(parsedAmount)) {
//         return parsedAmount.toFixed(2);
//       }
//     }
//     return 'not estimated';
//   }

//   formatInvoiceAmount(invoiceAmount: any): string {
//     if (typeof invoiceAmount === 'number' || typeof invoiceAmount === 'string') {
//       const parsedAmount = Number(invoiceAmount);
//       if (!isNaN(parsedAmount)) {
//         return parsedAmount.toFixed(2);
//       }
//     }
//     return 'not Invoiced';
//   }



//   // sendWhatsApp(mobile: string, data: any) {
//   //   if (!mobile) {
//   //     console.error('Mobile number is not provided');
//   //     return;
//   //   }
//   //   const customerName = data.customers[0].name.trim();
//   //   const bookingReferenceId = data.booking_reference_id;
//   //   const vehicleNumber = data.vehicledetails[0].vh_number;
//   //   const vehicleBrand = data.vehicledetails[0].brand;
//   //   const vehicleModel = data.vehicledetails[0].model;
//   //   const serviceAmount = data.gs_selected_amount.split(',')[0].trim();
//   //   const estimateAmount = data.estimate ? `Estimate Amount: ₹${data.estimate.estimate_amount}` : '';
//   //   const invoiceAmount = data.invoice ? `Invoice Amount: ₹${data.invoice.invoice_amount}` : '';

//   //   let message = `Hello ${customerName},\n`;
//   //   message += `Your vehicle (${vehicleBrand} ${vehicleModel}, ${vehicleNumber}) has been successfully booked for service.\n`;
//   //   message += `Booking ID: ${bookingReferenceId}\n`;

//   //   if (estimateAmount) {
//   //     message += `${estimateAmount}\n`;
//   //   }

//   //   if (invoiceAmount) {
//   //     message += `${invoiceAmount}\n`;
//   //   }
//   //   message += `Thank you for choosing our service!`;

//   //   const whatsappUrl = `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(message)}`;
//   //   window.open(whatsappUrl, '_blank');
//   //   this.LocalStoreService.whatsapp_sentupdate(data._id).subscribe(data => {

//   //     this.toastr.info('Success!', 'invoice saved successfully');
//   //     this.oninitclick()
//   //   })
//   // }
//   // sendWhatsAppMessage(data) {
//   //   if (!this.selectedUser || !this.previewMessage) return;

//   //   const mobile = this.selectedUser.customers[0]?.mobile;
//   //   if (!mobile) {
//   //     this.toastr.error('Customer mobile number is missing');
//   //     return;
//   //   }

//   //   const whatsappUrl = `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(this.previewMessage)}`;
//   //   window.open(whatsappUrl, '_blank');
//   //   this.LocalStoreService.whatsapp_sentupdate(data._id).subscribe(data => {
//   //     this.toastr.info('Success!', 'invoice saved successfully');
//   //     this.oninitclick()
//   //   })
//   // }
//   sendWhatsAppMessage(data: any) {
//     // Ensure selected user and preview message exist
//     if (!this.selectedUser || !this.previewMessage) {
//       this.toastr.error('Please select a user and ensure the message is ready');
//       return;
//     }
  
//     // Fetch the mobile number of the first customer (if available)
//     const mobile = this.selectedUser.customers[0]?.mobile;
//     if (!mobile) {
//       this.toastr.error('Customer mobile number is missing');
//       return;
//     }
  
//     // Prepare the WhatsApp message URL
//     const whatsappUrl = `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(this.previewMessage)}`;
  
//     // Open WhatsApp with the prefilled message
//     window.open(whatsappUrl, '_blank');
  
//     // Update the data in the local storage or backend after sending the message
//     this.LocalStoreService.whatsapp_sentupdate(data._id).subscribe(response => {
//       this.toastr.info('Success!', 'Invoice saved successfully');
//       this.oninitclick();  // Refresh or re-initialize actions after sending
//     });
//   }
// // Example function that calls sendWhatsAppMessage
// selectUserAndSendMessage(templateData) {
//   this.selectedTemplate = templateData;  // Set the selected template
//   this.previewMessage = this.selectedTemplate.messagetocustomer;  // Set the message
  
//   // Call sendWhatsAppMessage with necessary data
//   this.sendWhatsAppMessage(templateData);
// }
  

//   onStatusChange(event) {
//     var cursor = ''
//     console.log('Selected value:', event.value);

//   }

//   loadUserDetails(userId: string) {
//     this.selectedUser = this.totalgstreport.find(user => user._id === userId);
//     console.log('Selected User:', this.selectedUser);
//     this.getTemplateName(); // Fetch all templates
//   }

//   getTemplateName() {
//     this.LocalStoreService.getmessagetemplatedata().subscribe(data => {
//       this.messageTemplates = data;
//     });
//   }

//   openPopup() {
//     if (!this.selectedTemplateName) {
//       this.toastr.error('Please select a template');
//       return;
//     }
    
//     this.selectedTemplate = this.messageTemplates.find(template => template.name === this.selectedTemplateName);
    
//     if (this.selectedTemplate) {
//       this.showPopup = true;
//       this.previewMessage = this.selectedTemplate.messagetocustomer;
//     }
//     this.injectVariables();
//   }
  
//   injectVariables() {
//     if (!this.selectedTemplate || !this.selectedUser) return;

//     let message = this.selectedTemplate.messagetocustomer;

//     message = message.replace('@name', this.selectedUser.customers[0]?.name || 'Customer');
//     message = message.replace('@mobile', this.selectedUser.customers[0]?.mobile || 'N/A');
//     message = message.replace('@vehicleNumber', this.selectedUser.vehicledetails[0]?.vh_number || 'N/A');
//     message = message.replace('@brand', this.selectedUser.vehicledetails[0]?.brand || 'N/A');
//     message = message.replace('@model', this.selectedUser.vehicledetails[0]?.model || 'N/A');
//     message = message.replace('@estimateAmount', this.formatEstimateAmount(this.selectedUser.estimate?.estimate_amount));
//     message = message.replace('@invoiceAmount', this.formatInvoiceAmount(this.selectedUser.invoice?.invoice_amount));

//     this.previewMessage = message;
//   }

//   closePopup() {
//     this.showPopup = false;
//     this.selectedTemplate = null;
//     this.selectedTemplateName = '';
//     this.previewMessage = '';
//   }
  
//   insertVariable(variable: string) {
//     if (this.selectedTemplate && variable) {
//       this.selectedTemplate.messagetocustomer += ` ${variable}`;
//     }
//   }
//   submitForm() {
//     console.log("Saved Template:", this.selectedTemplate);
//     this.closePopup();
//   }

// }
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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

  selectedUser: any = null;
  selectedUserId: string = '';
  messageTemplates: any[] = [];
  selectedTemplate: any = null;
  selectedTemplateName: string = '';
  showPopup: boolean = false;
  previewMessage: string = '';
  customerdata: any;
  jobcarddata: any;

  constructor(private LocalStoreService: LocalStoreService, private datePipe: DatePipe, private _adapter: DateAdapter<any>, private toastr: ToastrService) {
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
    this.selectedMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = currentYear;
  }

  ngOnInit() {
    this._adapter.setLocale('en');
    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');

    this.range = new FormGroup({
      start: new FormControl(formattedDate),
      end: new FormControl(formattedDate)
    });

    this.oninitclick();
    this.fetchUsers();
    this.getcustomer();
    this.getTemplateName();
    this.loadUserDetails(this.selectedUserId);
    
  }
  fetchUsers(){
    let status = "datewise_totalgst_vi-report";
    this.LocalStoreService.get_data_forwhatsappscreen(this.selectedYearMonth,status).subscribe(data => {
      this.totalgstreport = data.response.filter(user=> user._id && user.customers[0]?.mobile);
      console.log("Users:", this.totalgstreport);
    })
  }

  getMonthName(month: number): string {
    return new Date(0, month - 1).toLocaleString('en', { month: 'short' });
  }

  onSelectionChange(type: string) {
    let total_estimateamount = 0;
    let total_invoiceamount = 0;
    if (type === 'year') {
      console.log('Selected Year:', this.selectedYear);
    } else if (type === 'month') {
      console.log('Selected Month:', this.selectedMonth);
    }

    if (this.selectedYear && this.selectedMonth) {
      var status = "rangewise_totalgst_vi-report";

      this.selectedYearMonth = `${this.selectedYear}-${this.selectedMonth}`;
      this.LocalStoreService.get_data_forwhatsappscreen(this.selectedYearMonth, status).subscribe(data => {
        this.total_vehicle = data.response.length;
        this.totalgstreport = data.response;
        this.totalgstreport.forEach(report => {
          if (report.estimate && !report.invoice) {
            total_estimateamount += parseFloat(report.estimate.estimate_amount);
          }
          if (report.invoice) {
            total_invoiceamount += parseFloat(report.invoice.invoice_amount);
          }
        });
        this.estimatetotal = total_estimateamount;
        this.invoicetotal = total_invoiceamount.toFixed(2);
      });
    }
  }

  oninitclick() {
    let total_estimateamount = 0;
    let total_invoiceamount = 0;

    var startdate = this.datePipe.transform(this.onintdate, 'yyyy-MM-dd');
    var status = "datewise_totalgst_vi-report";
    this.LocalStoreService.get_data_forwhatsappscreen(this.selectedYearMonth, status).subscribe(data => {
      this.total_vehicle = data.response.length;

      this.totalgstreport = data.response;

      this.totalgstreport.forEach(report => {
        if (report.estimate && !report.invoice) {
          total_estimateamount += parseFloat(report.estimate.estimate_amount);
        }

        if (report.invoice) {
          total_invoiceamount += parseFloat(report.invoice.invoice_amount);
        }
      });
      this.estimatetotal = total_estimateamount;
      this.invoicetotal = total_invoiceamount.toFixed(2);
    });
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

  sendWhatsAppMessage() {
    if (!this.selectedUser || !this.selectedTemplate) {
      this.toastr.error('Invalid user or template');
      return;
    }

    const mobile = this.selectedUser.customers[0]?.mobile;
    if (!mobile) {
      this.toastr.error('Customer mobile number is missing');
      return;
    }

    const message = this.previewMessage;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    this.LocalStoreService.whatsapp_sentupdate(this.selectedUser._id).subscribe(() => {
      this.toastr.info('Message sent successfully');
    });

    this.closePopup();
  }
  loadUserDetails(userId: string) {
    if (!this.totalgstreport || !Array.isArray(this.totalgstreport)) {
      console.log("Error: totalgstreport is not available or not an array");
      return;
    }
  
    this.selectedUser = this.totalgstreport.find((user) =>{
      user._id === userId
      console.log("this is user", user._id);
    });
  
    if (!this.selectedUser) {
      console.error(`Error: No user found with ID ${userId}`);
      return;
    }
  
    console.log("Selected User:", this.selectedUser._id);
    console.log("jobcard user id:", this.jobcarddata.userid);
  
    if (this.selectedUser._id === this.jobcarddata.userid) {
      console.log("Complaints Data:", this.jobcarddata.complaints);
      let complaints = this.jobcarddata.complaints.forEach(complaint=>complaint.complaint);
      console.log("Complaints Data:", complaints);
    } else {
      console.warn("No complaints data found for the selected user.");
    }
  
    this.getTemplateName();
  }
  

  getcustomer(){
    this.LocalStoreService.getcustomerdata().subscribe(data => {
      this.customerdata = data.customerdata;
      this.jobcarddata = data.jobcarddata;
      if (this.jobcarddata.userid) {
        console.log("Complaints Data:", this.jobcarddata.complaints);
        let complaints = this.jobcarddata.complaints.forEach(complaint=>complaint.complaint);
        console.log("Complaints Data:", complaints);
      }
      console.log("Data Loaded:", this.customerdata, this.jobcarddata);
      this.updatePreview();
    })
  }
  getTemplateName() {
    this.LocalStoreService.getmessagetemplatedata().subscribe(data => {
      this.messageTemplates = data;
      this.updatePreview();
    });
  }

  openPopup(user: any) {
    this.selectedUser = user;
    const selectedTemplate = this.messageTemplates.find(t => t.name === user.selectedTemplateName);
  
    if (!selectedTemplate) {
      this.toastr.error('Please select a template first');
      return;
    }
  
    this.selectedTemplate = { ...selectedTemplate };
    this.updatePreview();
    this.showPopup = true;
  }
  
  updatePreview() {
    if (!this.selectedUser || !this.selectedTemplate) {
      console.warn("No user or template selected");
      return;
    }
  
    this.previewMessage = this.injectVariables(this.selectedUser, this.selectedTemplate.messagetocustomer);
  }
  
  injectVariables(user: any, message: string): string {
    let complaintList = '';
    console.log("this is user", user._id);
    console.log("this is jobcard user id", this.jobcarddata.userid);

  // Ensure jobcarddata and complaints exist
  if ((this.jobcarddata.userid === this.selectedUser._id)) {
    complaintList = this.jobcarddata.complaints
      .map(complaint => {
        return Object.values(complaint)[1]; // Extracting second property (adjust if needed)
      })
      .join(", ");
      console.log("this is complaintList", complaintList);
  }
    return message
      .replace(/@name/g, user.customers?.[0]?.name || '[Customer]')
      .replace(/@mobile/g, user.customers?.[0]?.mobile || '[Mobile]')
      .replace(/@vehicle_number/g, user.vehicledetails?.[0]?.vh_number || '[Vehicle No]')
      .replace(/@brand/g, user.vehicledetails?.[0]?.brand || '[Brand]')
      .replace(/@model/g, user.vehicledetails?.[0]?.model || '[Model]')
      .replace(/@estimate/g, user.estimate?.estimate_amount || '[Estimate]')
      .replace(/@invoice/g, user.estimate?.estimate_amount || '[Invoice]')
      .replace(/@complaints/g, complaintList || '[Complaints]')
      .replace(/@gsp/g, user.gs_selected_amount?.slice(0, -5) || '[GSP]');
  }
  
  
  insertVariable(variable: string) {
    if (!variable || !this.selectedTemplate.messagetocustomer) return;
    this.selectedTemplate.messagetocustomer += ` ${variable}`;
    this.updatePreview();
  }

  closePopup() {
    this.showPopup = false;
    this.selectedTemplate = null;
    this.selectedTemplateName = '';
    this.previewMessage = '';
    // this.messageTemplates = [];
  }

  // insertVariable(variable: string) {
  //   if (this.selectedTemplate && variable) {
  //     this.selectedTemplate.messagetocustomer += ` ${variable}`;
  //   }
  // }

  submitForm() {
    this.closePopup();
  }
}

