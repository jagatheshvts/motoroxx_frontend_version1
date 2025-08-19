import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { LocalStoreService } from 'src/app/shared/services/local-store.service'; 
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-battery',
	templateUrl: './battery.component.html',
	styleUrls: ['./battery.component.scss'],
	providers: [DatePipe]


})
export class BatteryComponent implements OnInit {

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
  referencename: any;
  totalspareprofitsum =0 ;

  constructor(private LocalStoreService: LocalStoreService,private dialog: MatDialog, private datePipe: DatePipe,private _adapter: DateAdapter<any>,private model: NgbModal) { }

	

	ngOnInit() {

		this._adapter.setLocale('en'); // Set locale as per your requirement

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
		let totalspareprofit = 0
		let filteredSpares 
		
	
		var startdate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')
		var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
	
	
	
		var status = "datewise_totalgst_inv-report"
	
		  this.LocalStoreService.getbatteryreport(startdate,enddate).subscribe(data=>{
	
			var oninitdata 
	
	
			this.totalgstreport = data.response
			oninitdata = data.response
		  })
	}
	
	  onDatepickerClosed(): void {
	
	
	
		var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
		var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
	   
		  var status = "datewise_totalgst_inv-report"
		  this.LocalStoreService.getbatteryreport(startdate,enddate).subscribe(data=>{
			this.totalgstreport = data.response
			
		  })
	   
	  }
	
	 
	
	
	batterydataexcel() {
	  console.log("Entered batterydataexcel");
	
	  const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
	  const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');
	
	  this.LocalStoreService.getbatteryreport_excel(startdate, enddate).subscribe(data => {
		const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		const url = window.URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'battery_report.xlsx';
		document.body.appendChild(anchor);
		anchor.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(anchor);
	
		console.log('Download successful');
	  }, error => {
		console.error('Download error:', error);
	  });
	}

}
