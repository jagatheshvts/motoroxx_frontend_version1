import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-inventory-report',
  // standalone: true,
  // imports: [],
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.scss',
  providers: [DatePipe]
})
export class InventoryReportComponent implements OnInit {

  onintdate: Date = new Date();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  totalinventoryreport: any = [];


  constructor(private LocalStoreService: LocalStoreService, private dialog: MatDialog, private datePipe: DatePipe, private _adapter: DateAdapter<any>, private model: NgbModal) { }

  ngOnInit() {



    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');


    this.range = new FormGroup({
      start: new FormControl(formattedDate),
      end: new FormControl(formattedDate)
    });
    this.oninitclick()

  }

  oninitclick() {
    var startdate = this.datePipe.transform(this.onintdate, 'yyyy-MM-dd')

    this.LocalStoreService.inventory_report(startdate, startdate).subscribe(data => {
      this.totalinventoryreport = data.response
      console.log("the data inside the reponse", data)
    })

  }


  onDatepickerClosed() {

    var startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd')

    console.log("data structure start date", startdate)
    console.log("data structure end date", enddate)
    // return

    this.LocalStoreService.inventory_report(startdate, enddate).subscribe(data => {
      this.totalinventoryreport = data.response
      console.log("the data inside the reponse", data)
    })

  }

  total_rangewie_reportexcel() {
    let finaldata
    let formattedData = [];
    this.totalinventoryreport.forEach(data => {
      finaldata = {
        "Created_Date": data.createddate,
        "Updated_Date": data.updated_date,
        "HSN": data.HSN,
        "Part_Code": data.partcode,
        "Product": data.product_name,
        "QTY": data.qty,
        "MRP": data.MRP,
      }
      formattedData.push(finaldata); 
    })

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");
    XLSX.writeFile(workbook, "Inventory Report.xlsx");
  }

}
