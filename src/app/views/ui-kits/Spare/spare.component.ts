import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-spare',
  templateUrl: './spare.component.html',
  styleUrls: ['./spare.component.scss'],
  providers: [DatePipe]

})
export class SpareComponent implements OnInit {

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
    var startdate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')
      this.LocalStoreService.getsparedatareport(startdate,enddate).subscribe(data=>{
        this.total_vehicle = data.response.length
        var oninitdata 
        this.totalgstreport = data.response
        oninitdata = data.response
      })
}

  onDatepickerClosed(): void {
    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
      this.LocalStoreService.getsparedatareport(startdate,enddate).subscribe(data=>{
        this.total_vehicle = data.response.length
        this.totalgstreport = data.response 
      })
    
  }

  sparereportexcel(){
    var startdate = this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
      this.LocalStoreService.sparereportexcel(startdate,enddate).subscribe(data=>{
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'spare_report.xlsx';
        document.body.appendChild(anchor);
        anchor.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
    
        console.log('Download successful');
      }, error => {
        console.error('Download error:', error);
      });

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



containsGspOrBsp(spares: any[]): boolean {
  return spares.some(spare => spare.spare.trim() === 'GSP' || spare.spare.trim() === 'bsp');
}



}
