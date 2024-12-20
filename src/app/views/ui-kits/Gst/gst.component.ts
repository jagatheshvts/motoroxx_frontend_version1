import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.scss'],
  providers: [DatePipe]

})
export class GstComponent implements OnInit {


  
  selectedYearMonth: string;

  yearMonths: string[] = [];
  dailyreportdata: any;
  estimatetotal: number;
  invoicetotal: number;
  taxableamount: any;
  dialogref: any;
  updatedbookingid: any;
  total_vehicle: any;
  allspares: any;

  constructor(private LocalStoreService: LocalStoreService,private dialog: MatDialog,private datePipe: DatePipe) {

    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 10; year--) {
      for (let month = 1; month <= 12; month++) {
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        this.yearMonths.push(`${year}-${formattedMonth}`);
      }
    }

    // Set default value
    this.selectedYearMonth = `${currentYear}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
   }


  ngOnInit() {

    this.oninitclick()

  }


  onYearMonthChange() {

    let total_estimateamount = 0
    let total_invoiceamount = 0
    let status ="3"

    this.LocalStoreService.get_dayilreport(this.selectedYearMonth,status).subscribe(data => {

      console.log("entered ,,,,1")
    this.dailyreportdata = data.response

    this.total_vehicle = data.response.length

  console.log("the data of the total vehicle",this.total_vehicle)
    
    this.dailyreportdata.forEach(report=>{

      if(report.estimate && !report.invoice){
      
      total_estimateamount += parseFloat(report.estimate.estimate_amount)

      }

      if(report.invoice){

        total_invoiceamount += parseFloat(report.invoice.invoice_amount)
      }
    })
    this.estimatetotal = total_estimateamount
    this.invoicetotal = total_invoiceamount
      console.log("the data inside the getdaily report",data)

    })


  }

oninitclick(){

  console.log("entered ,,,,1")
  let total_estimateamount = 0
  let total_invoiceamount = 0
  let total_taxableamount = 0

  let status ="3"

  this.LocalStoreService.get_dayilreport(this.selectedYearMonth,status).subscribe(data => {
  this.dailyreportdata = data.response

  this.total_vehicle = data.response.length

  console.log("the data of the total vehicle",this.total_vehicle)

  
  this.dailyreportdata.forEach(report=>{

    if(report.estimate && !report.invoice){

    total_estimateamount += parseFloat(report.estimate.estimate_amount)

    }

    if(report.invoice){

      total_invoiceamount += parseFloat(report.invoice.invoice_amount)

      total_taxableamount += parseFloat(
            (report.invoice.invoice_amount - report.invoice.fullspares_with_18_total - report.invoice.fullspares_with_28_total -
              report.invoice.fulllabours_with_18_total - report.invoice.fulllabours_with_28_total).toString()
          );
    }
    
  })
  this.estimatetotal = total_estimateamount
  this.invoicetotal = total_invoiceamount
  this.taxableamount = (total_taxableamount).toFixed(2)
    console.log("the data inside the getdaily report",data)

  })



}  

editbookingid(bookingideditpage,bookjobid,reference){


 this.editbook(bookjobid,reference)
    this.dialogref = this.dialog.open(bookingideditpage, {
    });
}

editbook(bookjobid,reference){

  console.log("the updated bookingid", reference )
  
  // return
  // this.LocalStoreService.editbookjobid(bookjobid,this.updatedbookingid).subscribe(data=>{

  

  // })

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





mothlydataexcel() {
  let status = "3";

  let finaltax ;
  let finalfor18;
  let finalfor28
  let alltaxablevalue18spare =0
 
  this.LocalStoreService.get_dayilreport(this.selectedYearMonth, status).subscribe(data => {
    var afteroct_customers = [];

    data.response.forEach(customerData => {
      let customer = customerData.customers[0]; 
      let vehicleDetails = customerData.vehicledetails[0]; 
      let vehiclebrand = vehicleDetails.brand;
      let vehiclemodel = vehicleDetails.model;
      let vehicledata = vehicleDetails.vh_number;
      let invoicedata = customerData.invoice ? customerData.invoice.invoice_amount : "Not Invoiced";


       var packagedatafinaltax = "0";
      if(customerData.invoice.package){
          
        packagedatafinaltax = customerData.invoice.package_totalwithoutgst

      }


        finaltax = customerData.invoice ? (parseFloat(customerData.invoice.fullspares_totalwithoutgst) + parseFloat(customerData.invoice.fulllabours_totalwithoutgst) +
        parseFloat(packagedatafinaltax)).toFixed(2)  :"Not Invoiced" ; 


      var packagedata = "0";
      if(customerData.invoice.package_with_18_total){

        packagedata = customerData.invoice.package_with_18_total

      }
      finalfor18 = customerData.invoice ?parseFloat(customerData.invoice.fullspares_with_18_total) +
      parseFloat(customerData.invoice.fulllabours_with_18_total) + parseFloat(packagedata) :"Not Invoiced" ; 

      console.log("the data of the finalfor18__________",packagedata)

    
      finalfor28 =customerData.invoice ? invoicedata - customerData.invoice.fullspares_with_28_total:"Not Invoiced" ;

        
      if (customerData.invoice && customerData.invoice.fullspares_totalwithoutgst && customerData.invoice.fulllabours_totalwithoutgst) {
        const sparesTotal = parseFloat(customerData.invoice.fullspares_totalwithoutgst);
        const laboursTotal = parseFloat(customerData.invoice.fulllabours_totalwithoutgst);
      
      
      }
     

      

      if (customerData.invoice ) {
        let formattedDate = this.datePipe.transform(customerData.createddate, 'dd-MM-yyyy');
        let allinvoice = customerData.invoice
        let formateinvoicedate = this.datePipe.transform(allinvoice.date, 'dd-MM-yyyy');


        if(customerData.invoice.package){
          customerData.invoice.package.forEach(data=>{
            data.amount = (data.amount + parseFloat(data.taxablevalue))
          })
        }
        if(customerData.invoice.package){
          customerData.invoice.package.forEach(packageItem=>{
            customerData.invoice.all_spares.push(packageItem);
          }) 
        }

        if(customerData.invoice.package){
          customerData.invoice.all_labours.forEach(data=>{
            data.amount = (data.amount + parseFloat(data.taxablevalue))
          })
        }
       

        let all_spares = customerData.invoice.all_spares;
        let all_labours = customerData.invoice.all_labours;
        let maxLength = Math.max(all_spares.length, all_labours.length);
        let totalSpareAmount = 0;

        for (let index = 0; index < maxLength; index++) {
          let invspare = all_spares[index];
          let invlabour = all_labours[index];

          if (invspare && invlabour) {
            const cgstRate = 9;
            let spareObj = {
              "Created Date": index === 0 ? formattedDate : "",
              "Invoice Date" : index === 0 ? formateinvoicedate: "",
              "Invoice No" : index === 0 ? customerData.invoice.invoice_reference_number: "",
              "Name": index === 0 ? customer.name : "",
              "Mobile": index === 0 ? customer.mobile : "",
              "Brand": index === 0 ? vehiclebrand : "",
              "Model": index === 0 ? vehiclemodel : "",
              "Vehicle Number": index === 0 ? vehicledata : "",
              "Spare": invspare.spare,
              "Qty": invspare.qty,
              "Rate": invspare.rate,
              "Amount": invspare.amount,
              "TaxAmount":invspare.payableamount,
              "GST%": invspare.gst18 || invspare.gst== "18 %" ? "18%" : "28%",
              "CGST9%":invspare.gst18 || invspare.gst== "18 %" ? ((invspare.spares_with_18)/2).toFixed(2) : "0",
              "SGST9%":invspare.gst18 || invspare.gst== "18 %" ? ((invspare.spares_with_18)/2).toFixed(2) : "0",
              "CGST14%":invspare.gst28 || invspare.gst== "28 %" ? ((invspare.spares_with_28)/2).toFixed(2) : "0",
              "SGST14%":invspare.gst28 || invspare.gst== "28 %" ? ((invspare.spares_with_28)/2).toFixed(2) : "0",


            };

            afteroct_customers.push(spareObj);

          }

          

          if (invlabour && invspare) {
            let labourObj = {
              "Created Date":"",
              "Invoice Date":"",
              "Invoice No":"",
              "Name": "",
              "Mobile": "",
              "Brand":  "",
              "Model": "",
              "Vehicle Number":  "",
              "Spare": invlabour.name,
              "Qty": invlabour.qty,
              "Rate": invlabour.rate,
              "Amount": invlabour.amount,
              "TaxAmount":invlabour.payableamount,
              "GST%": invlabour.gst18 || invlabour.gst ? "18%" : "28%",
              "CGST9%":invlabour.gst18 || invlabour.gst== "18 %" ? ((invlabour.labour_with_18)/2).toFixed(2) : "0",
              "SGST9%":invlabour.gst18 || invlabour.gst== "18 %" ? ((invlabour.labour_with_18)/2).toFixed(2) : "0",
              "CGST14%":invlabour.gst28 || invlabour.gst== "28 %" ? ((invlabour.labour_with_28)/2).toFixed(2) : "0",
              "SGST14%":invlabour.gst28 || invlabour.gst== "28 %" ? ((invlabour.labour_with_28)/2).toFixed(2) : "0",

            };

            afteroct_customers.push(labourObj);
           
          }

          if(invlabour && !invspare ){

            let labourObjs = {
              "Created Date":index === 0 ? formattedDate : "",
              "Invoice Date" : index === 0 ? formateinvoicedate: "",
              "Invoice No" : index === 0 ? customerData.invoice.invoice_reference_number: "",

              "Name":index === 0 ? customer.name : "",
              "Mobile":index === 0 ? customer.mobile : "",
              "Brand": index === 0 ? vehiclebrand : "",
              "Model": index === 0 ? vehiclemodel : "",
              "Vehicle Number":  index === 0 ? vehicledata : "",
              "Spare": invlabour.name,
              "Qty": invlabour.qty,
              "Rate": invlabour.rate,
              "Amount": invlabour.amount,
              "TaxAmount":invlabour.payableamount,
              "GST%": invlabour.gst18 || invlabour.gst ? "18%" : "28%",
              "CGST9%":invlabour.gst18 || invlabour.gst== "18 %" ? ((invlabour.labour_with_18)/2).toFixed(2) : "0",
              "SGST9%":invlabour.gst18 || invlabour.gst== "18 %" ? ((invlabour.labour_with_18)/2).toFixed(2) : "0",
              "CGST14%":invlabour.gst28 || invlabour.gst== "28 %" ? ((invlabour.labour_with_28)/2).toFixed(2) : "0",
              "SGST14%":invlabour.gst28 || invlabour.gst== "28 %" ? ((invlabour.labour_with_28)/2).toFixed(2) : "0",

            };

            afteroct_customers.push(labourObjs);

            
          }

          if (invspare && !invlabour) {
            const cgstRate = 9;
            let spareObj = {
              "Created Date": index === 0 ? formattedDate : "",
              "Invoice Date" : index === 0 ? formateinvoicedate: "",
              "Invoice No" : index === 0 ? customerData.invoice.invoice_reference_number: "",

              "Name": index === 0 ? customer.name : "",
              "Mobile": index === 0 ? customer.mobile : "",
              "Brand": index === 0 ? vehiclebrand : "",
              "Model": index === 0 ? vehiclemodel : "",
              "Vehicle Number": index === 0 ? vehicledata : "",
              "Spare": invspare.spare,
              "Qty": invspare.qty, 
              "Rate": invspare.rate,
              "Amount": invspare.amount,
              "TaxAmount":invspare.payableamount,
              "GST%": invspare.gst18 || invspare.gst== "18 %" ? "18%" : "28%",
              "CGST9%":invspare.gst18 || invspare.gst== "18 %" ? ((invspare.spares_with_18)/2).toFixed(2) : "0",
              "SGST9%":invspare.gst18 || invspare.gst== "18 %" ? ((invspare.spares_with_18)/2).toFixed(2) : "0",
              "CGST14%":invspare.gst28 || invspare.gst== "28 %" ? ((invspare.spares_with_28)/2).toFixed(2) : "0",
              "SGST14%":invspare.gst28 || invspare.gst== "28 %" ? ((invspare.spares_with_28)/2).toFixed(2) : "0",


            };

            afteroct_customers.push(spareObj);
            
           
          }
        }

        let totalObj = {
          "Created Date": "",
          "Invoice Date" : "",
          "Invoice No" : "",
          "Name": "",
          "Mobile": "",
          "Brand": "",
          "Model": "",
          "Vehicle Number": "",
          "Spare": "",
          "Qty": "",
          "Rate": "",
          "Amount": "",
          "TaxAmount":"",
          "GST%":"" ,
          "CGST9%":"",
          "SGST9%":"",
          "CGST14%":"",
          "SGST14%":"",
        };

        afteroct_customers.push(totalObj);

        

         totalObj = {
          "Created Date": "",
          "Invoice Date" : "",
          "Invoice No" : "",

          "Name": "",
          "Mobile": "",
          "Brand": "",
          "Model": "",
          "Vehicle Number": "",
          "Spare": "",
          "Qty": "Total",
          "Rate": "",
          "Amount": invoicedata, 
          "TaxAmount": finaltax,
          "GST%":"",
          "CGST9%":((finalfor18)/2).toFixed(2),
          "SGST9%":((finalfor18)/2).toFixed(2),
          "CGST14%":((invoicedata-finalfor28)/2).toFixed(2),
          "SGST14%":((invoicedata-finalfor28)/2).toFixed(2),
          
        };
        afteroct_customers.push(totalObj);

        totalObj = {
          "Created Date": "",
          "Invoice Date" : "",
          "Invoice No" : "",

          "Name": "",
          "Mobile": "",
          "Brand": "",
          "Model": "",
          "Vehicle Number": "",
          "Spare": "",
          "Qty": "",
          "Rate": "",
          "Amount": "",
          "TaxAmount":"",
          "GST%":"" ,
          "CGST9%":"",
          "SGST9%":"",
          "CGST14%":"",
          "SGST14%":"",
        };

        afteroct_customers.push(totalObj);

      }
      
      else {
        let formattedDate = this.datePipe.transform(customerData.createddate, 'dd-MM-yyyy');



        let obj = {
          "Created Date": formattedDate,
          "Name": customer.name,
          "Mobile": customer.mobile,
          "Brand": vehiclebrand,
          "Model": vehiclemodel,
          "Vehicle Number": vehicledata,
          "Spare": "",
          "Qty": "",
          "Rate": "", 
          "Amount": "",
          "Taxable Amount":"",
          "GST%":"",
          "CGST9%":"",
          "SGST9%":"",
          "CGST14%":"",
          "SGST14%":"",
        };
        afteroct_customers.push(obj);

       
      }
    });

    var finame = "Customer ";
    this.LocalStoreService.exportAsExcelFile_task(afteroct_customers, finame);
  });
}



fortest_estimatespareexcel(){
  let status = "4";
  let finaltax ;
  let finalfor18;
  let finalfor28
  let alltaxablevalue18spare =0
 
  this.LocalStoreService.get_dayilreport(this.selectedYearMonth, status).subscribe(data => {
    var afteroct_customers = [];
    data.response.forEach(customerData => {
      let customer = customerData.customers[0]; 
      let vehicleDetails = customerData.vehicledetails[0]; 
      let vehiclebrand = vehicleDetails.brand;
      let vehiclemodel = vehicleDetails.model;
      let vehicledata = vehicleDetails.vh_number;
      let estimatedata = customerData.estimate ? customerData.estimate.estimate_amount : "Not estimated";

   

      if (customerData.estimate ) {
        let formattedDate = this.datePipe.transform(customerData.createddate, 'dd-MM-yyyy');
        let allestimate = customerData.estimate
        let formateestimatedate = this.datePipe.transform(allestimate.date, 'dd-MM-yyyy');

        let all_spares = customerData.estimate.all_spares;
        let all_labours = customerData.estimate.all_labours;
        let maxLength = Math.max(all_spares.length, all_labours.length);
        let totalSpareAmount = 0;

        for (let index = 0; index < maxLength; index++) {
          let estispare = all_spares[index];
          let estilabour = all_labours[index];

          if (estispare && estilabour) {
            const cgstRate = 9;
            let spareObj = {
              "Created Date": index === 0 ? formattedDate : "",
              "Invoice Date" : index === 0 ? formateestimatedate: "",
              "Name": index === 0 ? customer.name : "",
              "Mobile": index === 0 ? customer.mobile : "",
              "Brand": index === 0 ? vehiclebrand : "",
              "Model": index === 0 ? vehiclemodel : "",
              "Vehicle Number": index === 0 ? vehicledata : "",
              "Spare": estispare.spare,
              "Qty": estispare.qty,
              "Rate": estispare.rate,
              "Amount": estispare.amount,
              

            };

            afteroct_customers.push(spareObj);

          }

          if (estilabour && estispare) {
            let labourObj = {
              "Created Date":"",
              "Invoice Date":"",
              "Name": "",
              "Mobile": "",
              "Brand":  "",
              "Model": "",
              "Vehicle Number":  "",
              "Spare": estilabour.name,
              "Qty": estilabour.qty,
              "Rate": estilabour.rate,
              "Amount": estilabour.amount,
              

            };

            afteroct_customers.push(labourObj);
           
          }

          if(estilabour && !estispare ){

            let labourObjs = {
              "Created Date":index === 0 ? formattedDate : "",
              "Invoice Date" : index === 0 ? formateestimatedate: "",

              "Name":index === 0 ? customer.name : "",
              "Mobile":index === 0 ? customer.mobile : "",
              "Brand": index === 0 ? vehiclebrand : "",
              "Model": index === 0 ? vehiclemodel : "",
              "Vehicle Number":  index === 0 ? vehicledata : "",
              "Spare": estilabour.name,
              "Qty": estilabour.qty,
              "Rate": estilabour.rate,
              "Amount": estilabour.amount,
              

            };

            afteroct_customers.push(labourObjs);
            
          }

          if (estispare && !estilabour) {
            const cgstRate = 9;
            let spareObj = {
              "Created Date": index === 0 ? formattedDate : "",
              "Invoice Date" : index === 0 ? formateestimatedate: "",
              "Name": index === 0 ? customer.name : "",
              "Mobile": index === 0 ? customer.mobile : "",
              "Brand": index === 0 ? vehiclebrand : "",
              "Model": index === 0 ? vehiclemodel : "",
              "Vehicle Number": index === 0 ? vehicledata : "",
              "Spare": estispare.spare,
              "Qty": estispare.qty,
              "Rate": estispare.rate,
              "Amount": estispare.amount,
             
            };
            afteroct_customers.push(spareObj);
          }
        }

        let totalObj = {
          "Created Date": "",
          "Invoice Date" : "",
          "Name": "",
          "Mobile": "",
          "Brand": "",
          "Model": "",
          "Vehicle Number": "",
          "Spare": "",
          "Qty": "",
          "Rate": "",
          "Amount": "",
          
        };

        afteroct_customers.push(totalObj);
         totalObj = {
          "Created Date": "",
          "Invoice Date" : "",

          "Name": "",
          "Mobile": "",
          "Brand": "",
          "Model": "",
          "Vehicle Number": "",
          "Spare": "",
          "Qty": "Total",
          "Rate": "",
          "Amount": estimatedata, 
         
        };
        afteroct_customers.push(totalObj);
        totalObj = {
          "Created Date": "",
          "Invoice Date" : "",
          "Name": "",
          "Mobile": "",
          "Brand": "",
          "Model": "",
          "Vehicle Number": "",
          "Spare": "",
          "Qty": "",
          "Rate": "",
          "Amount": "",
          
        };

        afteroct_customers.push(totalObj);
      }
      
      else {
        let formattedDate = this.datePipe.transform(customerData.createddate, 'dd-MM-yyyy');
        let obj = {
          "Created Date": formattedDate,
          "Name": customer.name,
          "Mobile": customer.mobile,
          "Brand": vehiclebrand,
          "Model": vehiclemodel,
          "Vehicle Number": vehicledata,
          "Spare": "",
          "Qty": "",
          "Rate": "",
          "Amount": "",
         
        };
        afteroct_customers.push(obj);
      }
    });
    // Export to Excel
    var finame = "Customer ";
    this.LocalStoreService.esportestspareexcel(afteroct_customers, finame);
  });
}


  

}
