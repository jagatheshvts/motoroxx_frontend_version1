import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-brandandmodel',

  templateUrl: './brandandmodel.component.html',
  styleUrl: './brandandmodel.component.scss'
})
export class BrandandmodelComponent implements OnInit {


  bikeTypes = ['Disel', 'CNG', 'Petrol'];

  bikemodelprize: any = {};
  brandKeys: string[] = [];
  carbrandKeys: string[] = [];
  branddata: any;

  brandDetailsForm: FormGroup;
  brandfullbikes: any;
  selectedbrand: any;
  updatedialogref: any
  objectKeys = Object.keys;


  //testing
  gspRegularPriceChecked: boolean = false;
  gspOffer1Checked: boolean = false;
  gspOffer2Checked: boolean = false;
  bspRegularPriceChecked: boolean = false;
  bspOffer1Checked: boolean = false;
  bspOffer2Checked: boolean = false;

  gspheading: any;
  bspheading: any;
  totalbikeslength: any;
  addbikespopup: any;
  bikename: any;
  gsp: any;
  bsp: any;
  bikeprizedatapage: any;
  brandIndex: any;
  gradeflag: string;
  addbrandpopup: any;
  oilarraydata: any;
  oilbrand: any;
  superadmin: any;
  bikebrand: any
  carbikemodelprize: any;
  brandaddingfor:any;
  addbranddialog: any;

  constructor(private LocalStoreService: LocalStoreService, private dialog: MatDialog, private fb: FormBuilder, private ngbModel: NgbModal) {


  }

  ngOnInit(): void {



    this.superadmin  = localStorage.getItem('creater_superadmin')

    console.log("the inside the superadmin",this.superadmin)


    this.LocalStoreService.getoilrates().subscribe(oildata => {

      this.oilarraydata = oildata.response.oilbrands

      console.log("the data of the oilarraydata", this.oilarraydata)

    })
    this.getmodelprizes()
    this.getcarbrandprizes()
  }

  //original
  getmodelprizes() {

    this.LocalStoreService.getbrandmodelprizes().subscribe(data => {

      this.bikemodelprize = data.response[0].vehicles[0]

      this.brandKeys = Object.keys(this.bikemodelprize).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v' );

      console.log("data data of the specific key value", data)

    })

  }

  getcarbrandprizes(){

    this.LocalStoreService.getcarbrandmodelprizes().subscribe(data => {

      this.carbikemodelprize = data.response[0]

      this.carbrandKeys = Object.keys(this.carbikemodelprize).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v' );

      console.log("data data of the specific key value", data)

    })

  }

  openBrandDetailsDialog(brand, bikeprizedatapage) {

    this.selectedbrand = brand
    this.bikeprizedatapage = bikeprizedatapage
    this.branddata = this.bikemodelprize[brand]
    this.brandfullbikes = Object.values(this.branddata.bikespackage);
    this.brandfullbikes.forEach(data => {
      this.gspRegularPriceChecked = data.gsp.regularprizeselected
      this.gspOffer1Checked = data.gsp.offer1Selected
      this.gspOffer2Checked = data.gsp.offer2Selected
      this.bspRegularPriceChecked = data.bsp.regularprizeselected
      this.bspOffer1Checked = data.bsp.offer1Selected
      this.bspOffer2Checked = data.bsp.offer2Selected
      if (!data.capacity) {
        data.capacity = 0
      }
      if (!data.gsp.withoutoil) {
        data.gsp.withoutoil = 0
      }
      if (!data.bsp.withoutoil) {
        data.bsp.withoutoil = 0
      }
      if (!data.type) {
        data.type = [
          {
            "varient": "DIESEL"
          },
          {
            "varient": "PETROL"
          },
          {
            "varient": "CNG"
          }
        ]
      }

      if (!data.qty) {
        data.qty = [
          {
            "capacity": "1"
          },
          {
            "capacity": "1.5"
          },
          {
            "capacity": "2"
          },
          {
            "capacity": "2.5"
          }
        ]
      }
    })

    console.log("the data of branddata", this.brandfullbikes.length)
    this.totalbikeslength = this.brandfullbikes.length
    this.updatedialogref = this.ngbModel.open(bikeprizedatapage, {
      size: 'xl',
      // backdrop: false
    })
  }


