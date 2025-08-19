import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

// DateAdapter


@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.scss'],
  providers: [DatePipe]

})
export class GstComponent implements OnInit {

  onintdate: Date = new Date();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });



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
  gstvariable: any;
  selectedValue: any;
  dropdownvalue: any;


  constructor(private LocalStoreService: LocalStoreService, private dialog: MatDialog, private datePipe: DatePipe, private _adapter: DateAdapter<any>,) {

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

    this.dropdownvalue = ""

    this.LocalStoreService.getbranchbybranchidid().subscribe(data => {

      this.gstvariable = data.response[0]['GST']


    })


    // this._adapter.setLocale('en');

    // const today = new Date();
    // const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');

    // this.range = new FormGroup({
    //   start: new FormControl(formattedDate),
    //   end: new FormControl(formattedDate)
    // });

    this.oninitclick()

  }


  onYearMonthChange() {

    // console.log("the data inside the onmonther ")
    // return

    let total_estimateamount = 0
    let total_invoiceamount = 0
    let status = "3"

    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

    console.log("the data of start and end date", startdate, enddate)

    // this.LocalStoreService.get_dayilreport(this.selectedYearMonth, status).subscribe(data => {
    this.LocalStoreService.get_dayilreport(startdate, enddate, status, this.dropdownvalue).subscribe(data => {

      console.log("entered ,,,,1", data)
      this.dailyreportdata = data.response

      this.total_vehicle = data.response.length

      console.log("the data of the total vehicle", this.total_vehicle)

      this.dailyreportdata.forEach(report => {

        if (report.estimate && !report.invoice) {

          total_estimateamount += parseFloat(report.estimate.estimate_amount)

        }

        if (report.invoice) {

          total_invoiceamount += parseFloat(report.invoice.invoice_amount)
        }
      })
      this.estimatetotal = total_estimateamount
      this.invoicetotal = total_invoiceamount
      console.log("the data inside the getdaily report", data)

    })


  }

  oninitclick() {

    console.log("entered ,,,,1")
    let total_estimateamount = 0
    let total_invoiceamount = 0
    let total_taxableamount = 0

    let status = "3"

    var startdate = this.datePipe.transform(this.onintdate, 'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.onintdate, 'yyyy-MM-dd')


    // this.LocalStoreService.get_dayilreport(this.selectedYearMonth, status).subscribe(data => {
    this.LocalStoreService.get_dayilreport(startdate, enddate, status, this.dropdownvalue).subscribe(data => {

      this.dailyreportdata = data.response

      this.total_vehicle = data.response.length

      console.log("the data of the total vehicle", this.total_vehicle)


      this.dailyreportdata.forEach(report => {

        if (report.estimate && !report.invoice) {

          total_estimateamount += parseFloat(report.estimate.estimate_amount)

        }

        if (report.invoice) {

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
      console.log("the data inside the getdaily report", data)

    })



  }

  editbookingid(bookingideditpage, bookjobid, reference) {


    this.editbook(bookjobid, reference)
    this.dialogref = this.dialog.open(bookingideditpage, {
    });
  }

  editbook(bookjobid, reference) {

    console.log("the updated bookingid", reference)

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

//to put all data in excel
  mothlysegmentdataexcel_orginal() {
  let status = "3";
  const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
  const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

  this.LocalStoreService.gstsegment_report(startdate, enddate, status, this.dropdownvalue).subscribe(async (data) => {
    const exportData = [];
    let invoicegrandTotal = 0;
    let taxablegrandTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;

    data.response.forEach(item => {
      const customer = item.customers?.[0] || {};
      const vehicle = item.vehicledetails?.[0] || {};
      const invoice = item.invoice || {};

      const invoiceDate = this.datePipe.transform(invoice.date, 'dd-MM-yyyy');
      const invNo = invoice.invoice_reference_number;

      const gstMap = {}; 

      const addToGstMap = (gst, taxableValue, taxValue) => {
        const gstKey = parseInt(gst);
        if (!gstMap[gstKey]) {
          gstMap[gstKey] = { taxable: 0, cgst: 0, sgst: 0, invoiceVal: 0 };
        }
        const cgst = taxValue / 2;
        const sgst = taxValue / 2;
        gstMap[gstKey].taxable += taxableValue;
        gstMap[gstKey].cgst += cgst;
        gstMap[gstKey].sgst += sgst;
        gstMap[gstKey].invoiceVal += taxableValue + taxValue;
      };

      // === SPARES ===
      invoice.all_spares?.forEach(spare => {
        addToGstMap(spare.gst, parseFloat(spare.payableamount || "0"), parseFloat(spare.taxablevalue || "0"));
      });

      // === LABOURS ===
      invoice.all_labours?.forEach(labour => {
        addToGstMap(labour.gst, parseFloat(labour.payableamount || "0"), parseFloat(labour.taxablevalue || "0"));
      });

      // === PACKAGES ===
      invoice.package?.forEach(pkg => {
        addToGstMap(pkg.gst, parseFloat(pkg.payableamount || "0"), parseFloat(pkg.taxablevalue || "0"));
      });

      // === Push each GST type as separate row ===
      Object.keys(gstMap).forEach(gstKey => {
        const row = gstMap[gstKey];
        exportData.push({
          'GSTIN': customer.gst_number,
          'Customer': customer.name,
          'Trans': "Sale",
          'INV No': invNo,
          'Veh': vehicle.vh_number,
          'Date': invoiceDate,
          'INV Value': row.invoiceVal.toFixed(2),
          'GST': gstKey,
          'Cess Rate': '0',
          'Taxable Value': row.taxable.toFixed(2),
          'Reverse Charge':'N',
          'IGST':'0',
          'CGST': row.cgst.toFixed(2),
          'SGST': row.sgst.toFixed(2),
          'Cess Amount': '0',
          'Place Of Supply(Name of State)':''
        });

        invoicegrandTotal += row.invoiceVal;
        taxablegrandTotal += row.taxable;
        cgstTotal += row.cgst;
        sgstTotal += row.sgst;
      });
    });

    // === Grand Total Row ===
    exportData.push({
      'Customer': 'TOTAL',
      'Veh': '',
      'Date': '',
      'INV Value': invoicegrandTotal.toFixed(2),
      'GST': '',
      'Cess Rate': '0',
      'Taxable Value': taxablegrandTotal.toFixed(2),
      'IGST': '0',
      'CGST': cgstTotal.toFixed(2),
      'SGST': sgstTotal.toFixed(2),
      'Cess Amount': '0',
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'GST Segment Report': worksheet },
      SheetNames: ['GST Segment Report']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'GSTSegmentReport');
  });
}


//to seperate the data with and without GSTIN
mothlysegmentdataexcel() {
  let status = "3";
  const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
  const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

  this.LocalStoreService.gstsegment_report(startdate, enddate, status, this.dropdownvalue).subscribe(async (data) => {
    const exportData = [];
    const withGstRows = [];
    const withoutGstRows = [];

    let invoicegrandTotal = 0;
    let taxablegrandTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;

    let withGstTotal = { invoice: 0, taxable: 0, cgst: 0, sgst: 0 };
    let withoutGstTotal = { invoice: 0, taxable: 0, cgst: 0, sgst: 0 };

    data.response.forEach(item => {
      const customer = item.customers?.[0] || {};
      const vehicle = item.vehicledetails?.[0] || {};
      const invoice = item.invoice || {};
      const invoiceDate = this.datePipe.transform(invoice.date, 'dd-MM-yyyy');
      const invNo = invoice.invoice_reference_number;
      const gstMap = {};

      const addToGstMap = (gst, taxableValue, taxValue) => {
        const gstKey = parseInt(gst);
        if (!gstMap[gstKey]) {
          gstMap[gstKey] = { taxable: 0, cgst: 0, sgst: 0, invoiceVal: 0 };
        }
        const cgst = taxValue / 2;
        const sgst = taxValue / 2;
        gstMap[gstKey].taxable += taxableValue;
        gstMap[gstKey].cgst += cgst;
        gstMap[gstKey].sgst += sgst;
        gstMap[gstKey].invoiceVal += taxableValue + taxValue;
      };

      invoice.all_spares?.forEach(spare => {
        addToGstMap(spare.gst, parseFloat(spare.payableamount || "0"), parseFloat(spare.taxablevalue || "0"));
      });
      invoice.all_labours?.forEach(labour => {
        addToGstMap(labour.gst, parseFloat(labour.payableamount || "0"), parseFloat(labour.taxablevalue || "0"));
      });
      invoice.package?.forEach(pkg => {
        addToGstMap(pkg.gst, parseFloat(pkg.payableamount || "0"), parseFloat(pkg.taxablevalue || "0"));
      });

      Object.keys(gstMap).forEach(gstKey => {
        const row = gstMap[gstKey];
        const rowData = {
          'GSTIN': customer.gst_number,
          'Customer': customer.name,
          'Trans': "Sale",
          'INV No': invNo,
          'Veh': vehicle.vh_number,
          'Date': invoiceDate,
          'INV Value': row.invoiceVal.toFixed(2),
          'GST': gstKey,
          'Cess Rate': '0',
          'Taxable Value': row.taxable.toFixed(2),
          'Reverse Charge': 'N',
          'IGST': '0',
          'CGST': row.cgst.toFixed(2),
          'SGST': row.sgst.toFixed(2),
          'Cess Amount': '0',
          'Place Of Supply(Name of State)': ''
        };

        if (customer.gst_number) {
          withGstRows.push(rowData);
          withGstTotal.invoice += row.invoiceVal;
          withGstTotal.taxable += row.taxable;
          withGstTotal.cgst += row.cgst;
          withGstTotal.sgst += row.sgst;
        } else {
          withoutGstRows.push(rowData);
          withoutGstTotal.invoice += row.invoiceVal;
          withoutGstTotal.taxable += row.taxable;
          withoutGstTotal.cgst += row.cgst;
          withoutGstTotal.sgst += row.sgst;
        }

        invoicegrandTotal += row.invoiceVal;
        taxablegrandTotal += row.taxable;
        cgstTotal += row.cgst;
        sgstTotal += row.sgst;
      });
    });

    // Add WITH GSTIN data
    exportData.push({ 'Customer': '--- CUSTOMERS WITH GSTIN ---' });
    exportData.push(...withGstRows);
    exportData.push({});
    exportData.push({
      'Customer': 'Subtotal (With GSTIN)',
      'INV Value': withGstTotal.invoice.toFixed(2),
      'Taxable Value': withGstTotal.taxable.toFixed(2),
      'CGST': withGstTotal.cgst.toFixed(2),
      'SGST': withGstTotal.sgst.toFixed(2),
    });

    // Add spacing
    exportData.push({});
    exportData.push({});

    // Add WITHOUT GSTIN data
    exportData.push({ 'Customer': '--- CUSTOMERS WITHOUT GSTIN ---' });
    exportData.push(...withoutGstRows);
    exportData.push({});
    exportData.push({
      'Customer': 'Subtotal (Without GSTIN)',
      'INV Value': withoutGstTotal.invoice.toFixed(2),
      'Taxable Value': withoutGstTotal.taxable.toFixed(2),
      'CGST': withoutGstTotal.cgst.toFixed(2),
      'SGST': withoutGstTotal.sgst.toFixed(2),
    });

    // Add spacing
    exportData.push({});
    exportData.push({});

    // Grand Total
    exportData.push({
      'Customer': 'OVERALL TOTAL',
      'INV Value': invoicegrandTotal.toFixed(2),
      'Taxable Value': taxablegrandTotal.toFixed(2),
      'CGST': cgstTotal.toFixed(2),
      'SGST': sgstTotal.toFixed(2),
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'GST Segment Report': worksheet },
      SheetNames: ['GST Segment Report'] 
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'GSTSegmentReport');
  });
}


    mothlysegmentdataexcel1() {
    let status = "3";
    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

    this.LocalStoreService.gstsegment_report(startdate, enddate, status, this.dropdownvalue).subscribe(async (data) => {
      const exportData = [];
      let invoicegrandTotal = 0;
      let taxablegrandTotal = 0;
      let seperatetax = 0;

      data.response.forEach(item => {
        const customer = item.customers?.[0] || {};
        const vehicle = item.vehicledetails?.[0] || {};
        const invoice = item.invoice || {};


        const invoiceAmount_gt = parseFloat(invoice.invoice_amount || 0);
        const taxableamount_gt =
          Number(invoice.fulllabours_totalwithoutgst || 0) +
          Number(invoice.fullspares_totalwithoutgst || 0) +
          Number(invoice.package_totalwithoutgst || 0);

        taxablegrandTotal += taxableamount_gt;
        invoicegrandTotal += invoiceAmount_gt;
        seperatetax = (invoicegrandTotal - taxablegrandTotal)/2

        
        invoice.all_spares?.forEach(spare => {
          exportData.push({
            'Invoice Date': this.datePipe.transform(invoice.date, 'dd-MM-yyyy'),
            'Inv No': invoice.invoice_reference_number,
            'Customer': customer.name,
            'Transaction Type': 'Sale',
            'Mobile': customer.mobile,
            'Vehicle Number': vehicle.vh_number,
            'Spare': spare.spare,
            'GST %': spare.gst,
            'Invoice Value': Number(spare.payableamount) + Number(spare.taxablevalue),
            'Taxable Value': spare.payableamount,
            "CGST":Number(spare.taxablevalue)/2,
            "SGST":Number(spare.taxablevalue)/2,
          });
        });

        invoice.all_labours?.forEach(labour => {
          exportData.push({
            'Invoice Date': this.datePipe.transform(invoice.date, 'dd-MM-yyyy'),
            'Inv No': invoice.invoice_reference_number,
            'Customer': customer.name,
            'Transaction Type': 'Sale',
            'Mobile': customer.mobile,
            'Vehicle Number': vehicle.vh_number,
            'Spare': labour.name,
            'GST %': labour.gst,
            'Invoice Value': Number(labour.payableamount) + Number(labour.taxablevalue),
            'Taxable Value': labour.payableamount,
            "CGST":Number(labour.taxablevalue)/2,
            "SGST":Number(labour.taxablevalue)/2,
            
          });
        });

        invoice.package?.forEach(pkg => {
          exportData.push({
            'Invoice Date': this.datePipe.transform(invoice.date, 'dd-MM-yyyy'),
            'Inv No': invoice.invoice_reference_number,
            'Customer': customer.name,
            'Transaction Type': 'Sale',
            'Mobile': customer.mobile,
            'Vehicle Number': vehicle.vh_number,
            'Spare': pkg.spare,
            'GST %': pkg.gst,
            'Invoice Value': Number(pkg.payableamount) + Number(pkg.taxablevalue),
            'Taxable Value': pkg.payableamount,
            "CGST":Number(pkg.taxablevalue)/2,
            "SGST":Number(pkg.taxablevalue)/2,
          });
        });
      });
      exportData.push({
        'Invoice Value': invoicegrandTotal.toFixed(2),
        'Taxable Value': taxablegrandTotal.toFixed(2),
        'CGST': seperatetax.toFixed(2),
        'SGST': seperatetax.toFixed(2),
      });
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'GST Segment Report': worksheet },
        SheetNames: ['GST Segment Report']
      };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'GSTSegmentReport');
    });
  }


  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }


  mothlydataexcel1() {
    console.log("function clicked");

    let status = "3";
    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

    this.LocalStoreService.get_dayilreport(startdate, enddate, status, this.dropdownvalue).subscribe((data: any) => {
      const reportData = data.response;
      const report = [];
      report.push(["Created Date", "Invoice Date", "Invoice No", "Name", "Mobile", "GST", "Brand", "Model", "Vehicle Number", "Spare", "Qty", "Rate", "Amount", "TaxAmount", "GST%", "CGST9%", "SGST9%", "CGST14%", "SGST14%"]);

      reportData.forEach(item => {
        const createdDate = this.datePipe.transform(item.createdDate, 'dd-MM-yyyy');
        const invoiceDate = this.datePipe.transform(item.invoiceDate, 'dd-MM-yyyy');

        let invoiceAmount = 0, invoiceTax = 0, invoiceCGST9 = 0, invoiceSGST9 = 0, invoiceCGST14 = 0, invoiceSGST14 = 0;

        const processEntry = (entry, isInclusive: boolean) => {
          const rate = parseFloat(entry.rate);
          const qty = parseFloat(entry.qty);
          let amount = parseFloat(entry.total);
          const gstPercent = (entry.gst18) ? 18 : 28;

          let taxAmount = 0, taxable = 0;
          if (isInclusive) {
            // (data.amount * 100 / (100 + 18)).toFixed(2);
            taxable = amount * 100 / (100 + 18);
            // taxable = amount / (1 + (gstPercent / 100));
            taxAmount = amount - taxable;
          } else {
            taxable = amount;
            // (data.amount * 0.18).toFixed(2);
            taxAmount = (taxable * gstPercent);
            // taxAmount = (taxable * gstPercent) / 100;
            amount = taxable + taxAmount;
          }

          const cgst9 = (taxAmount);
          const sgst9 = (taxAmount);

          invoiceAmount += amount;
          invoiceTax += taxAmount;
          invoiceCGST9 += cgst9;
          invoiceSGST9 += sgst9;

          report.push([
            createdDate,
            invoiceDate,
            item.invoice_no,
            item.customer_name,
            item.customer_mobile,
            item.gst,
            entry.brand,
            entry.model,
            entry.vehicle_number,
            entry.spare,
            entry.qty,
            entry.rate,
            amount.toFixed(2),
            taxable.toFixed(2),
            `${gstPercent}%`,
            cgst9.toFixed(2),
            sgst9.toFixed(2),
            "0", "0"
          ]);
        };

        item.invoice.all_spares.forEach(spare => processEntry(spare, true));
        item.invoice.package.forEach(pkg => processEntry(pkg, false));
        item.invoice.all_labours.forEach(labour => processEntry(labour, false));

        // Add Total Row
        report.push([
          "", "", "", "", "", "", "", "", "", "Total", "", "",
          invoiceAmount.toFixed(2),
          (invoiceAmount - invoiceTax).toFixed(2),
          "", invoiceCGST9.toFixed(2), invoiceSGST9.toFixed(2),
          invoiceCGST14.toFixed(2), invoiceSGST14.toFixed(2)
        ]);
      });

      // Generate Excel
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(report);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Invoice Report');
      XLSX.writeFile(wb, 'Invoice_Report.xlsx');
    });
  }







  mothlydataexcel() {
    console.log("function clicked")
    let status = "3";

    let finaltax;
    // let fullfinaltax = 0;
    // let finaltotaltaxvalue = 0
    let finalfor18;
    let finalfor28
    let alltaxablevalue18spare = 0


    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');



    // this.LocalStoreService.get_dayilreport(this.selectedYearMonth, status).subscribe(data => {
    this.LocalStoreService.get_dayilreport(startdate, enddate, status, this.dropdownvalue).subscribe(data => {

      console.log("the data structure of the excel report", data)
      var afteroct_customers = [];

      var invoicedataamount = 0;
      // let finaltotaltaxvalue = 0;
      let finaltotaltaxvalue = 0;
      data.response.forEach(customerData => {

        invoicedataamount += customerData.invoice ? parseFloat(customerData.invoice.invoice_amount) : 0;
        finaltotaltaxvalue += customerData.invoice ? parseFloat(customerData.invoice.fullspares_totalwithoutgst) + parseFloat(customerData.invoice.fulllabours_totalwithoutgst) + parseFloat(customerData.invoice.package_totalwithoutgst) : 0;


        // if (customerData.invoice) {
        //   const { all_spares, all_labours, package: packages } = customerData.invoice;

        //   if (Array.isArray(all_spares) && all_spares.length > 0) {
        //     all_spares.forEach(spare => {
        //       finaltotaltaxvalue += parseFloat(spare.payableamount || 0);
        //     });
        //   }

        //   if (Array.isArray(all_labours) && all_labours.length > 0) {
        //     all_labours.forEach(labour => {
        //       finaltotaltaxvalue += parseFloat(labour.payableamount || 0);
        //     });
        //   }

        //   if (Array.isArray(packages) && packages.length > 0) {
        //     packages.forEach(pkg => {
        //       finaltotaltaxvalue += parseFloat(pkg.payableamount || 0);
        //     });
        //   }
        // }
        // finaltotaltaxvalue +=  customerData.invoice ? parseFloat(customerData.invoice.fulllabours_with_18_total)+ parseFloat(customerData.invoice.fullspares_with_28_total)+ parseFloat(customerData.invoice.fullspares_with_18_total)+ parseFloat(customerData.invoice.package_with_18_total) : 0;






        let customer = customerData.customers[0];
        let vehicleDetails = customerData.vehicledetails[0];
        let vehiclebrand = vehicleDetails.brand;
        let vehiclemodel = vehicleDetails.model;
        let vehicledata = vehicleDetails.vh_number;
        let invoicedata = customerData.invoice ? customerData.invoice.invoice_amount : "Not Invoiced";



        var packagedatafinaltax = "0";
        if (customerData.invoice.package) {
          packagedatafinaltax = customerData.invoice.package_totalwithoutgst
        }




        finaltax = customerData.invoice ? (parseFloat(customerData.invoice.fullspares_totalwithoutgst) + parseFloat(customerData.invoice.fulllabours_totalwithoutgst) +
          parseFloat(packagedatafinaltax)).toFixed(2) : "Not Invoiced";


        var packagedata = "0";
        if (customerData.invoice.package_with_18_total) {

          packagedata = customerData.invoice.package_with_18_total

        }
        finalfor18 = customerData.invoice ? parseFloat(customerData.invoice.fullspares_with_18_total) +
          parseFloat(customerData.invoice.fulllabours_with_18_total) + parseFloat(packagedata) : "Not Invoiced";

        console.log("the data of the finalfor18__________", packagedata)


        finalfor28 = customerData.invoice ? invoicedata - customerData.invoice.fullspares_with_28_total : "Not Invoiced";


        if (customerData.invoice && customerData.invoice.fullspares_totalwithoutgst && customerData.invoice.fulllabours_totalwithoutgst) {
          const sparesTotal = parseFloat(customerData.invoice.fullspares_totalwithoutgst);
          const laboursTotal = parseFloat(customerData.invoice.fulllabours_totalwithoutgst);


        }




        if (customerData.invoice) {
          console.log("full data inside the gst report", customerData)
          let formattedDate = this.datePipe.transform(customerData.createddate, 'dd-MM-yyyy');
          let allinvoice = customerData.invoice
          // let formateinvoicedate = this.datePipe.transform(allinvoice.date, 'dd-MM-yyyy');
          let formateinvoicedate = this.datePipe.transform(customerData.invoicehistory.date, 'dd-MM-yyyy');




          if (customerData.invoice.package) {
            customerData.invoice.package.forEach(data => {
              data.amount = (data.amount + parseFloat(data.taxablevalue))
            })
          }
          if (customerData.invoice.package) {
            customerData.invoice.package.forEach(packageItem => {
              customerData.invoice.all_spares.push(packageItem);
            })
          }

          if (customerData.invoice.package) {
            customerData.invoice.all_labours.forEach(data => {
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
                "Invoice Date": index === 0 ? formateinvoicedate : "",
                "Invoice No": index === 0 ? customerData.invoice.invoice_reference_number : "",
                "Name": index === 0 ? customer.name : "",
                "Mobile": index === 0 ? customer.mobile : "",
                "GST": index === 0 ? customer.gst_number : "",
                "Brand": index === 0 ? vehiclebrand : "",
                "Model": index === 0 ? vehiclemodel : "",
                "Vehicle Number": index === 0 ? vehicledata : "",
                "Spare": invspare.spare,
                "Qty": invspare.qty,
                "Rate": invspare.rate,
                "Amount": invspare.amount,

                "TaxAmount": invspare.payableamount,
                "GST%": invspare.gst18 || invspare.gst == "18 %" ? "18%" : "28%",
                "CGST9%": invspare.gst18 || invspare.gst == "18 %" ? ((invspare.spares_with_18) / 2).toFixed(2) : "0",
                "SGST9%": invspare.gst18 || invspare.gst == "18 %" ? ((invspare.spares_with_18) / 2).toFixed(2) : "0",
                "CGST14%": invspare.gst28 || invspare.gst == "28 %" ? ((invspare.spares_with_28) / 2).toFixed(2) : "0",
                "SGST14%": invspare.gst28 || invspare.gst == "28 %" ? ((invspare.spares_with_28) / 2).toFixed(2) : "0",


              };
              if (this.gstvariable === "") {
                delete spareObj["TaxAmount"];
                delete spareObj["GST%"];
                delete spareObj["CGST9%"];
                delete spareObj["SGST9%"];
                delete spareObj["CGST14%"];
                delete spareObj["SGST14%"];
                delete spareObj["GST"];
              }

              afteroct_customers.push(spareObj);

            }



            if (invlabour && invspare) {
              let labourObj = {
                "Created Date": "",
                "Invoice Date": "",
                "Invoice No": "",
                "Name": "",
                "Mobile": "",
                "GST": "",
                "Brand": "",
                "Model": "",
                "Vehicle Number": "",
                "Spare": invlabour.name,
                "Qty": invlabour.qty,
                "Rate": invlabour.rate,
                "Amount": invlabour.amount,
                "TaxAmount": invlabour.payableamount,
                "GST%": invlabour.gst18 || invlabour.gst ? "18%" : "28%",
                "CGST9%": invlabour.gst18 || invlabour.gst == "18 %" ? ((invlabour.labour_with_18) / 2).toFixed(2) : "0",
                "SGST9%": invlabour.gst18 || invlabour.gst == "18 %" ? ((invlabour.labour_with_18) / 2).toFixed(2) : "0",
                "CGST14%": invlabour.gst28 || invlabour.gst == "28 %" ? ((invlabour.labour_with_28) / 2).toFixed(2) : "0",
                "SGST14%": invlabour.gst28 || invlabour.gst == "28 %" ? ((invlabour.labour_with_28) / 2).toFixed(2) : "0",


              };

              if (this.gstvariable === "") {
                delete labourObj["TaxAmount"];
                delete labourObj["GST%"];
                delete labourObj["CGST9%"];
                delete labourObj["SGST9%"];
                delete labourObj["CGST14%"];
                delete labourObj["SGST14%"];
                delete labourObj["GST"];
              }





              afteroct_customers.push(labourObj);

            }

            if (invlabour && !invspare) {

              let labourObjs = {
                "Created Date": index === 0 ? formattedDate : "",
                "Invoice Date": index === 0 ? formateinvoicedate : "",
                "Invoice No": index === 0 ? customerData.invoice.invoice_reference_number : "",

                "Name": index === 0 ? customer.name : "",
                "Mobile": index === 0 ? customer.mobile : "",
                "GST": index === 0 ? customer.gst_number : "",
                "Brand": index === 0 ? vehiclebrand : "",
                "Model": index === 0 ? vehiclemodel : "",
                "Vehicle Number": index === 0 ? vehicledata : "",
                "Spare": invlabour.name,
                "Qty": invlabour.qty,
                "Rate": invlabour.rate,
                "Amount": invlabour.amount,
                "TaxAmount": invlabour.payableamount,
                "GST%": invlabour.gst18 || invlabour.gst ? "18%" : "28%",
                "CGST9%": invlabour.gst18 || invlabour.gst == "18 %" ? ((invlabour.labour_with_18) / 2).toFixed(2) : "0",
                "SGST9%": invlabour.gst18 || invlabour.gst == "18 %" ? ((invlabour.labour_with_18) / 2).toFixed(2) : "0",
                "CGST14%": invlabour.gst28 || invlabour.gst == "28 %" ? ((invlabour.labour_with_28) / 2).toFixed(2) : "0",
                "SGST14%": invlabour.gst28 || invlabour.gst == "28 %" ? ((invlabour.labour_with_28) / 2).toFixed(2) : "0",

              };

              if (this.gstvariable === "") {
                delete labourObjs["TaxAmount"];
                delete labourObjs["GST%"];
                delete labourObjs["CGST9%"];
                delete labourObjs["SGST9%"];
                delete labourObjs["CGST14%"];
                delete labourObjs["SGST14%"];
                delete labourObjs["GST"];
              }

              afteroct_customers.push(labourObjs);


            }

            if (invspare && !invlabour) {
              const cgstRate = 9;
              let spareObj = {
                "Created Date": index === 0 ? formattedDate : "",
                "Invoice Date": index === 0 ? formateinvoicedate : "",
                "Invoice No": index === 0 ? customerData.invoice.invoice_reference_number : "",

                "Name": index === 0 ? customer.name : "",
                "Mobile": index === 0 ? customer.mobile : "",
                "GST": index === 0 ? customer.gst_number : "",
                "Brand": index === 0 ? vehiclebrand : "",
                "Model": index === 0 ? vehiclemodel : "",
                "Vehicle Number": index === 0 ? vehicledata : "",
                "Spare": invspare.spare,
                "Qty": invspare.qty,
                "Rate": invspare.rate,
                "Amount": invspare.amount,
                "TaxAmount": invspare.payableamount,
                "GST%": invspare.gst18 || invspare.gst == "18 %" ? "18%" : "28%",
                "CGST9%": invspare.gst18 || invspare.gst == "18 %" ? ((invspare.spares_with_18) / 2).toFixed(2) : "0",
                "SGST9%": invspare.gst18 || invspare.gst == "18 %" ? ((invspare.spares_with_18) / 2).toFixed(2) : "0",
                "CGST14%": invspare.gst28 || invspare.gst == "28 %" ? ((invspare.spares_with_28) / 2).toFixed(2) : "0",
                "SGST14%": invspare.gst28 || invspare.gst == "28 %" ? ((invspare.spares_with_28) / 2).toFixed(2) : "0",


              };

              if (this.gstvariable === "") {
                delete spareObj["TaxAmount"];
                delete spareObj["GST%"];
                delete spareObj["CGST9%"];
                delete spareObj["SGST9%"];
                delete spareObj["CGST14%"];
                delete spareObj["SGST14%"];
                delete spareObj["GST"];
              }

              afteroct_customers.push(spareObj);


            }
          }

          let totalObj = {
            "Created Date": "",
            "Invoice Date": "",
            "Invoice No": "",
            "Name": "",
            "Mobile": "",
            "GST": "",
            "Brand": "",
            "Model": "",
            "Vehicle Number": "",
            "Spare": "",
            "Qty": "",
            "Rate": "",
            "Amount": "",
            "TaxAmount": "",
            "GST%": "",
            "CGST9%": "",
            "SGST9%": "",
            "CGST14%": "",
            "SGST14%": "",
          };
          if (this.gstvariable === "") {
            delete totalObj["TaxAmount"];
            delete totalObj["GST%"];
            delete totalObj["CGST9%"];
            delete totalObj["SGST9%"];
            delete totalObj["CGST14%"];
            delete totalObj["SGST14%"];
            delete totalObj["GST"];
          }
          afteroct_customers.push(totalObj);
          totalObj = {
            "Created Date": "",
            "Invoice Date": "",
            "Invoice No": "",

            "Name": "",
            "Mobile": "",
            "GST": "",
            "Brand": "",
            "Model": "",
            "Vehicle Number": "",
            "Spare": "",
            "Qty": "Total",
            "Rate": "",
            "Amount": invoicedata,
            "TaxAmount": finaltax,
            "GST%": "",
            "CGST9%": ((finalfor18) / 2).toFixed(2),
            "SGST9%": ((finalfor18) / 2).toFixed(2),
            "CGST14%": ((invoicedata - finalfor28) / 2).toFixed(2),
            "SGST14%": ((invoicedata - finalfor28) / 2).toFixed(2),

          };


          if (this.gstvariable === "") {
            delete totalObj["TaxAmount"];
            delete totalObj["GST%"];
            delete totalObj["CGST9%"];
            delete totalObj["SGST9%"];
            delete totalObj["CGST14%"];
            delete totalObj["SGST14%"];
            delete totalObj["GST"];
          }

          afteroct_customers.push(totalObj);

          totalObj = {
            "Created Date": "",
            "Invoice Date": "",
            "Invoice No": "",

            "Name": "",
            "Mobile": "",
            "GST": "",
            "Brand": "",
            "Model": "",
            "Vehicle Number": "",
            "Spare": "",
            "Qty": "",
            "Rate": "",
            "Amount": "",
            "TaxAmount": "",
            "GST%": "",
            "CGST9%": "",
            "SGST9%": "",
            "CGST14%": "",
            "SGST14%": "",
          };

          if (this.gstvariable === "") {
            delete totalObj["TaxAmount"];
            delete totalObj["GST%"];
            delete totalObj["CGST9%"];
            delete totalObj["SGST9%"];
            delete totalObj["CGST14%"];
            delete totalObj["SGST14%"];
            delete totalObj["GST"];
          }

          afteroct_customers.push(totalObj);


        }

        else {
          let formattedDate = this.datePipe.transform(customerData.createddate, 'dd-MM-yyyy');
          let obj = {
            "Created Date": formattedDate,
            "Name": customer.name,
            "Mobile": customer.mobile,
            "GST": customer.gst_number,
            "Brand": vehiclebrand,
            "Model": vehiclemodel,
            "Vehicle Number": vehicledata,
            "Spare": "",
            "Qty": "",
            "Rate": "",
            "Amount": "",
            "Taxable Amount": "",
            "GST%": "",
            "CGST9%": "",
            "SGST9%": "",
            "CGST14%": "",
            "SGST14%": "",
          };
          afteroct_customers.push(obj);
        }
      });

      console.log("the full invoice amount in the excel ", invoicedataamount.toFixed(2))
      console.log("the full invoice taxable amount in the excel ", finaltotaltaxvalue.toFixed(2))
      var finame = "GST ";


      //       afteroct_customers.sort((a, b) => {
      //   return new Date(a["Invoice Date"]).getTime() - new Date(b["Invoice Date"]).getTime();
      // });

      // return
      this.LocalStoreService.exportAsExcelFile_task(afteroct_customers, finame, this.gstvariable, invoicedataamount.toFixed(2), finaltotaltaxvalue.toFixed(2));
    });
  }



  fortest_estimatespareexcel() {
    let status = "4";
    let finaltax;
    let finalfor18;
    let finalfor28
    let alltaxablevalue18spare = 0

    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

    // this.LocalStoreService.get_dayilreport(this.selectedYearMonth, status).subscribe(data => {
    this.LocalStoreService.get_dayilreport(startdate, enddate, status, this.dropdownvalue).subscribe(data => {
      var afteroct_customers = [];
      data.response.forEach(customerData => {
        let customer = customerData.customers[0];
        let vehicleDetails = customerData.vehicledetails[0];
        let vehiclebrand = vehicleDetails.brand;
        let vehiclemodel = vehicleDetails.model;
        let vehicledata = vehicleDetails.vh_number;
        let estimatedata = customerData.estimate ? customerData.estimate.estimate_amount : "Not estimated";



        if (customerData.estimate) {
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
                "Invoice Date": index === 0 ? formateestimatedate : "",
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
                "Created Date": "",
                "Invoice Date": "",
                "Name": "",
                "Mobile": "",
                "Brand": "",
                "Model": "",
                "Vehicle Number": "",
                "Spare": estilabour.name,
                "Qty": estilabour.qty,
                "Rate": estilabour.rate,
                "Amount": estilabour.amount,


              };

              afteroct_customers.push(labourObj);

            }

            if (estilabour && !estispare) {

              let labourObjs = {
                "Created Date": index === 0 ? formattedDate : "",
                "Invoice Date": index === 0 ? formateestimatedate : "",

                "Name": index === 0 ? customer.name : "",
                "Mobile": index === 0 ? customer.mobile : "",
                "Brand": index === 0 ? vehiclebrand : "",
                "Model": index === 0 ? vehiclemodel : "",
                "Vehicle Number": index === 0 ? vehicledata : "",
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
                "Invoice Date": index === 0 ? formateestimatedate : "",
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
            "Invoice Date": "",
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
            "Invoice Date": "",

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
            "Invoice Date": "",
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


  onStatusChange(event) {


    this.dropdownvalue = event.value

    console.log("the data of the dropdown value", this.dropdownvalue)


    let total_estimateamount = 0
    let total_invoiceamount = 0
    let status = "3"

    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

    // this.LocalStoreService.get_dayilreport(this.selectedYearMonth, status).subscribe(data => {
    this.LocalStoreService.get_dayilreport(startdate, enddate, status, this.dropdownvalue).subscribe(data => {

      console.log("entered ,,,,1")
      this.dailyreportdata = data.response

      this.total_vehicle = data.response.length

      console.log("the data of the total vehicle", this.total_vehicle)

      this.dailyreportdata.forEach(report => {

        if (report.estimate && !report.invoice) {

          total_estimateamount += parseFloat(report.estimate.estimate_amount)

        }

        if (report.invoice) {

          total_invoiceamount += parseFloat(report.invoice.invoice_amount)
        }
      })
      this.estimatetotal = total_estimateamount
      this.invoicetotal = total_invoiceamount
      console.log("the data inside the getdaily report", data)

    })


  }




}
