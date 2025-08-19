import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { LocalStoreService } from 'src/app/shared/services/local-store.service'; 
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-hsn-report',
  // standalone: true,
  // imports: [],
  templateUrl: './hsn-report.component.html',
  styleUrl: './hsn-report.component.scss',
  providers: [DatePipe]
})
export class HsnReportComponent implements OnInit {

  onintdate: Date = new Date();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  // hsnReportData: { hsn: string; qty: number; amount: number; invoices: Set<string>; }[];
hsnReportData: { withGst: any[]; withoutGst: any[] } = {
  withGst: [],
  withoutGst: []
};

  hsn_reportarray: any;
  totalAmount: number;
  totalCGST: number;
  totalSGST: number;
  totalTaxableValue: number;
  totalIGST: number;


  constructor(private LocalStoreService: LocalStoreService,private dialog: MatDialog, private datePipe: DatePipe,private _adapter: DateAdapter<any>,private model: NgbModal) { }
  ngOnInit(): void {

    this._adapter.setLocale('en'); 
    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.range = new FormGroup({
      start: new FormControl(formattedDate),
      end: new FormControl(formattedDate) 
    });

    this. oninit_click()
    
  }

  oninit_click(){
    var startdate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')
     var flags = "single"
    this.LocalStoreService.hsn_report(startdate,startdate,flags).subscribe(data=>{


      this.processHSNReport(data.response);

    })
  }


  onDatepickerClosed(): void {
    this.hsn_reportarray = []
    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
    if(startdate === enddate ){
      var flag = "single"
      this.LocalStoreService.hsn_report(startdate,enddate,flag).subscribe(data=>{
        this.processHSNReport(data.response);
       
      })
    }else {
      var flag = "range"
      this.LocalStoreService.hsn_report(startdate,enddate,flag).subscribe(data=>{

        console.log("the data inside the fullreport",data)
        this.processHSNReport(data.response);
     
      })
    }
  }