  onTypeChange(type, index) {
    this.brandfullbikes[index].type = type
    console.log("the data after selecting type", this.brandfullbikes)
    console.log("the data after selecting type", type)
  }

  closeupdatepopup() {
    this.updatedialogref.close()
    this.getmodelprizes()
  }


  openupdatedBrandDetailsDialog(brand, updatedpackagespage) {


    this.getmodelprizes()
    console.log("the data the clicked brandname", this.bikemodelprize[brand])
    this.branddata = this.bikemodelprize[brand]
    this.brandfullbikes = Object.values(this.branddata.bikespackage);
    console.log("the data of branddata", this.brandfullbikes)

    this.brandfullbikes.forEach(data => {

      if (data.gsp.regularprizeselected) {
        this.gspheading = "GSP Regular";
      } else if (data.gsp.offer1Selected) {
        this.gspheading = "GSP OFFER1";
      } else if (data.gsp.offer2Selected) {
        this.gspheading = "GSP OFFER2";
      }

      if (data.bsp.regularprizeselected) {
        this.bspheading = "BSP Regular";
      } else if (data.bsp.offer1Selected) {
        this.bspheading = "BSP Offer1";
      } else if (data.bsp.offer2Selected) {
        this.bspheading = "BSP Offer2";
      }


    })
    this.dialog.open(updatedpackagespage, {
      maxHeight: '100vh',
      width: '60%',
      disableClose :true
    })

  }


  updatedprizedetails() {
    console.log("the brand selected", this.selectedbrand)
    console.log("the updated data in the brandfullbikes", this.brandfullbikes)
    // return;
    for (const bike of this.brandfullbikes) {
      if (bike.gsp.regularprizeselected) {
        console.log("the data in the gsp offer1", bike.gsp.offer1)
        bike.gsp.offerselectedvalue = bike.gsp.regularprice;
      }
      if (bike.gsp.offer1Selected) {
        bike.gsp.offerselectedvalue = bike.gsp.offer1;
      }
      if (bike.gsp.offer2Selected) {
        bike.gsp.offerselectedvalue = bike.gsp.offer2;

      }
      if (bike.bsp.regularprizeselected) {
        bike.bsp.offerselectedvalue = bike.bsp.regularprice;
      }
      if (bike.bsp.offer1Selected) {
        bike.bsp.offerselectedvalue = bike.bsp.offer1;
      }
      if (bike.bsp.offer2Selected) {
        bike.bsp.offerselectedvalue = bike.bsp.offer2;

      }

    }
    // return
    this.LocalStoreService.updateprizedata(this.selectedbrand, this.brandfullbikes,).subscribe(data => {
      this.closeupdatepopup()
    })


  }



  handleCheckboxChangegsp(gsp, checkboxType) {
    if (gsp[checkboxType]) {
      // If the current checkbox is checked, uncheck the other checkboxes
      for (const key in gsp) {
        if (key !== checkboxType && typeof gsp[key] === 'boolean') {
          gsp[key] = false;
        }
      }
    }
  }

  handleCheckboxChangebsp(bsp, checkboxType) {
    if (bsp[checkboxType]) {
      // If the current checkbox is checked, uncheck the other checkboxes
      for (const key in bsp) {
        if (key !== checkboxType && typeof bsp[key] === 'boolean') {
          bsp[key] = false;
        }
      }
    }
  }
  //originalend


