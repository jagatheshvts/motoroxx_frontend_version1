import { Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/shared/services/auth.gaurd';





@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.scss',
  providers: [DatePipe],
})
export class JobcardComponent implements OnInit, CanComponentDeactivate  {
  @ViewChildren('modelItem') modelItems!: QueryList<ElementRef>;
  @ViewChildren('brandItem') brandItems!: QueryList<ElementRef>;

  canDeactivate(): boolean {
    return confirm('Are you sure you want to navigate to another screen?');
  }


  selectedmodelname: string = '';
  showmodelDropdown: boolean = false;
  selectedModelIndex: number = -1; // Track the index of the currently selected model

  seletedbrand_model: any[] = []; // List of models for the selected brand
  branddata_full: any = {};  // Full data structure
  selectedModelpackage: any; // To hold the selected model package
  isSidebarOpen = false;
  isSidebarOpen_multiinvoice = false;

  bikebrandfor_slider: any;
  bikemodelfor_slider: any;
  vehicleNumberfor_slider: any;
  invoiceNum: any;
  invoiceDate: any;
  invoiceAmount: any;
  index_veh_data: any = [];
  index_for_slider: any = 0;
  carddata_fortable: any = [];
  carddata_forcomplaints: any = [];
  vehicleId: string = '';
  multiinvoicehistory_clicked: any;