  hsn_totals:any
 processHSNReport(response) {
  console.log("the data inside the response hsn report", response);

  let hsnSummaryWithGst = {};
  let hsnSummaryWithoutGst = {};

  let totalWith = { amount: 0, taxable: 0, cgst: 0, sgst: 0, igst: 0 };
  let totalWithout = { amount: 0, taxable: 0, cgst: 0, sgst: 0, igst: 0 };

  const processItems = (items, gstNumber, itemType, summary, total) => {
    items.forEach(item => {
      let hsnCode = item.HSN ? item.HSN.trim() : null;
      if (!hsnCode) return;

      let gst = parseFloat(item.gst || 0).toFixed(2);
      let uniqueKey = `${hsnCode}-${gst}`;
      let qty = parseFloat(item.qty || 0);
      let baseAmount = parseFloat(item.amount || 0);
      let taxableValue = parseFloat(item.rate_tax_value || 0);
      let payableamount = parseFloat(item.payableamount || 0);

      let amount = (itemType === 'service_spares' || itemType === 'all_labours')
        ? baseAmount + taxableValue
        : baseAmount;

      let cgst = (amount - payableamount) / 2;
      let sgst = (amount - payableamount) / 2;
      let igst = 0;

      gst = `${parseFloat(gst)}%`;

      if (!summary[uniqueKey]) {
        summary[uniqueKey] = {
          HSN: hsnCode,
          GST: gst,
          QTY: 0,
          AMOUNT: 0,
          Taxable_Value: 0,
          CGST: 0,
          SGST: 0,
          IGST: 0
        };
      }

      summary[uniqueKey].QTY += qty;
      summary[uniqueKey].AMOUNT += amount;
      summary[uniqueKey].Taxable_Value += payableamount;
      summary[uniqueKey].CGST += cgst;
      summary[uniqueKey].SGST += sgst;
      summary[uniqueKey].IGST += igst;

      total.amount += amount;
      total.taxable += payableamount;
      total.cgst += cgst;
      total.sgst += sgst;
      total.igst += igst;
    });
  };

  response.forEach(entry => {
    const gstNumber = entry.customers?.[0]?.gst_number || null;
    const invoice = entry.invoice || {};

    if (invoice.all_spares)
      processItems(invoice.all_spares, gstNumber, 'all_spares',
        gstNumber ? hsnSummaryWithGst : hsnSummaryWithoutGst,
        gstNumber ? totalWith : totalWithout);

    if (invoice.service_spares)
      processItems(invoice.service_spares, gstNumber, 'service_spares',
        gstNumber ? hsnSummaryWithGst : hsnSummaryWithoutGst,
        gstNumber ? totalWith : totalWithout);

    if (invoice.all_labours)
      processItems(invoice.all_labours, gstNumber, 'all_labours',
        gstNumber ? hsnSummaryWithGst : hsnSummaryWithoutGst,
        gstNumber ? totalWith : totalWithout);
  });

  // Store for Excel export
  this.hsn_reportarray = {
    withGst: Object.values(hsnSummaryWithGst),
    withoutGst: Object.values(hsnSummaryWithoutGst)
  };

  this.hsn_totals = {
    with: totalWith,
    without: totalWithout
  };

   this.totalAmount = this.hsn_totals.with.amount + this.hsn_totals.without.amount,
    this.totalTaxableValue = this.hsn_totals.with.taxable + this.hsn_totals.without.taxable,

  console.log("HSN Report Prepared:", this.hsn_reportarray);
}



//   processHSNReport_orginal(response) {

//     console.log("the data inside the response hsn report",response)
//   this.hsn_reportarray = [];
//   let hsnSummary = {};

//   let totalAmount = 0;
//   let totalCGST = 0;
//   let totalSGST = 0;
//   let totalIGST = 0;
//   let totalTaxableValue = 0;

//   const processItems = (items, jobCardNumber, invoiceNumber, itemType) => {
//     items.forEach(item => {
//       let hsnCode = item.HSN ? item.HSN.trim() : null;
//       if (!hsnCode) return;

//       let gst = parseFloat(item.gst || 0).toFixed(2); 
//       let uniqueKey = `${hsnCode}-${gst}`;

//       let qty = parseFloat(item.qty || 0);
//       let baseAmount = parseFloat(item.amount || 0);
//       let taxableValue = parseFloat(item.rate_tax_value || 0);
//       let payableamount = parseFloat(item.payableamount || 0);

//       let amount = (itemType === 'service_spares' || itemType === 'all_labours')
//         ? baseAmount + taxableValue
//         : baseAmount;

//       let cgstcalculation = (amount - payableamount) / 2;
//       let igst = 0;

//       gst= `${parseFloat(gst)}%`


//       if (!hsnSummary[uniqueKey]) {
//         hsnSummary[uniqueKey] = {
//           HSN: hsnCode,
//           GST: gst,
//           QTY: 0,
//           AMOUNT: 0,
//           Taxable_Value: 0,
//           CGST: 0,
//           SGST: 0,
//           IGST: 0
//         };
//       }

//       hsnSummary[uniqueKey].QTY += qty;
//       hsnSummary[uniqueKey].AMOUNT += amount;
//       hsnSummary[uniqueKey].Taxable_Value += payableamount;
//       hsnSummary[uniqueKey].CGST += cgstcalculation;
//       hsnSummary[uniqueKey].SGST += cgstcalculation;
//       hsnSummary[uniqueKey].IGST += igst;

//       totalAmount += amount;
//       totalCGST += cgstcalculation;
//       totalSGST += cgstcalculation;
//       totalIGST += igst;
//       totalTaxableValue += payableamount;
//     });
//   };

//   response.forEach(entry => {
//     let jobCardNumber = entry.invoice.job_card_number;
//     let invoiceNumber = entry.invoice.invoice_reference_number;
//     console.log("Invoice Number:", invoiceNumber);

//     if (entry.invoice.all_spares)
//       processItems(entry.invoice.all_spares, jobCardNumber, invoiceNumber, 'all_spares');

//     if (entry.invoice.service_spares)
//       processItems(entry.invoice.service_spares, jobCardNumber, invoiceNumber, 'service_spares');

//     if (entry.invoice.all_labours)
//       processItems(entry.invoice.all_labours, jobCardNumber, invoiceNumber, 'all_labours');
//   });

//   this.hsnReportData = Object.values(hsnSummary);
//   this.hsn_reportarray = hsnSummary;

//   this.totalAmount = totalAmount;
//   this.totalCGST = totalCGST;
//   this.totalSGST = totalSGST;
//   this.totalIGST = totalIGST;
//   this.totalTaxableValue = totalTaxableValue;

//   console.log("Total Amount: ", this.totalAmount);
// }


//   processHSNReport2(response) {
//   this.hsn_reportarray = [];
//   let hsnSummary = {};

//   let totalAmount = 0;
//   let totalCGST = 0;
//   let totalSGST = 0;
//   let totalIGST = 0;
//   let totalTaxableValue = 0;

//   const processItems = (items, jobCardNumber, invoiceNumber, itemType) => {
//     items.forEach(item => {
//       let hsnCode = item.HSN ? item.HSN.trim() : null;
//       if (!hsnCode) return;

//       let gst = item.gst;
//       let uniqueKey = `${hsnCode}-${gst}`;  // ✅ Updated: Use HSN + GST as unique key

//       let qty = parseFloat(item.qty || 0);
//       let baseAmount = parseFloat(item.amount || 0);
//       let taxableValue = parseFloat(item.rate_tax_value || 0);
//       let payableamount = parseFloat(item.payableamount || 0);

//       let amount = (itemType === 'service_spares' || itemType === 'all_labours')
//         ? baseAmount + taxableValue
//         : baseAmount;

//       let cgstcalculation = (amount - payableamount) / 2;
//       let igst = 0;

//       if (!hsnSummary[uniqueKey]) {
//         hsnSummary[uniqueKey] = {
//           HSN: hsnCode,
//           GST: gst,
//           QTY: 0,
//           AMOUNT: 0,
//           Taxable_Value: 0,
//           CGST: 0,
//           SGST: 0,
//           IGST: 0
//         };
//       }

//       hsnSummary[uniqueKey].QTY += qty;
//       hsnSummary[uniqueKey].AMOUNT += amount;
//       hsnSummary[uniqueKey].Taxable_Value += payableamount;
//       hsnSummary[uniqueKey].CGST += cgstcalculation;
//       hsnSummary[uniqueKey].SGST += cgstcalculation;
//       hsnSummary[uniqueKey].IGST += igst;

//       totalAmount += amount;
//       totalCGST += cgstcalculation;
//       totalSGST += cgstcalculation;
//       totalIGST += igst;
//       totalTaxableValue += payableamount;
//     });
//   };

//   response.forEach(entry => {
//     let jobCardNumber = entry.invoice.job_card_number;
//     let invoiceNumber = entry.invoice.invoice_reference_number;
//     console.log("Invoice Number:", invoiceNumber);

//     if (entry.invoice.all_spares)
//       processItems(entry.invoice.all_spares, jobCardNumber, invoiceNumber, 'all_spares');

//     if (entry.invoice.service_spares)
//       processItems(entry.invoice.service_spares, jobCardNumber, invoiceNumber, 'service_spares');

//     if (entry.invoice.all_labours)
//       processItems(entry.invoice.all_labours, jobCardNumber, invoiceNumber, 'all_labours');
//   });

//   this.hsnReportData = Object.values(hsnSummary);
//   this.hsn_reportarray = hsnSummary;

//   this.totalAmount = totalAmount;
//   this.totalCGST = totalCGST;
//   this.totalSGST = totalSGST;
//   this.totalIGST = totalIGST;
//   this.totalTaxableValue = totalTaxableValue;

//   console.log("Total Amount: ", this.totalAmount);
// }



//   processHSNReport1(response) {
//     this.hsn_reportarray = [];
//     let hsnSummary = {};
  
//     let totalAmount = 0;
//     let totalCGST = 0;
//     let totalSGST = 0;
//     let totalIGST = 0;
//     let totalTaxableValue = 0;
  
//     const processItems = (items, jobCardNumber, invoiceNumber, itemType) => {
//       items.forEach(item => {
//         let hsnCode = item.HSN ? item.HSN.trim() : null;
//         if (!hsnCode) return;
  
//         let uniqueKey = `${jobCardNumber}-${hsnCode}`;
//         let qty = parseFloat(item.qty || 0);
  
//         let baseAmount = parseFloat(item.amount || 0);
//         let taxableValue = parseFloat(item.rate_tax_value || 0);
//         let payableamount = parseFloat(item.payableamount || 0);
  
//         // If item is from service_spares or all_labours, add taxable value to amount
//         let amount = (itemType === 'service_spares' || itemType === 'all_labours')
//           ? baseAmount + taxableValue
//           : baseAmount;
  
//         let gst = item.gst;
//         let cgst = parseFloat(item.rate_without_gst || 0) / 2;
//         let sgst = parseFloat(item.rate_without_gst || 0) / 2;
//         let igst = 0;
  
//         if (!hsnSummary[uniqueKey]) {
//           hsnSummary[uniqueKey] = {
//             HSN: hsnCode,
//             QTY: 0,
//             GST: gst,
//             AMOUNT: 0,
//             Taxable_Value: 0,
//             CGST: 0,
//             SGST: 0,
//             IGST: 0
//           };
//         }

//         let cgstcalculation = (amount-payableamount) / 2;
//         // let sgstcalculation = (itemType === 'service_spares' || itemType === 'all_labours') ? sgst : 0;
  
//         hsnSummary[uniqueKey].QTY += qty;
//         hsnSummary[uniqueKey].AMOUNT += amount;
//         hsnSummary[uniqueKey].Taxable_Value += payableamount;
//         hsnSummary[uniqueKey].CGST += cgstcalculation
//         hsnSummary[uniqueKey].SGST += cgstcalculation
//         hsnSummary[uniqueKey].IGST += igst;
  
//         totalAmount += amount;
//         totalCGST += cgstcalculation;
//         totalSGST += cgstcalculation;
//         totalIGST += igst;
//         totalTaxableValue += payableamount;
//       });
//     };
  
//     response.forEach(entry => {
//       let jobCardNumber = entry.invoice.job_card_number;
//       let invoiceNumber = entry.invoice.invoice_reference_number;
//       console.log("Invoice Number:", invoiceNumber);
  
//       if (entry.invoice.all_spares)
//         processItems(entry.invoice.all_spares, jobCardNumber, invoiceNumber, 'all_spares');
  
//       if (entry.invoice.service_spares)
//         processItems(entry.invoice.service_spares, jobCardNumber, invoiceNumber, 'service_spares');
  
//       if (entry.invoice.all_labours)
//         processItems(entry.invoice.all_labours, jobCardNumber, invoiceNumber, 'all_labours');
//     });
  
//     this.hsnReportData = Object.values(hsnSummary);
//     this.hsn_reportarray = hsnSummary;
  
//     this.totalAmount = totalAmount;
//     this.totalCGST = totalCGST;
//     this.totalSGST = totalSGST;
//     this.totalIGST = totalIGST;
//     this.totalTaxableValue = totalTaxableValue;
  
//     console.log("Total Amount: ", this.totalAmount);
//   }
  


