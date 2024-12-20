import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LocalStoreService } from 'src/app/shared/services/local-store.service'; 
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'; 
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.scss'],
  providers: [DatePipe]

})
export class TechComponent implements OnInit {
 
  onintdate: Date = new Date();
  alltechnician: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  techspecificdata: any;
  techtable: boolean = false;
  totaltechdata: any;
  techname: any;
  techprofit = 0;
  techpackagedata = 0;
  techinvoiceamount = 0;
  sparestech = 0;
  totalSum: number;
  totalSumpackage: number;
  techinvoiceamountfinal: string;
  cardtechinvoiceamountfinal: string;
  alltechids: any[] = [];
  cardtotaltechdata: any;
  cardtechprofit: number;
  cardtechpackagedata: number;
  cardtechinvoiceamount: number;
  cardsparestech: number;

  constructor(
    private LocalStoreService: LocalStoreService,
    private ngbModel: NgbModal,
    private datePipe: DatePipe,
    private _adapter: DateAdapter<any>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this._adapter.setLocale('en');

    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');

    this.range = new FormGroup({
      start: new FormControl(formattedDate),
      end: new FormControl(formattedDate)
    });
    this.onclick();
    
  }



  onclick() {
    this.LocalStoreService.alltechnician().subscribe(data => {
      this.alltechnician = data.response;

      
      this.alltechnician.forEach(data => {
        this.alltechids.push(data._id);
      })


      this.alltechnician.forEach(tech => {
        tech.cardtechprofit = 0;
        tech.cardtechpackagedata = 0;
        tech.cardsparestech = 0;
        tech.cardtechinvoiceamountfinal = 0;
      });


      var startdate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')
      var enddate = this.datePipe.transform(this.onintdate,'yyyy-MM-dd')


      this.LocalStoreService.get_alltech_jobcard(this.alltechids, startdate, enddate, status).subscribe(data => {
        this.cardtotaltechdata = data.response;
    
        // Initialize totals for all technicians
        this.alltechnician.forEach(tech => {
          tech.cardtechprofit = 0;
          tech.cardtechpackagedata = 0;
          tech.cardsparestech = 0;
          tech.cardtechinvoiceamountfinal = 0;
        });
    
        // Group job cards by technician ID
        const jobCardsByTechnician = new Map();
    
        this.cardtotaltechdata.forEach(jobcard => {
          const technicianId = jobcard.technician._id;
          if (!jobCardsByTechnician.has(technicianId)) {
            jobCardsByTechnician.set(technicianId, []);
          }
          jobCardsByTechnician.get(technicianId).push(jobcard);
        });
    
        // Aggregate totals for each technician based on grouped data
        jobCardsByTechnician.forEach((jobCards, technicianId) => {
          let cardtechprofit = 0;
          let cardtechpackagedata = 0;
          let cardsparestech = 0;
          let cardtechinvoiceamount = 0;
    
          // Calculate totals for each job card
          jobCards.forEach(jobcard => {
            if (jobcard.invoice.package) {
              cardtechprofit += parseFloat(jobcard.invoice.fulllabours_total_amount) +
                parseFloat(jobcard.invoice.fulllabours_with_18_total);
            } else {
              cardtechprofit += parseFloat(jobcard.invoice.fulllabours_total_amount);
            }
    
            if (jobcard.invoice.package) {
              cardtechpackagedata += parseFloat(jobcard.invoice.package_total_amount) +
                parseFloat(jobcard.invoice.package_with_18_total);
            } else {
              cardtechpackagedata += parseFloat(jobcard.invoice.service_spare_totalamount);
            }
    
            if (jobcard.invoice.package) {
              cardsparestech += parseFloat(jobcard.invoice.fullspares_total_amount);
            } else {
              cardsparestech += parseFloat(jobcard.invoice.extraspare_total_amount);
            }
    
            cardtechinvoiceamount += parseFloat(jobcard.invoice.invoice_amount);
          });
    
          cardtechprofit = parseFloat(cardtechprofit.toFixed(2));
          cardtechpackagedata = parseFloat(cardtechpackagedata.toFixed(2));
          cardsparestech = parseFloat(cardsparestech.toFixed(2));
          const cardtechinvoiceamountfinal = cardtechinvoiceamount.toFixed(2);
    
          // Find the technician in the alltechnician array and update their totals
          const index = this.alltechnician.findIndex(tech => tech._id === technicianId); 
          if (index !== -1) {
            this.alltechnician[index].cardtechprofit += cardtechprofit;
            this.alltechnician[index].cardtechpackagedata += cardtechpackagedata;
            this.alltechnician[index].cardsparestech += cardsparestech;
            this.alltechnician[index].cardtechinvoiceamountfinal = (
              parseFloat(this.alltechnician[index].cardtechinvoiceamountfinal) + parseFloat(cardtechinvoiceamountfinal)
            ).toFixed(2);
          }
        });
    
        // Ensure final formatting of invoice amount for each technician
        this.alltechnician.forEach(tech => {
          tech.cardtechprofit = parseFloat(tech.cardtechprofit.toFixed(2));
          tech.cardtechpackagedata = parseFloat(tech.cardtechpackagedata.toFixed(2));
          tech.cardsparestech = parseFloat(tech.cardsparestech.toFixed(2));
          tech.cardtechinvoiceamountfinal = parseFloat(tech.cardtechinvoiceamountfinal).toFixed(2);
        });
    
        console.log('All technicians data:', this.alltechnician);
      });




    });
  }