  del1: any;
  del2: any;
  delivery: any;
range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });

  searchType: string = 'mobile';
  isGSTChecked: boolean = false;
  editflag_userId: any;
  editflag_jobCardId: any;
  updateuserid: any;
  updatejobid: any;
  addcolour: any;
  addcolorpopup: any;
  isProceedClicked = false;



  getModels() {
    this.LocalStoreService.get_brandmodel_forinventory().subscribe(data => {
      const brandData = data.response.vehicles[0];
      this.seletedbrand_model = brandData[this.selectedBrandName].bikespackage;
    });
  }

  selectmodel(model: any) {
    this.selectedmodelname = model.bikename;
    const brandData = this.branddata_full[this.selectedBrandName];
    this.selectedModelpackage = brandData.bikespackage.find(
      (bike) => bike.bikename.toLowerCase() === this.selectedmodelname.toLowerCase()
    );
    console.log("Selected model package:", this.selectedModelpackage);
    this.showmodelDropdown = false; // Close the dropdown after selection
  }

  onModelKeyDown(event: KeyboardEvent) {
    const key = event.key;

    if (key === 'ArrowDown') {
      this.selectedModelIndex = (this.selectedModelIndex + 1) % this.seletedbrand_model.length; // Move down
      this.scrollToActiveItem();
    } else if (key === 'ArrowUp') {
      this.selectedModelIndex = (this.selectedModelIndex - 1 + this.seletedbrand_model.length) % this.seletedbrand_model.length; // Move up
      this.scrollToActiveItem();
    } else if (key === 'Enter' && this.selectedModelIndex >= 0) {
      this.selectmodel(this.seletedbrand_model[this.selectedModelIndex]); // Select the model when Enter is pressed
    }
  }

  scrollToActiveItem() {
    const activeItem = this.modelItems.toArray()[this.selectedModelIndex];
    if (activeItem) {
      activeItem.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  scrollToActiveItem_brand() {
    const activeItem = this.brandItems.toArray()[this.selectedIndex];
    if (activeItem) {
      activeItem.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }



  toggleOdoMeter() {
    this.odoMeter = !this.odoMeter;
  }

  toggleGeneralService() {
    this.generalService = !this.generalService;
  }

  selectedBrandName: string = '';
  showDropdown: boolean = false;
  selectedIndex: number = -1; // Track the index of the currently selected brand

  branddata: string[] = [];


  getBrands() {
    this.LocalStoreService.get_brandmodel_forinventory().subscribe(data => {
      if (this.singlebrand) {
        this.selectedBrandName = this.garage_brandtype;
        this.branddata_full = data.response.vehicles[0];
        this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;
        this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v');
      } else {
        this.branddata_full = data.response.vehicles[0];
        this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v');
      }
    });
  }

  selectBrand(brand: string) {
    this.selectedBrandName = brand;
    this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;
    this.showDropdown = false; // Hide dropdown after selection
  }

  onKeyDown(event: KeyboardEvent) {
    const key = event.key;

    // Handle keyboard navigation
    if (key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % this.branddata.length; // Move down
      this.scrollToActiveItem_brand()
    } else if (key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + this.branddata.length) % this.branddata.length; // Move up
      this.scrollToActiveItem_brand()
    } else if (key === 'Enter' && this.selectedIndex >= 0) {
      this.selectBrand(this.branddata[this.selectedIndex]); // Select the brand when Enter is pressed
      // this.scrollToActiveItem_brand()
    }
  }

  location: string = '';
  locationOptions: string[] = [];
  showlocationdropdown: boolean = false;
  activeIndex: number = -1;



  getlocation() {
    this.LocalStoreService.getlocations().subscribe((data) => {
      this.locationOptions = data.response['locations'];
      console.log('The data inside the location option', this.locationOptions);
    });
  }

  toggleLocationDropdown(): void {
    this.showlocationdropdown = !this.showlocationdropdown;
    if (this.showlocationdropdown) {
      this.activeIndex = -1; // Reset active index when dropdown is toggled
    }
  }

  hidlocationDropdown(): void {
    setTimeout(() => (this.showlocationdropdown = false), 400);
  }

  handleDropdownKeydown(event: KeyboardEvent): void {
    if (this.showlocationdropdown) {
      if (event.key === 'ArrowDown') {
        // Move focus to the next option
        this.activeIndex = (this.activeIndex + 1) % this.locationOptions.length;
        event.preventDefault(); // Prevent default scrolling
      } else if (event.key === 'ArrowUp') {
        // Move focus to the previous option
        this.activeIndex =
          (this.activeIndex - 1 + this.locationOptions.length) %
          this.locationOptions.length;
        event.preventDefault();
      } else if (event.key === 'Enter' && this.activeIndex !== -1) {
        this.selectLocation(this.locationOptions[this.activeIndex]);
        event.preventDefault();
      } else if (event.key === 'Escape') {
        this.showlocationdropdown = false;
      }
    }
  }

  selectLocation(option: string): void {
    this.location = option;
    console.log('Selected option:', option);
    this.showlocationdropdown = false;
  }





  jobcardobj = {
    mobile: "",
    name: "",
    gstnumber: "",
    gstname: ""


  }

  vehiclenumber = {
    vehicleState: "TN",
    vehicleDistrict: "",
    vehicleCity: "",
    vehicleNumber: ""
  }

  modelcolor: any = "";

  // location: any = ""
  odoMeter: boolean = false;


  isChecked: boolean = true;
  generalService: boolean = false;



  newComplaint: any;

  adddedComplaints: any[] = [];


  // locationOptions = [
  //   'Velachery',
  //    'Tambaram', 
  //    'Ramapuram'
  //   ]

  listColors = [];

  // listColors = [
  //   'Blue',
  //   'Black',
  //   'Green',
  //   'Grey',
  //   'Orange',
  //   'Pink',
  //   'Red',
  //   'White',
  //   'Yellow'
  // ];

  singlebrand: boolean = false;
  garage_brandtype: any;
  // selectedBrandName: any;
  // branddata_full: any;
  // seletedbrand_model: any;
  // branddata: any[] = [];
  // selectedmodelname: any;
  // showmodelDropdown: boolean;
  // showDropdown: boolean;
  vehcilehistorydata: any;
  selectedvehcileid: any;
  // selectedModelpackage: any;
  odometerreading: any = "";
  complaintsarray_db: any = [];
  typeofservice: any;
  formattedComplaintsstringy: string;
  remarks: any = "";
  inventory_things: boolean = false;
  addmodelpopup: any;
  addmodel: any;
  vehiclehistory_popup: any;
  // locationOptions: any;
  // showDropdownlocation: boolean;
  // showlocationdropdown: boolean;
  genralservice_boolean: boolean = false;
  advisor: any = ""
  technician: any = [];
  editflag: any


  constructor(private LocalStoreService: LocalStoreService, private ngbModel: NgbModal, private toastr: ToastrService, private activateroute: ActivatedRoute,private router: Router,private datePipe: DatePipe) {


  }




  ngOnInit(): void {


    this.from_editjobcardnavigate()


    console.log("the data inside the vehcile id", this.selectedvehcileid)

    this.onintbranchdata()
    this.getBrands()
    this.getlocation()
    this.loadtechniciandata()
    this.getvehicle_colours()
  }


  getvehicle_colours(){

    this.LocalStoreService.getvehcilecolours().subscribe(data=>{

      console.log("the data inside the vehicle colours",data)
      this.listColors = data.response['colours']


    })

  }


  from_editjobcardnavigate() {

    this.activateroute.queryParams.subscribe(params => {
      this.editflag = params['flag'] || 'default'; // Set a default value if 'flag' is undefined
      this.editflag_userId = params['userId'] || 'default'; // Set a default value if 'flag' is undefined
      this.editflag_jobCardId = params['jobCardId'] || 'default'; // Set a default value if 'flag' is undefined
      console.log("the flag for the jobcard function", this.editflag);  // "edit" or "default"
    });


    this.checkvehicles("empty");

  }





  // selectLocation(option: string) {
  //   this.location = option; 
  //   console.log(option);
  //   this.showlocationdropdown = !this.showlocationdropdown;

  // }

  generateCID() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let cid = "";

    // Create 4 random groups of 4 characters
    for (let i = 0; i < 4; i++) {
      let segment = "";
      for (let j = 0; j < 4; j++) {
        segment += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      cid += segment + (i < 3 ? "-" : ""); // Add a dash between groups
    }

    return cid;
  }


  addComplaint() {
    if (!this.newComplaint.trim()) {
      alert('Please enter a complaint.');
      return;
    }
    this.adddedComplaints.unshift(this.newComplaint.trim());
    console.log("the data iniside the", this.adddedComplaints)

    const formattedComplaints = [];

    // this.adddedComplaints.forEach((complaint, index) => {
    //   const complaintObject = {
    //     c_id: this.generateCID(),
    //     [`complaint ${index + 1}`]: complaint,
    //     value: complaint
    //   };
    //   formattedComplaints.push(complaintObject);

    //   this.formattedComplaintsstringy = JSON.stringify(formattedComplaints)

    // });

    this.updateFormattedComplaints();
    this.newComplaint = '';
  }


  updateFormattedComplaints() {
    const formattedComplaints = this.adddedComplaints.map((complaint, index) => ({
        c_id: this.generateCID(),
        [`complaint ${index + 1}`]: complaint,
        value: complaint
    }));

    this.formattedComplaintsstringy = JSON.stringify(formattedComplaints);
}

  removeComplaint(index: number) {
    this.adddedComplaints.splice(index, 1);
    this.updateFormattedComplaints();
  }


  editIndex: number | null = null;
  editComplaintText: string = '';

  editComplaint(index: number, complaint: string) {
    this.editIndex = index;
    this.editComplaintText = complaint;
}

saveComplaint(index: number) {
    if (!this.editComplaintText.trim()) {
        alert("Complaint cannot be empty.");
        return;
    }
    this.adddedComplaints[index] = this.editComplaintText.trim();
    this.editIndex = null;
    this.editComplaintText = '';

    this.updateFormattedComplaints();
}


  isClicked: string | null = null;

  onButtonClick(button: string) {
    this.isClicked = button;  // Set the clicked button ('GSP' or 'BSP')
    console.log(button);
  }


  fuelLevel: number = 0;

  fuelAmount: number = 0;
  // slidervalue: number = 50;
  calculateFuel(value: number) {
    console.log(`Fuel Amount: ${value}%`);

  }

  savejobcard() {


    console.log('the data inside the ', this.vehiclenumber.vehicleCity)

    let vh_number =
      (this.vehiclenumber.vehicleState || "") +
      "-" +
      (this.vehiclenumber.vehicleDistrict || "") +
      "-" +
      (this.vehiclenumber.vehicleCity || "") +
      "-" +
      (this.vehiclenumber.vehicleNumber || "");


    console.log('the data inside the merged vh number ', vh_number)
    console.log('the data inside the merged model ', this.selectedBrandName)
    console.log('the data inside the merged brand ', this.selectedmodelname)
    console.log('the data inside the  brand color', this.modelcolor)
    console.log("the odometer reading", this.odoMeter)

    let odometervalue
    if (this.odoMeter == true || this.odometerreading == "") {
      odometervalue = "Odometer not working"
    } else {
      odometervalue = this.odometerreading
    }

    let genralservicecheck
    let gs_selected_option_index
    if (this.generalService == true) {
      genralservicecheck = "1"
      gs_selected_option_index = "0"
    } else {
      genralservicecheck = "0"
      gs_selected_option_index = "0"

    }

    const brandData = this.branddata_full[this.selectedBrandName];

    this.selectedModelpackage = brandData.bikespackage.find(
      (bike) => bike.bikename.toLowerCase() === this.selectedmodelname.toLowerCase()
    );

    let selectedamount = this.selectedModelpackage.gsp.offerselectedvalue

    const gs_selected_amount = `${selectedamount}, GSP`;


    const delivery = {
      del1: this.del1 || null,
      del2: this.del2 || null,
    };
    this.isProceedClicked = true;
    // const deliveryinstatus = 
    const deliveryin = this.isProceedClicked;
    console.log("the data inside the delivery",delivery);
    console.log("the data inside the delivery",deliveryin)



    // return
    this.LocalStoreService.postcustomer(this.jobcardobj, this.location).subscribe(async (customerdata) => {

      console.log("the full data of the customer", customerdata)
      let userid = customerdata.userid

      this.LocalStoreService.addvehicle(userid, this.jobcardobj, vh_number, this.selectedBrandName, this.selectedmodelname, this.vehiclenumber, this.modelcolor, this.selectedvehcileid, this.selectedModelpackage).subscribe(vehciledata => {

        console.log("the addvehicle vehcile data", vehciledata)

        this.LocalStoreService.addjobcard(vehciledata._id, odometervalue, this.fuelAmount, genralservicecheck, this.selectedModelpackage, this.formattedComplaintsstringy,
          this.jobcardobj.mobile, userid, this.remarks, gs_selected_option_index, gs_selected_amount, this.advisor ,delivery, deliveryin
        ).subscribe(jobcarddata => {

          this.toastr.success('jobcard added sucessfully!', 'Success!', { timeOut: 3000 });

          this.jobcardobj.mobile = "",
            this.jobcardobj.name = "",
            this.location = "",
            this.vehiclenumber.vehicleState = ""
          this.vehiclenumber.vehicleDistrict = ""
          this.vehiclenumber.vehicleCity = ""
          this.vehiclenumber.vehicleNumber = ""
          // this.selectedBrandName = "",
          this.selectedmodelname = "",
            this.modelcolor = "",
            this.odometerreading = "",
            this.generalService = false,
            this.remarks = "",
            this.adddedComplaints = []







        })
      })
    })
  }


  onintbranchdata() {

    this.LocalStoreService.getbranchbybranchidid().subscribe(data => {
      this.typeofservice = data.response[0].service
      this.genralservice_boolean = data.response[0].genralservice
      if (data.response[0].single_brand) {
        this.singlebrand = data.response[0].single_brand
        this.garage_brandtype = data.response[0].brand

      } else {
        this.singlebrand = false
      }

    })
  }


  // getBrands() {

  //   this.LocalStoreService.get_brandmodel_forinventory().subscribe(data => {

  //     if(this.singlebrand == true ){

  //       this.selectedBrandName = this.garage_brandtype

  //       this.branddata_full = data.response.vehicles[0]
  //       console.log("the data inside the branddata for inventory full models package",this.branddata_full)

  //       this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;

  //       console.log("the data inside the branddata for inventory in jobcardpage ",this.seletedbrand_model)

  //       this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v' );

  //     }else{
  //       this.branddata_full = data.response.vehicles[0]

  //       console.log("the data inside the branddata for inventory ",this.branddata_full)

  //       this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v' );

  //     }
  //   })
  // }

  // selectmodel(model) {
  //   // this.inputmodelArray.model = model.bikename;
  //   // this.inputcategoryArray.categoryId = category._id;
  //   this.selectedmodelname = model.bikename; 
  //   // this.filteredCategoryData = [];    


  //   const brandData = this.branddata_full[this.selectedBrandName];

  //   this.selectedModelpackage = brandData.bikespackage.find(
  //     (bike) => bike.bikename.toLowerCase() === this.selectedmodelname.toLowerCase()
  //   );

  //   console.log("the data iniside the selected model package",this.selectedModelpackage)

  // }

  hidemodelDropdown() {
    setTimeout(() => this.showmodelDropdown = false, 400);
  }

  hidebrandDropdown() {
    setTimeout(() => this.showDropdown = false, 400);
  }

  // selectBrand(brand) {

  //   this.selectedBrandName = brand; 
  //   console.log("the data inside the brand in select brand",brand)

  //   this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;
  // }


  checkvehicles(vehiclehistorypage) {

    // console.log("the data inisde the checkvehciles history",this.jobcardobj.mobile.length)


    if (this.editflag == "edit") {

      this.LocalStoreService.checkvehicles_byjobid(this.editflag_jobCardId, this.editflag_userId).subscribe(data => {
        this.vehcilehistorydata = data.response
        console.log("the data insid the vehicle history edit jobcard", this.vehcilehistorydata[0]["customer_vehicles"]["_id"])
        this.onSelectVehicle(this.vehcilehistorydata[0]["customer_vehicles"]["_id"])
      })

    } else {



      if (this.searchType == "mobile") {

        if (this.jobcardobj.mobile.length > 9) {
          this.LocalStoreService.checkvehicles(this.jobcardobj.mobile).subscribe(data => {


            this.vehcilehistorydata = data.response

            this.vehcilehistorydata.forEach(data => {
              data.customer_vehicles.jobcard_details.forEach(data2 => {
                console.log("jobcardId:", data2.vehicle_id);
                if (data2.invoice) {
                  console.log("the data inside the first loop", data2.invoice.date)

                  console.log("the data inside the first loop", data2.invoice.invoice_amount)
                }
              })
            })


            if (data.status == "1")
              this.vehiclehistory_popup = this.ngbModel.open(vehiclehistorypage, {
                size: 'xl',
              })
            console.log("the data inisde the checkvehciles history", data)
          })
        }
      } else {
        if (this.jobcardobj.mobile.length == 4) {
          this.LocalStoreService.checkvehicles_byvehcileno(this.jobcardobj.mobile).subscribe(data => {


            this.vehcilehistorydata = data.response

            this.vehcilehistorydata.forEach(data => {
              data.customer_vehicles.jobcard_details.forEach(data2 => {
                console.log("jobcardId:", data2.vehicle_id);
                if (data2.invoice) {
                  console.log("the data inside the first loop", data2.invoice.date)

                  console.log("the data inside the first loop", data2.invoice.invoice_amount)
                }
              })
            })


            if (data.status == "1")
              this.vehiclehistory_popup = this.ngbModel.open(vehiclehistorypage, {
                size: 'xl',
              })
            console.log("the data inisde the checkvehciles history", data)
          })
        }

      }
    }






  }


  onSelectVehicle(selectedVehicleId: string) {
    console.log("Selected Vehicle ID66666666:", selectedVehicleId);

    if (this.editflag == "edit") {

      this.vehcilehistorydata.forEach((data) => {
        if (data.customer_vehicles._id === selectedVehicleId) {
          console.log("Matched Vehicle:", data);


          
          this.updatejobid = data.customer_vehicles.jobcard_details[0]._id;
          this.updateuserid = data._id;
          this.jobcardobj.name = data.name;
          this.jobcardobj.mobile = data.mobile;
          console.log("the edit data movile",this.jobcardobj.mobile)
          this.location = data.address
          this.selectedvehcileid = data.customer_vehicles._id
          console.log("the data inside the selected vehcile id ", this.selectedvehcileid)
          this.vehiclenumber.vehicleState = data.customer_vehicles.vehiclenumber.vehicleState;
          this.vehiclenumber.vehicleDistrict = data.customer_vehicles.vehiclenumber.vehicleDistrict;
          this.vehiclenumber.vehicleCity = data.customer_vehicles.vehiclenumber.vehicleCity;
          this.vehiclenumber.vehicleNumber = data.customer_vehicles.vehiclenumber.vehicleNumber;
          this.modelcolor = data.customer_vehicles.color;
          this.selectedBrandName = data.customer_vehicles.brand;
          this.selectedmodelname = data.customer_vehicles.model;
          let complaintsData = data.customer_vehicles.jobcard_details[0].complaints;

          this.adddedComplaints = complaintsData.map(complaint => complaint.value);
          this.odometerreading = data.customer_vehicles.jobcard_details[0].odometerreading;
          this.remarks = data.customer_vehicles.jobcard_details[0].remarks;
          this.advisor = data.customer_vehicles.jobcard_details[0].service_advisor;
          this.fuelAmount = parseFloat(data.customer_vehicles.jobcard_details[0].leveloffuel);
          if(data.customer_vehicles.jobcard_details[0].genralservice == "0"){
            this.generalService = false
          }

          if(data.gst_bool){
            if(data.gst_bool == true){
              this.jobcardobj.gstname =data.gst_name
              this.jobcardobj.gstnumber=data.gst_number
              this.isGSTChecked =true

            }

          }

          if (isNaN(this.fuelAmount)) {
            this.fuelAmount = 0;  
          }

          console.log("added complaints in jobcard",this.adddedComplaints);
        }
      });

    } else {

      this.vehcilehistorydata.forEach((data) => {
        if (data.customer_vehicles._id === selectedVehicleId) {
          console.log("Matched Vehicle:", data);

          this.jobcardobj.name = data.name;
          this.jobcardobj.mobile = data.mobile;
          this.location = data.address
          this.selectedvehcileid = data.customer_vehicles._id
          console.log("the data inside the selected vehcile id ", this.selectedvehcileid)
          this.vehiclenumber.vehicleState = data.customer_vehicles.vehiclenumber.vehicleState;
          this.vehiclenumber.vehicleDistrict = data.customer_vehicles.vehiclenumber.vehicleDistrict;
          this.vehiclenumber.vehicleCity = data.customer_vehicles.vehiclenumber.vehicleCity;
          this.vehiclenumber.vehicleNumber = data.customer_vehicles.vehiclenumber.vehicleNumber;
          this.modelcolor = data.customer_vehicles.color;
          this.selectedBrandName = data.customer_vehicles.brand;
          this.selectedmodelname = data.customer_vehicles.model;
        }
      });

      this.vehiclehistorypopup_close()
    }

  }

  // sliderValue: number = 50; 
  // fuelAmount: number = 0.050;
  sliderValue: number = 0;

  updateFuelAmount(event: any): void {
    this.sliderValue = event.target.value;
    const minFuelAmount = 0.001;
    const maxFuelAmount = 1.0;
    this.fuelAmount = minFuelAmount + (this.sliderValue / 100) * (maxFuelAmount - minFuelAmount);
  }

  // updateFuelAmount(event: any): void {
  //   this.sliderValue = event.target.value;
  //   this.fuelAmount = (this.sliderValue / 100) * 20; 
  // }

  addmodelpopup_close() {

    this.addmodelpopup.close()

  }


  openmodelpopup(modelpage) {
    this.inventory_things = false
    this.addmodelpopup = this.ngbModel.open(modelpage, {
    })
  }

  savemodel() {
    let process = "checkmodel"
    // let selectedbrand = ""
    // this.LocalStoreService.checkinventorydataexist(process, this.addmodel, this.selectedBrandName).subscribe(data => {
      // if (data.response == true) {
      //   this.inventory_things = true
      // }
      // if (data.response != true) {

        let flag = "addmodel"

        this.LocalStoreService.brandsave(this.selectedBrandName, flag, this.addmodel).subscribe(data => {
          this.addmodel = ""
          this.inventory_things = false
          this.addmodelpopup.close()
          // this.selectBrand(this.selectedBrandName)



        })
      // }

    // })
  }

  vehiclehistorypopup_close() {

    this.vehiclehistory_popup.close()

  }

  addanother_vehicle() {

    this.vehcilehistorydata.forEach((data) => {
      console.log("Matched Vehicle:", data);

      this.jobcardobj.name = data.name;

      this.vehiclehistory_popup.close()
    });

  }

  // getlocation(){
  //   this.LocalStoreService.getlocations().subscribe(data=>{

  //     this.locationOptions = data.response['locations']

  //     console.log("the data inside the location option",this.locationOptions)

  //   })
  // }


  // hidlocationDropdown(){

  //   setTimeout(() => this.showlocationdropdown = false, 400);

  // }


  // toggleLocationDropdown() {
  //   this.showlocationdropdown = !this.showlocationdropdown;
  // }

  clearall() {

    this.selectedvehcileid = ""
    this.jobcardobj.mobile = "",
      this.jobcardobj.name = "",
      this.location = "",
      // this.vehiclenumber.vehicleState = ""
      this.vehiclenumber.vehicleDistrict = ""
    this.vehiclenumber.vehicleCity = ""
    this.vehiclenumber.vehicleNumber = ""
    // this.selectedBrandName = "",
    // this.selectedmodelname = "",
    this.modelcolor = "",
      this.odometerreading = "",
      this.generalService = false,
      this.remarks = "",
      this.adddedComplaints = []



  }

  loadtechniciandata() {

    let flag = "service advisor"
    this.LocalStoreService.GetAllTech(flag).subscribe(data => {

      this.technician = data.response

      console.log("the data iniside the technician", this.technician)

    })
  }

  mergespares_forhistory(jobcarddata) {
    if (
      jobcarddata.invoice.all_spares.length > 0 ||
      jobcarddata.invoice.all_labours.length > 0 ||
      jobcarddata.invoice.service_spares.length > 0
    ) {

      this.carddata_fortable = [
        ...jobcarddata.invoice.all_spares,
        ...jobcarddata.invoice.all_labours.map(labour => ({
          ...labour,
          spare: labour.name,
          name: undefined
        })),
        ...jobcarddata.invoice.service_spares
      ];
    }

  }




  toggleSidebar(jobcarddata, vehciledata, i) {

    console.log("ddddddddddd:", vehciledata)
    console.log("ddddddddddd jobdata:", jobcarddata)

    this.index_veh_data = vehciledata
    this.index_for_slider = i
    console.log("ddddddddddd jobdata:", this.index_for_slider)
    this.bikebrandfor_slider = vehciledata.customer_vehicles.brand
    this.bikemodelfor_slider = vehciledata.customer_vehicles.model
    this.vehicleNumberfor_slider = vehciledata.customer_vehicles.vh_number
    if (jobcarddata.invoice) {
      this.invoiceNum = jobcarddata.invoice.invoice_reference_number
      this.invoiceDate = jobcarddata.invoice.date
      this.invoiceAmount = jobcarddata.invoice.invoice_amount
    } else if (jobcarddata.estimate && !jobcarddata.invoice) {
      this.invoiceNum = jobcarddata.estimate.estimate_reference_number
      this.invoiceDate = jobcarddata.estimate.date
      this.invoiceAmount = jobcarddata.estimate.estimate_amount

    }
    this.vehicleId = ''
    this.carddata_fortable = []
    this.carddata_forcomplaints = []
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log("the data inside the card", jobcarddata)

    if (jobcarddata.invoice) {
      // if (jobcarddata.invoice.all_spares.length > 0) {
      //   this.carddata_fortable = jobcarddata.invoice.all_spares
      // }
      this.mergespares_forhistory(jobcarddata)


    } else if (jobcarddata.estimate && !jobcarddata.invoice) {
      if (jobcarddata.estimate.all_spares.length > 0) {
        this.carddata_fortable = jobcarddata.estimate.all_spares
      }
    }
    if (jobcarddata.complaints.length > 0) {
      this.carddata_forcomplaints = jobcarddata.complaints

    }
    this.remarks = jobcarddata.remarks || 'No Remarks';
  }


  rightaerrow() {

    this.index_veh_data
    this.index_for_slider
    let jobcardlength = this.index_veh_data.customer_vehicles.jobcard_details.length

    console.log("the data inisde the legth of jobcard", jobcardlength)
    console.log("the data inisde the legth of jobcard", this.index_for_slider)
    let jobcarddata

    jobcarddata = this.index_veh_data.customer_vehicles.jobcard_details[this.index_for_slider + 1]

    if (this.index_for_slider < jobcardlength) {
      this.index_for_slider++

    }

    if (this.index_for_slider < jobcardlength) {

      this.carddata_fortable = []
      this.carddata_forcomplaints = []
      this.bikebrandfor_slider = this.index_veh_data.customer_vehicles.brand
      this.bikemodelfor_slider = this.index_veh_data.customer_vehicles.model
      this.vehicleNumberfor_slider = this.index_veh_data.customer_vehicles.vh_number
      if (jobcarddata.invoice) {
        this.invoiceNum = jobcarddata.invoice.invoice_reference_number
        this.invoiceDate = jobcarddata.invoice.date
        this.invoiceAmount = jobcarddata.invoice.invoice_amount
      } else if (jobcarddata.estimate && !jobcarddata.invoice) {
        this.invoiceNum = jobcarddata.estimate.estimate_reference_number
        this.invoiceDate = jobcarddata.estimate.date
        this.invoiceAmount = jobcarddata.estimate.estimate_amount

      }
      this.vehicleId = ''

      if (jobcarddata.invoice) {
        // if (jobcarddata.invoice.all_spares.length > 0) {
        //   this.carddata_fortable = jobcarddata.invoice.all_spares
        // }
        this.mergespares_forhistory(jobcarddata)
      } else if (jobcarddata.estimate && !jobcarddata.invoice) {
        if (jobcarddata.estimate.all_spares.length > 0) {
          this.carddata_fortable = jobcarddata.estimate.all_spares
        }
      }
      if (jobcarddata.complaints.length > 0) {
        this.carddata_forcomplaints = jobcarddata.complaints

      }
      this.remarks = jobcarddata.remarks || 'No Remarks';
      //  console.log("the data of the indexpointer",indexdata)
      console.log("rightaerrow")
    }
  }


  leftaerrow() {

    if (this.index_for_slider != 0) {
      this.carddata_fortable = []
      this.carddata_forcomplaints = []
      this.index_veh_data
      this.index_for_slider
      let jobcarddata = this.index_veh_data.customer_vehicles.jobcard_details[this.index_for_slider - 1]
      this.index_for_slider--


      this.bikebrandfor_slider = this.index_veh_data.customer_vehicles.brand
      this.bikemodelfor_slider = this.index_veh_data.customer_vehicles.model
      this.vehicleNumberfor_slider = this.index_veh_data.customer_vehicles.vh_number
      if (jobcarddata.invoice) {
        this.invoiceNum = jobcarddata.invoice.invoice_reference_number
        this.invoiceDate = jobcarddata.invoice.date
        this.invoiceAmount = jobcarddata.invoice.invoice_amount
      } else if (jobcarddata.estimate && !jobcarddata.invoice) {
        this.invoiceNum = jobcarddata.estimate.estimate_reference_number
        this.invoiceDate = jobcarddata.estimate.date
        this.invoiceAmount = jobcarddata.estimate.estimate_amount

      }
      this.vehicleId = ''

      if (jobcarddata.invoice) {
        // if (jobcarddata.invoice.all_spares.length > 0) {
        //   this.carddata_fortable = jobcarddata.invoice.all_spares
        // }
        this.mergespares_forhistory(jobcarddata)
      } else if (jobcarddata.estimate && !jobcarddata.invoice) {
        if (jobcarddata.estimate.all_spares.length > 0) {
          this.carddata_fortable = jobcarddata.estimate.all_spares
        }
      }
      if (jobcarddata.complaints.length > 0) {
        this.carddata_forcomplaints = jobcarddata.complaints
      }
      this.remarks = jobcarddata.remarks || 'No Remarks';

    }

  }

  getComplaint(data: any): string {
    // Fetch the key dynamically that starts with 'complaint'
    const complaintKey = Object.keys(data).find(key => key.includes('complaint'));
    return complaintKey ? data[complaintKey] : 'No complaint';
  }



  toggleSidebar_multipleinvoice(jobcard, vehciledata,) {


    this.bikebrandfor_slider = vehciledata.customer_vehicles.brand
    this.bikemodelfor_slider = vehciledata.customer_vehicles.model
    this.vehicleNumberfor_slider = vehciledata.customer_vehicles.vh_number

    this.carddata_fortable = []

    this.multiinvoicehistory_clicked = jobcard.multipleinvoice
    this.vehicleId = ''



    this.isSidebarOpen_multiinvoice = !this.isSidebarOpen_multiinvoice


  }

  toggleSidebar_multipleinvoice_card(multipleinvoice) {


    // this.bikebrandfor_slider = multipleinvoice.customer_vehicles.brand
    // this.bikemodelfor_slider = multipleinvoice.customer_vehicles.model
    // this.vehicleNumberfor_slider = multipleinvoice.customer_vehicles.vh_number
    // if(multipleinvoice.invoice){
    //   this.invoiceNum = multipleinvoice.invoice.invoice_reference_number
    //   this.invoiceDate = jobcarddata.invoice.date
    //   this.invoiceAmount = jobcarddata.invoice.invoice_amount
    // }else if(jobcarddata.estimate && !jobcarddata.invoice){
    //   this.invoiceNum = jobcarddata.estimate.estimate_reference_number
    //   this.invoiceDate = jobcarddata.estimate.date
    //   this.invoiceAmount = jobcarddata.estimate.estimate_amount

    // }
    // this.vehicleId = ''






    this.invoiceNum = ""
    this.invoiceDate = ""
    this.invoiceAmount = ""
    this.carddata_fortable = []
    this.remarks = ""


    this.invoiceNum = multipleinvoice.invoice_reference_number
    this.invoiceDate = multipleinvoice.date
    this.invoiceAmount = multipleinvoice.invoice_amount

    // if (multipleinvoice.all_spares.length > 0) {
    //   this.carddata_fortable = multipleinvoice.all_spares
    // }

    if (
      multipleinvoice.all_spares.length > 0 ||
      multipleinvoice.all_labours.length > 0 ||
      multipleinvoice.service_spares.length > 0
    ) {

      this.carddata_fortable = [
        ...multipleinvoice.service_spares,
        ...multipleinvoice.all_spares,
        ...multipleinvoice.all_labours.map(labour => ({
          ...labour,
          spare: labour.name,
          name: undefined
        })),

      ];
    }



    this.remarks = multipleinvoice.advisor_remarks || 'No Remarks';

  }



  //pavithra ts file for history page start

  isHistoricalSidebarOpen = false;
  isColumnVisible: boolean = false;
  selectedInvoice: any = null;

  historicalData: any = [];
  vehicleNumberfor_historical: any;
  modifieddata: any;
  mergedvalue: any = [];
  historicalobjectData: any;

  toggleHistoricalSidebar(vehicle_id, mobile) {
    this.isColumnVisible = false;
    this.isHistoricalSidebarOpen = !this.isHistoricalSidebarOpen;
    console.log("vehicle id ================:", vehicle_id)
    // this.isColumnVisible = !this.isColumnVisible; 

    this.vehcilehistorydata.forEach((data) => {
      if (data.customer_vehicles._id === vehicle_id) {

        this.vehiclenumber.vehicleNumber = data.customer_vehicles.vehiclenumber.vh_number;
        this.selectedBrandName = data.customer_vehicles.brand;
        this.selectedmodelname = data.customer_vehicles.model;
      }

    });


    console.log("This is the merged array value:", this.mergedvalue);


    this.LocalStoreService.get_historicaldata(mobile).subscribe(data => {

      this.historicalData = data.response;
      console.log("the data iniside the toggleHistoricalSidebar", this.historicalData);


      this.historicalData.forEach((data2) => {
        this.historicalobjectData = data2.vehicle_id;
        console.log("The invoice summary date and netvalue", this.historicalobjectData);
      })

    })
  }

  detailsfortable() {
    this.historicalData.forEach((item) => {
      this.mergedvalue = [
        ...item.labours,
        ...item.package,
        ...item.spares
      ];
      this.selectedInvoice = item.mergedvalue; // Set selected invoice data
    });
    this.isColumnVisible = true;


  }

  //pavithra ts file for history page end

  updatejobcard(){

   let customername = this.jobcardobj.name;
   let customermobile = this.jobcardobj.mobile; 
   let customeraddress = this.location;
   let customervehcileid = this.selectedvehcileid 
   let vehcilestate = this.vehiclenumber.vehicleState
   let vehicleDistrict = this.vehiclenumber.vehicleDistrict
   let vehcilecity = this.vehiclenumber.vehicleCity
   let vehicleNumber = this.vehiclenumber.vehicleNumber
   let vehcilecolour = this.modelcolor;
   let vehiclebrand = this.selectedBrandName;
   let vehcilemodel = this.selectedmodelname ;
   let odometerreading = this.odometerreading;



  //  this.adddedComplaints.unshift(this.newComplaint.trim());
    // console.log("the data iniside the", this.adddedComplaints)

    const formattedComplaints = [];

    this.adddedComplaints.forEach((complaint, index) => {
      const complaintObject = {
        c_id: this.generateCID(),
        [`complaint ${index + 1}`]: complaint,
        value: complaint
      };
      formattedComplaints.push(complaintObject);

      this.formattedComplaintsstringy = JSON.stringify(formattedComplaints)

    });

    // this.updatejobid = data.customer_vehicles.jobcard_details[0]._id;
    //       this.updateuserid = data._id;

     let obdatedobj = {

    "customername" : customername,
    "customermobile"  :customermobile,
    "customeraddress" : customeraddress,
    "customervehcileid": customervehcileid,
    "customerjobid":this.updatejobid,
    "updateuserid":this.updateuserid,
    "vehiclestate" : vehcilestate,
    "vehicleDistrict": vehicleDistrict,
    "vehcilecity":vehcilecity,
    "vehicleNumber":vehicleNumber,
    "vehcilecolour":vehcilecolour,
    "vehiclebrand":vehiclebrand,
    "vehcilemodel":vehcilemodel,
    "customercomplaints":this.formattedComplaintsstringy,
    "odometerreading" :odometerreading,
    "remarks":this.remarks,
    "advisor":this.advisor,
    "fuelAmount":this.fuelAmount,
    "gstname":this.jobcardobj.gstname,
    "gstnumber":this.jobcardobj.gstnumber,
    "isGSTChecked":this.isGSTChecked
  }

    this.LocalStoreService.updatejobcard_api(obdatedobj).subscribe(data=>{
      if(data.statusCode == "200"){
        this.toastr.success('jobcard added sucessfully!', 'Success!', { timeOut: 3000 });


        this.jobcardobj.name = "";
        this.jobcardobj.mobile = "";
        this.location = "";
        this.selectedvehcileid = "";
         this.vehiclenumber.vehicleState = "";
        this.vehiclenumber.vehicleDistrict = "";
        this.vehiclenumber.vehicleCity = "";
         this.vehiclenumber.vehicleNumber = "";
        this.modelcolor = "";
         this.selectedBrandName = "";
         this.selectedmodelname = "";
        this.odometerreading = "";
        this.updatejobid = "";
        this.updateuserid = "";
        this.advisor  = ""; 
        this.fuelAmount  = 0;
        this.jobcardobj.gstname  = "";
        this.jobcardobj.gstnumber  = "";
        this.isGSTChecked = false;


        this.router.navigate(['/Business'],);

      }


      
    })

  }

  updatevehcilecolor(vehcilecolorpage) {

    console.log("the data of the color", this.modelcolor)
      // if(this.modelcolor == "add"){

        this.addcolorpopup = this.ngbModel.open(vehcilecolorpage, {
        })

      // }

  }


  addcolorpopupclosedialog() {
    this.addcolorpopup.close()
  }




 


  savevehiclecolours() {
    this.LocalStoreService.updatevehicle_colour(this.addcolour).subscribe(data => {



      this.getvehicle_colours()
      this.addcolorpopupclosedialog()


    })



  }


  onDateChange(): void {
    const startdate = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    const enddate = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');
  
    // this.del1 = startdate;
    // this.del2 = enddate;
    if (startdate) {
      this.del1 = startdate;
      console.log('Start Date (del1):', this.del1);
    }
    if (enddate) {
      this.del2 = enddate;
      console.log('End Date (del2):', this.del2);
    }
  }

  










}
