

import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-hsn-search',
  templateUrl: './hsn-search.component.html',
  styleUrls: ['./hsn-search.component.scss'],
  providers: [DatePipe]
})
export class HSNSearchComponent implements OnInit {
  range: FormGroup;
  HsnSearch: string = '';
  selectedDate: string = '';
  hsnReportData: any[];
  totalAmount: any;
  totalTaxableValue: number;
  totalCGST: any;
  totalSGST: any;
  totalIGST: number;

  constructor(
    private localStoreService: LocalStoreService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.range = this.fb.group({
      start: [null],
      end: [null]
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];

  }

  onDatepickerClosed(): void {

    if (this.HsnSearch != "") {

      const startDate: Date = this.range.value.start;
      const endDate: Date = this.range.value.end;

      let StartDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');

      let EndDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');

      console.log('Formatted Date Range:');
      console.log('Start Date:', StartDate);
      console.log('End Date:', EndDate);
      console.log("srach", this.HsnSearch);
      this.localStoreService.hsnSearch(StartDate, EndDate, this.HsnSearch).subscribe(data => {
        console.log("datas", data);

        this.processHSNReport(data.response)




      })
    } else {
      alert("please give the hsn code")
    }

  }

  processHSNReport(response) {

    // console.log("the data inside the customer data in the hsn report",response)
    // return
    let hsnSummary = [];

    let totalAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let totalTaxableValue = 0;

    response.forEach(entry => {
      let invoiceNumber = entry.invoice.invoice_reference_number;
      let CustomerName = entry.customers[0].name;
      let invoicedate = entry.invoice.date;

      entry.invoice.all_spares.forEach(spare => {
        if (spare.HSN == this.HsnSearch) {

          let hsnCode = spare.HSN ? spare.HSN.trim() : null;
          if (!hsnCode) return;

          let QTY = Number(spare.qty);
          let AMOUNT = Number(spare.amount);
          let GST = spare.gst;
          let Taxable_Value = parseFloat(spare.rate_tax_value)
          let CGST = parseFloat(spare.rate_without_gst) / 2
          let SGST = parseFloat(spare.rate_without_gst) / 2
          let IGST = 0


          totalAmount += AMOUNT;
          totalCGST += CGST;
          totalSGST += SGST;
          totalIGST += IGST;
          totalTaxableValue += Taxable_Value;


          hsnSummary.push({
            INVDATE:this.datePipe.transform(invoicedate, 'dd/MM/yyyy') || '' ,
            INVOICE: invoiceNumber,
            CUSTOMER:CustomerName,
            HSN: hsnCode,
            // jobCard: jobCardNumber,
            GST,
            QTY,
            AMOUNT,
            Taxable_Value,
            CGST,
            SGST,
            IGST

          });
        }
      });
    });

    this.totalAmount = totalAmount
    this.totalCGST = totalCGST;
    this.totalSGST = totalSGST;
    this.totalIGST = totalIGST;
    this.totalTaxableValue = totalTaxableValue
    this.hsnReportData = hsnSummary;
    // this.exportToExcel(hsnSummary);
  }


  exportToExcel() {


    const formattedData = Object.values(this.hsnReportData); // Convert object to array

    // Add total row
    const totalRow = {
      INVDATE:"Total",
      INVOICE:"" ,
      CUSTOMER:"",
      HSN: "",
      QTY: "",
      AMOUNT: this.totalAmount,
      Taxable_Value: this.totalTaxableValue,
      CGST: this.totalCGST,
      SGST: this.totalSGST,
      IGST: this.totalIGST,
    };

    formattedData.push(totalRow); // Append total row to data

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HSN Report");
    XLSX.writeFile(workbook, "HSN_Report.xlsx");




    // const worksheet = XLSX.utils.json_to_sheet(this.hsnReportData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "HSN Report");
    // XLSX.writeFile(workbook, "HSN_Report.xlsx");
  }

}