  // processHSNReport(response) {
  //   this.hsn_reportarray = []
  //   let hsnSummary = {}; 
  
  //   let totalAmount = 0;
  //   let totalCGST = 0;
  //   let totalSGST = 0;
  //   let totalIGST = 0;
  //   let totalTaxableValue = 0;
  
  //   const processItems = (items, jobCardNumber, invoiceNumber) => {
  //     items.forEach(item => {
  //       let hsnCode = item.HSN ? item.HSN.trim() : null;
  //       if (!hsnCode) return;
  
  //       let uniqueKey = `${jobCardNumber}-${hsnCode}`; 
  //       let qty = parseFloat(item.qty || 0);
  //       let amount = parseFloat(item.amount || 0);
  //       // let rate
  //       let gst = item.gst;
  //       let taxableValue = parseFloat(item.rate_tax_value || 0);
  //       let cgst = parseFloat(item.rate_without_gst || 0) / 2;
  //       let sgst = parseFloat(item.rate_without_gst || 0) / 2;
  //       let igst = 0;
  
  //       if (!hsnSummary[uniqueKey]) {
  //         hsnSummary[uniqueKey] = { 
  //           HSN: hsnCode, 
  //           QTY: 0, 
  //           GST: gst, 
  //           AMOUNT: 0, 
  //           Taxable_Value: 0, 
  //           CGST: 0, 
  //           SGST: 0, 
  //           IGST: 0 
  //         };        
                     