  //testing
  toggleGroup(group: string, type: string) {
    if (group === 'gsp') {
      for (const bike of this.brandfullbikes) {
        if (type === 'RegularPrice') {
          bike.gsp.regularprizeselected = true;

          //testing
          this.gspRegularPriceChecked = true;
          this.gspOffer1Checked = false;
          this.gspOffer2Checked = false;

          //testing end
          bike.gsp.offer1Selected = false;
          bike.gsp.offer2Selected = false;
        } else if (type === 'Offer1') {
          bike.gsp.regularprizeselected = false;
          //testing
          this.gspRegularPriceChecked = false;
          this.gspOffer1Checked = true;
          this.gspOffer2Checked = false;

          //testing end
          bike.gsp.offer1Selected = true;
          bike.gsp.offer2Selected = false;
        } else if (type === 'Offer2') {
          bike.gsp.regularprizeselected = false;
          //testing
          this.gspRegularPriceChecked = false;
          this.gspOffer1Checked = false;
          this.gspOffer2Checked = true;

          //testing end
          bike.gsp.offer1Selected = false;
          bike.gsp.offer2Selected = true;
        }
      }
    } else if (group === 'bsp') {
      for (const bike of this.brandfullbikes) {
        if (type === 'RegularPrice') {
          bike.bsp.regularprizeselected = true;
          //testing
          this.bspRegularPriceChecked = true;
          this.bspOffer1Checked = false;
          this.bspOffer2Checked = false;
          //testing end
          bike.bsp.offer1Selected = false;
          bike.bsp.offer2Selected = false;
        } else if (type === 'Offer1') {
          bike.bsp.regularprizeselected = false;
          //testing
          this.bspRegularPriceChecked = false;
          this.bspOffer1Checked = true;
          this.bspOffer2Checked = false;
          //testingend

          bike.bsp.offer1Selected = true;
          bike.bsp.offer2Selected = false;
        } else if (type === 'Offer2') {
          bike.bsp.regularprizeselected = false;
          //testing
          this.bspRegularPriceChecked = false;
          this.bspOffer1Checked = false;
          this.bspOffer2Checked = true;
          //testingend
          bike.bsp.offer1Selected = false;
          bike.bsp.offer2Selected = true;
        }
      }
    }
  }

  addbikes_popup(addbikespage) {

    this.addbikespopup = this.ngbModel.open(addbikespage, {
      size: 'sm'
    })

  }

  update_addbikes() {

    this.addbikespopup.close()
    this.LocalStoreService.addingbikes(this.selectedbrand, this.bikename, this.totalbikeslength, this.gsp, this.bsp, this.gspRegularPriceChecked,
      this.gspOffer1Checked, this.gspOffer2Checked, this.bspRegularPriceChecked, this.bspOffer1Checked, this.bspOffer2Checked
    ).subscribe(data => {

      this.getmodelprizes()

      this.closeupdatepopup()

      // this.openBrandDetailsDialog(this.selectedbrand,this.bikeprizedatapage)



      // this.branddata = this.bikemodelprize[this.selectedbrand]
      // this.brandfullbikes = Object.values(this.branddata.bikespackage);
      // this.brandfullbikes.forEach(data=>{

      //   this.gspRegularPriceChecked = data.gsp.regularprizeselected
      //   this.gspOffer1Checked = data.gsp.offer1Selected
      //   this.gspOffer2Checked = data.gsp.offer2Selected
      //   this.bspRegularPriceChecked = data.bsp.regularprizeselected
      //   this.bspOffer1Checked = data.bsp.offer1Selected
      //   this.bspOffer2Checked = data.bsp.offer2Selected

      // })

      // this.dialog.open(this.bikeprizedatapage, {
      //   maxHeight: '100vh'
      // })

    })


  }

  addoilbrand_popup(addbrandpage, brandIndex, flag: string) {

    this.gradeflag = flag

    this.brandIndex = brandIndex;
    this.addbrandpopup = this.ngbModel.open(addbrandpage, {
      size: 'sm'
    })
  }


  updateoilbrand() {
    // let brand = this.selectedbrand.


    let brand = ['mineral', 'synthetic', 'semisynthetic']

    brand.forEach(data => {
      let allloopbrand = data
      this.oilarraydata[0][allloopbrand].brand[this.oilbrand] = {
        "10W-40": 0,
        "15W-50": 0,
        "20W-50": 0,
        "5W-30": 0,
        "80W-90": 0,
        "10W-30": 0,
        "10W-50": 0,
        "10W-60": 0,
      }
    })

    this.LocalStoreService.updateoilrates(this.oilarraydata).subscribe(data => {

      this.addbrandpopup.close()


    })





  }

  closeoilupdatepopup() {
    this.updatedialogref.close()
    this.getmodelprizes()


  }