  opentechniciandata(dataid, specifictechdata) {

    this.techinvoiceamountfinal = ''



    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

    this.techname = specifictechdata.firstname
    this.techspecificdata = dataid;

    this.techtable = true
    const status = "rangewise_techjobcard";
    this.LocalStoreService.gettechnician_jobcard(this.techspecificdata, startdate, enddate, status).subscribe(data => {
      this.totaltechdata = data.response
      console.log("in this content", this.totaltechdata);

      this.techprofit = 0
      this.techpackagedata = 0
      this.techinvoiceamount = 0
      this.sparestech = 0
      this.totaltechdata.forEach(techdatass => {
        if (techdatass.invoice.package) {
          this.techprofit += parseFloat(techdatass.invoice.fulllabours_total_amount) +
            parseFloat(techdatass.invoice.fulllabours_with_18_total);
        } else {
          this.techprofit += parseFloat(techdatass.invoice.fulllabours_total_amount);
        }
        this.techprofit = parseFloat(this.techprofit.toFixed(2));

        if (techdatass.invoice.package) {
          this.techpackagedata += parseFloat(techdatass.invoice.package_total_amount) + parseFloat(techdatass.invoice.package_with_18_total)
        } else {
          this.techpackagedata += parseFloat(techdatass.invoice.service_spare_totalamount)
        }
        this.techpackagedata = parseFloat(this.techpackagedata.toFixed(2));


        if (techdatass.invoice.package) {
          this.sparestech += parseFloat(techdatass.invoice.fullspares_total_amount)
        } else {
          this.sparestech += parseFloat(techdatass.invoice.extraspare_total_amount)
        }
        this.sparestech = parseFloat(this.sparestech.toFixed(2));
        this.techinvoiceamount += (parseFloat(techdatass.invoice.invoice_amount));
        this.techinvoiceamountfinal = this.techinvoiceamount.toFixed(2);
      })
    });
  }