  //       }
  
  //       hsnSummary[uniqueKey].QTY += qty;
  //       hsnSummary[uniqueKey].AMOUNT += amount;
  //       hsnSummary[uniqueKey].Taxable_Value += taxableValue;
  //       hsnSummary[uniqueKey].CGST += cgst;
  //       hsnSummary[uniqueKey].SGST += sgst;
  //       hsnSummary[uniqueKey].IGST += igst;
  
  //       totalAmount += amount;
  //       totalCGST += cgst;
  //       totalSGST += sgst;
  //       totalIGST += igst;
  //       totalTaxableValue += taxableValue;
  //     });
  //   };
  
  //   response.forEach(entry => {
  //     let jobCardNumber = entry.invoice.job_card_number; 
  //     let invoiceNumber = entry.invoice.invoice_reference_number;
  //     console.log(":the data inside the total hsn data",invoiceNumber)
  
  //     // Process all_spares, service_spares, and all_labours
  //     if (entry.invoice.all_spares) processItems(entry.invoice.all_spares, jobCardNumber, invoiceNumber);
  //     if (entry.invoice.service_spares) processItems(entry.invoice.service_spares, jobCardNumber, invoiceNumber);
  //     if (entry.invoice.all_labours) processItems(entry.invoice.all_labours, jobCardNumber, invoiceNumber);
  //   });
  