  updateoilprizedetails() {

    console.log("all data of the oilarray", this.oilarraydata)

    this.LocalStoreService.updateoilrates(this.oilarraydata).subscribe(data => {
      this.closeoilupdatepopup()
    })
  }


  updateRecommendation(data: any, recommendation: string, checked: boolean) {

    Object.keys(data.recommend).forEach(key => {
      if (key !== recommendation) {
        data.recommend[key] = false;
      }
    });
    data.recommend[recommendation] = checked;
  }



  openoilDetailsDialog(oilprizedatapage) {


    // this.selectedbrand = brand
    this.bikeprizedatapage = oilprizedatapage

    // console.log("the data of brand name while clikciking the card", brand)

    // console.log("the data the clicked brandname", this.bikemodelprize[brand])
    // this.branddata = this.bikemodelprize[brand]
    // this.brandfullbikes = Object.values(this.branddata.bikespackage);
    // this.brandfullbikes.forEach(data => {

    //   this.gspRegularPriceChecked = data.gsp.regularprizeselected
    //   this.gspOffer1Checked = data.gsp.offer1Selected
    //   this.gspOffer2Checked = data.gsp.offer2Selected
    //   this.bspRegularPriceChecked = data.bsp.regularprizeselected
    //   this.bspOffer1Checked = data.bsp.offer1Selected
    //   this.bspOffer2Checked = data.bsp.offer2Selected

    //   if(!data.capacity){
    //     data.capacity = 0
    //   }

    //   if (!data.mineral) {
    //     data.mineral = {
    //       "brand": {
    //         motal: {
    //           "w120": 200,
    //           "w220": 200,
    //           "w320": 200
    //         },
    //         gulf: {
    //           "w120": 200,
    //           "w220": 200,
    //           "w320": 200
    //         }, 
    //         crystal: {
    //           "w120": 200,
    //           "w220": 200,
    //           "w320": 200
    //         }

    //       }
    //     }
    //   }

    //   if (!data.synthetic) {
    //     data.synthetic = {
    //       "brand": {
    //         motal: {
    //           "w120": 200,
    //           "w220": 200,
    //           "w320": 200
    //         },
    //         gulf: {
    //           "w120": 200,
    //           "w220": 200,
    //           "w320": 200
    //         },
    //         crystal: {
    //           "w120": 200,
    //           "w220": 200,
    //           "w320": 200
    //         }

    //       }
    //     }
    //   }

    //   if (!data.semisynthetic) {
    //     data.semisynthetic = {
    //       "brand": {
    //         Motul: {
    //           "10W-40": 0,
    //           "15W-50": 0,
    //           "20W-50": 0,
    //           "5W-30": 0,
    //           "80W-90": 0,
    //           "10W-30": 0,
    //           "10W-50": 0,
    //           "10W-60": 0,
    //         },
    //         Castrol: {
    //           "10W-40": 0,
    //           "15W-50": 0,
    //           "20W-50": 0,
    //           "5W-30": 0,
    //           "80W-90": 0,
    //           "10W-30": 0,
    //           "10W-50": 0,
    //           "10W-60": 0,
    //         },
    //         Repsol: {
    //           "10W-40": 0,
    //           "15W-50": 0,
    //           "20W-50": 0,
    //           "5W-30": 0,
    //           "80W-90": 0,
    //           "10W-30": 0,
    //           "10W-50": 0,
    //           "10W-60": 0,
    //         }

    //       }
    //     } 
    //   }

    //   })

    // this.totalbikeslength = this.brandfullbikes.length
    this.updatedialogref = this.ngbModel.open(oilprizedatapage, {
      size: 'xl',
      windowClass: 'custom-modal'
    })
  }

  addbrand(vehicle,brandpage){

    this.brandaddingfor = vehicle

    console.log("the brand adding for",this.brandaddingfor)

  this.addbranddialog = this.ngbModel.open(brandpage,{

        size: 'sm',
      windowClass: 'custom-modal'

    })

  }

  submitbrand(){
    this.LocalStoreService.addvehiclebrand(this.bikebrand,this.brandaddingfor).subscribe(data=>{
      this.closedialog()
    })
  }


  closedialog(){

    this.addbranddialog.close()

  }

}