  onDatepickerClosed(): void {

    this.techinvoiceamountfinal = ''


    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');
    const status = "rangewise_techjobcard";

    this.LocalStoreService.gettechnician_jobcard(this.techspecificdata, startdate, enddate, status).subscribe(data => {

      this.totaltechdata = data.response
      this.techprofit = 0
      this.techpackagedata = 0
      this.techinvoiceamount = 0
      this.sparestech = 0
      this.totaltechdata.forEach(techdatass => {
        if (techdatass.invoice.package) {
          this.techprofit += parseFloat(techdatass.invoice.fulllabours_total_amount) +
            parseFloat(techdatass.invoice.fulllabours_with_18_total);
        } else {
          this.techprofit += parseFloat(techdatass.invoice.fulllabours_total_amount);
        }

        this.techprofit = parseFloat(this.techprofit.toFixed(2));

        if (techdatass.invoice.package) {
          this.techpackagedata += parseFloat(techdatass.invoice.package_total_amount) + parseFloat(techdatass.invoice.package_with_18_total)
        } else {
          this.techpackagedata += parseFloat(techdatass.invoice.service_spare_totalamount)
        }
        this.techpackagedata = parseFloat(this.techpackagedata.toFixed(2));

        if (techdatass.invoice.package) {
          this.sparestech += parseFloat(techdatass.invoice.fullspares_total_amount)
        } else {
          this.sparestech += parseFloat(techdatass.invoice.extraspare_total_amount)
        }
        this.sparestech = parseFloat(this.sparestech.toFixed(2));
        this.techinvoiceamount += (parseFloat(techdatass.invoice.invoice_amount));
        this.techinvoiceamountfinal = this.techinvoiceamount.toFixed(2);
      })
    });



    //testing to show the data in the card


    this.LocalStoreService.get_alltech_jobcard(this.alltechids, startdate, enddate, status).subscribe(data => {
      this.cardtotaltechdata = data.response;
  
      // Initialize totals for all technicians
      this.alltechnician.forEach(tech => {
        tech.cardtechprofit = 0;
        tech.cardtechpackagedata = 0;
        tech.cardsparestech = 0;
        tech.cardtechinvoiceamountfinal = 0;
      });
  
      // Group job cards by technician ID
      const jobCardsByTechnician = new Map();
  
      this.cardtotaltechdata.forEach(jobcard => {
        const technicianId = jobcard.technician._id;
        if (!jobCardsByTechnician.has(technicianId)) {
          jobCardsByTechnician.set(technicianId, []);
        }
        jobCardsByTechnician.get(technicianId).push(jobcard);
      });
  
      // Aggregate totals for each technician based on grouped data
      jobCardsByTechnician.forEach((jobCards, technicianId) => {
        let cardtechprofit = 0;
        let cardtechpackagedata = 0;
        let cardsparestech = 0;
        let cardtechinvoiceamount = 0;
  
        // Calculate totals for each job card
        jobCards.forEach(jobcard => {
          if (jobcard.invoice.package) {
            cardtechprofit += parseFloat(jobcard.invoice.fulllabours_total_amount) +
              parseFloat(jobcard.invoice.fulllabours_with_18_total);
          } else {
            cardtechprofit += parseFloat(jobcard.invoice.fulllabours_total_amount);
          }
  
          if (jobcard.invoice.package) {
            cardtechpackagedata += parseFloat(jobcard.invoice.package_total_amount) +
              parseFloat(jobcard.invoice.package_with_18_total);
          } else {
            cardtechpackagedata += parseFloat(jobcard.invoice.service_spare_totalamount);
          }
  
          if (jobcard.invoice.package) {
            cardsparestech += parseFloat(jobcard.invoice.fullspares_total_amount);
          } else {
            cardsparestech += parseFloat(jobcard.invoice.extraspare_total_amount);
          }
  
          cardtechinvoiceamount += parseFloat(jobcard.invoice.invoice_amount);
        });
  
        cardtechprofit = parseFloat(cardtechprofit.toFixed(2));
        cardtechpackagedata = parseFloat(cardtechpackagedata.toFixed(2));
        cardsparestech = parseFloat(cardsparestech.toFixed(2));
        const cardtechinvoiceamountfinal = cardtechinvoiceamount.toFixed(2);
  
        // Find the technician in the alltechnician array and update their totals
        const index = this.alltechnician.findIndex(tech => tech._id === technicianId); 
        if (index !== -1) {
          this.alltechnician[index].cardtechprofit += cardtechprofit;
          this.alltechnician[index].cardtechpackagedata += cardtechpackagedata;
          this.alltechnician[index].cardsparestech += cardsparestech;
          this.alltechnician[index].cardtechinvoiceamountfinal = (
            parseFloat(this.alltechnician[index].cardtechinvoiceamountfinal) + parseFloat(cardtechinvoiceamountfinal)
          ).toFixed(2);
        }
      });
  
      // Ensure final formatting of invoice amount for each technician
      this.alltechnician.forEach(tech => {
        tech.cardtechprofit = parseFloat(tech.cardtechprofit.toFixed(2));
        tech.cardtechpackagedata = parseFloat(tech.cardtechpackagedata.toFixed(2));
        tech.cardsparestech = parseFloat(tech.cardsparestech.toFixed(2));
        tech.cardtechinvoiceamountfinal = parseFloat(tech.cardtechinvoiceamountfinal).toFixed(2);
      });
  
      console.log('All technicians data:', this.alltechnician);
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

  calculatetotalWith18(packageTotal: string, packageWith18Total: string): string {
    const total = parseFloat(packageTotal) + parseFloat(packageWith18Total);
    return total.toFixed(2);
  }


  techreport_excel() {

    var startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd')
    var enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd')

    var status = "rangewise_techjobcard"
    this.LocalStoreService.gettechnician_jobcard(this.techspecificdata, startdate, enddate, status).subscribe(data => {


      let techprofit
      let techpackagedata
      // this.techinvoiceamount = 0
      let sparestech

      var obj = {}
      let estimatedata
      let vehicleno
      let vehiclebrand
      let vehiclemodel
      let estimatespares
      let invoicedata
      var afteroct_customers = [];
      var alldata = data.response
      alldata.forEach(data => {
        if (data.estimate) {
          estimatedata = data.estimate.estimate_amount
        } else {
          estimatedata = "Not Estimated"
        }
        if (data.invoice) {
          invoicedata = data.invoice.invoice_amount
        } else {
          invoicedata = "Not Invoiced"
        }

        if (data.invoice.package) {
          techprofit = parseFloat(data.invoice.fulllabours_total_amount) +
            parseFloat(data.invoice.fulllabours_with_18_total);
          techpackagedata = parseFloat(data.invoice.package_total_amount) + parseFloat(data.invoice.package_with_18_total)
          sparestech = parseFloat(data.invoice.fullspares_total_amount)
        } else {
          techprofit = parseFloat(data.invoice.fulllabours_total_amount);
          techpackagedata = parseFloat(data.invoice.service_spare_totalamount)
          sparestech = parseFloat(data.invoice.extraspare_total_amount)
        }
        data.customers.forEach(data2 => {
          data.vehicledetails.forEach(data3 => {
            vehicleno = data3.vh_number,
              vehiclebrand = data3.brand
            vehiclemodel = data3.model
          })
          let emptydata
          let emptydata2
          obj = {
            "Inv Date": this.datePipe.transform(data.invoice.date, 'dd-MM-yyyy'),
            "Customer": data2.name,
            "Mobile": data2.mobile,
            "Veh No": vehicleno,
            "Brand": vehiclebrand,
            "Model": vehiclemodel,
            "Package": techpackagedata,
            "labour": techprofit,
            "spare": sparestech,
            "Estimate": estimatedata,
            "Invoice": invoicedata,
            "": emptydata,
          }
        })
        afteroct_customers.push(obj)
      })
      var finame = "inv-report"
      this.LocalStoreService.exportAsmonthlyreport_data(afteroct_customers, finame)

    })

  }


}