  //   this.hsnReportData = Object.values(hsnSummary);
  //   this.hsn_reportarray = hsnSummary;
  
  //   this.totalAmount = totalAmount;
  //   this.totalCGST = totalCGST;
  //   this.totalSGST = totalSGST;
  //   this.totalIGST = totalIGST;
  //   this.totalTaxableValue = totalTaxableValue;
  
  //   console.log("Total Amount: ", this.totalAmount);
  // }
  

// processHSNReport(response) {
//   this.hsn_reportarray = []
//   let hsnSummary = {}; 

//   let totalAmount = 0;
//   let totalCGST = 0;
//   let totalSGST = 0;
//   let totalIGST = 0;
//   let totalTaxableValue = 0;

//   response.forEach(entry => {
//       let jobCardNumber = entry.invoice.job_card_number; 
//       let invoiceNumber = entry.invoice.invoice_reference_number;
      
//       entry.invoice.all_spares.forEach(spare => {
//           let hsnCode = spare.HSN ? spare.HSN.trim() : null;
//           if (!hsnCode) return;

//           let uniqueKey = `${jobCardNumber}-${hsnCode}`; 
//           let qty = parseFloat(spare.qty);
//           let amount = parseFloat(spare.amount);
//           let gst = spare.gst
//           let Taxable_Value    = parseFloat(spare.rate_tax_value)
//           let CGST = parseFloat(spare.rate_without_gst)/2
//           let SGST = parseFloat(spare.rate_without_gst)/2
//           let IGST = 0
//           if (!hsnSummary[uniqueKey]) {
//               hsnSummary[uniqueKey] = { HSN: hsnCode, QTY: 0,GST:gst, AMOUNT: 0, Taxable_Value:0,CGST:0,SGST:0,IGST:0};
//           }

//           hsnSummary[uniqueKey].QTY += qty;
//           hsnSummary[uniqueKey].AMOUNT += amount;
//           hsnSummary[uniqueKey].Taxable_Value += Taxable_Value;
//           hsnSummary[uniqueKey].CGST += CGST;
//           hsnSummary[uniqueKey].SGST += SGST;
//           hsnSummary[uniqueKey].IGST += IGST;


//           totalAmount += amount;
//           totalCGST += CGST;
//           totalSGST += SGST;
//           totalIGST += IGST;
//           totalTaxableValue += Taxable_Value;
          
//       });
//   });

//   this.hsnReportData = Object.values(hsnSummary);
//   this.hsn_reportarray = hsnSummary

  
//   this.totalAmount = totalAmount;
//   this.totalCGST = totalCGST;
//   this.totalSGST = totalSGST;
//   this.totalIGST = totalIGST;
//   this.totalTaxableValue = totalTaxableValue;

//   console.log("total amount ",this.totalAmount)
  
// }

//for specific
// processHSNReport(response) {
//   let hsnSummary = [];

//   response.forEach(entry => {
//       let jobCardNumber = entry.invoice.job_card_number;
//       let invoiceNumber = entry.invoice.invoice_reference_number;
      
//       entry.invoice.all_spares.forEach(spare => {
//           let hsnCode = spare.HSN ? spare.HSN.trim() : null; 
//           if (!hsnCode) return;

//           let qty = Number(spare.qty);
//           let amount = Number(spare.amount);
//           let gst = spare.gst;
          

         
//           hsnSummary.push({
//               hsn: hsnCode,
//               jobCard: jobCardNumber,
//               gst,
//               qty,
//               amount,
//               invoices: [invoiceNumber]
//           });
//       });
//   });

//   this.hsnReportData = hsnSummary;
//   this.exportToExcel(hsnSummary);
// }


// exportToExcel1(data) {
//   const formattedData = Object.values(data); // Convert object to array
//   const worksheet = XLSX.utils.json_to_sheet(formattedData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "HSN Report");
//   XLSX.writeFile(workbook, "HSN_Report.xlsx");
// }

exportToExcel1_orginal(data) {
  const formattedData = Object.values(data);
  
  const totalRow = {
      HSN: "Total",
      QTY: "",
      AMOUNT: this.totalAmount,
      Taxable_Value: this.totalTaxableValue,
      CGST: this.totalCGST,
      SGST: this.totalSGST,
      IGST: this.totalIGST
  };

  formattedData.push(totalRow); // Append total row to data

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "HSN Report");
  XLSX.writeFile(workbook, "HSN_Report.xlsx");
}


