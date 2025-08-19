import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-message-alerts-templates',
  templateUrl: './message-alerts-templates.component.html',
  styleUrls: ['./message-alerts-templates.component.scss']
})
export class MessageAlertsTemplatesComponent implements OnInit {
  description: string = '';
  messagetocustomer: string = '';
  formattedMessage: string = '';
  selectedVariable: string = '';
  availableVariables: string[] = [
    '@name', '@mobile', '@address', '@complaints', '@vehicle_number', '@brand', '@model', '@estimate', '@invoice', '@gsp'
  ];

  @ViewChild('messageInput') messageInput: ElementRef;
  customersdata: any;
  vehicledata: any;
  jobcarddata: any;
  template: any []= [] ;
  customers: any[] = [];  
  name: any;

  constructor(private localservice: LocalStoreService) {}

  ngOnInit() {
    this.getcustomers();
  }

  getcustomers() {
    this.localservice.getcustomerdata().subscribe(data => {
      console.log("this is data", data);
      this.customersdata = data.customerdata;
      this.vehicledata = data.vehicledata;
      this.jobcarddata = data.jobcarddata;
      console.log("Data Loaded:", this.customersdata, this.vehicledata, this.jobcarddata);
      this.customers = this.customersdata || []; 
    });
  }

  insertVariable(variable: string) {
    if (!this.messageInput || !this.messageInput.nativeElement) {
      console.warn("Textarea not found yet!");
      return;
    }

    const inputElement = this.messageInput.nativeElement;
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    const text = this.messagetocustomer;

    this.messagetocustomer = text.slice(0, start) + variable + text.slice(end);

    setTimeout(() => {
      inputElement.selectionStart = inputElement.selectionEnd = start + variable.length;
      inputElement.focus();
    }, 0);

    this.updatePreview();
  }

  updatePreview() {
    let message = this.messagetocustomer || '';
  
    if (this.customersdata) {
      const customer = this.customersdata;
      message = message
        .replace(/@name/g, customer.name || '[Name]')
        .replace(/@mobile/g, customer.mobile || '[Mobile]')
        .replace(/@address/g, customer.address || '[Address]');
    }
  
    if (this.vehicledata) {
      const vehicle = this.vehicledata;
      message = message
        .replace(/@vehicle_number/g, vehicle.vh_number || '[Vehicle No]')
        .replace(/@brand/g, vehicle.brand || '[Brand]')
        .replace(/@model/g, vehicle.model || '[Model]');
    }
   
    if (this.jobcarddata && this.jobcarddata.complaints) {
      const jobcard = this.jobcarddata;
      
      const complaintList = jobcard.complaints.map(complaint => {
        return Object.values(complaint)[1];
      }).join(", ");
      const generalservice = jobcard.generalservice
      if(generalservice=== "0" || generalservice === ""){
        console.log("no general service")
      }
        let gsp = jobcard.gs_selected_amount.slice(0,-5);
        console.log("gsp",gsp)
      message = message.replace(/@estimate/g,jobcard.estimate.estimate_amount || '[Estimate]')
      message = message.replace(/@invoice/g, jobcard.invoice.invoice_amount || '[Invoice]')
      message = message.replace(/@complaints/g, complaintList || '[Complaints]')
      message = message.replace(/@gsp/g, gsp || '[GSP]');
    }
  
    this.formattedMessage = message;
  }

  
resetform(){
  this.messagetocustomer = '';
  this.formattedMessage = '';
  this.customers = [];
  this.template = [];
}
submitForm() {
  const template = {
    name: this.template,
    messagetocustomer: this.messagetocustomer,
    availableVariables: this.availableVariables
  };

  const payload = {
    templates: [template],
    customers: this.customers || []
  };

  console.log("Form Value:", payload);

  this.localservice.savemessagealerts(payload).subscribe(
    response => {
      console.log("API Response:", response);
      alert(response.message);
      this.resetform();
    },
    error => {
      console.error("Error:", error);
      alert("Failed to save message alert");
    }
  );
}



  
}