exportToExcel1(data) {
  const formattedData = [];

  const addSubtotalRow = (label, totals) => ({
    HSN: label,
    QTY: '',
    AMOUNT: totals.amount.toFixed(2),
    Taxable_Value: totals.taxable.toFixed(2),
    CGST: totals.cgst.toFixed(2),
    SGST: totals.sgst.toFixed(2),
    IGST: totals.igst.toFixed(2)
  });

  // === WITH GSTIN ===
  formattedData.push({ HSN: '--- CUSTOMERS WITH GSTIN ---' });
  formattedData.push(...data.withGst);
  formattedData.push({});
  formattedData.push(addSubtotalRow('Subtotal (With GST)', this.hsn_totals.with));
  formattedData.push({});
  formattedData.push({});

  // === WITHOUT GSTIN ===
  formattedData.push({ HSN: '--- CUSTOMERS WITHOUT GSTIN ---' });
  formattedData.push(...data.withoutGst);
  formattedData.push({});
  formattedData.push(addSubtotalRow('Subtotal (Without GST)', this.hsn_totals.without));
  formattedData.push({});
  formattedData.push({});

  // === OVERALL TOTAL ===
  const grandTotal = {
    amount: this.hsn_totals.with.amount + this.hsn_totals.without.amount,
    taxable: this.hsn_totals.with.taxable + this.hsn_totals.without.taxable,
    cgst: this.hsn_totals.with.cgst + this.hsn_totals.without.cgst,
    sgst: this.hsn_totals.with.sgst + this.hsn_totals.without.sgst,
    igst: this.hsn_totals.with.igst + this.hsn_totals.without.igst
  };

  formattedData.push(addSubtotalRow('OVERALL TOTAL', grandTotal));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "HSN Report");
  XLSX.writeFile(workbook, "HSN_Report.xlsx");
}





exportToExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HSN Report");
    XLSX.writeFile(workbook, "HSN_Report.xlsx");
  }
  




  total_rangewie_gstexcel(){

    this.exportToExcel1(this.hsn_reportarray)


   



  }

}
