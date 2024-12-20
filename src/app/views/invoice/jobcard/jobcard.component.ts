import { Component, OnInit,QueryList, ViewChildren, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.scss'
})
export class JobcardComponent implements OnInit {
  @ViewChildren('modelItem') modelItems!: QueryList<ElementRef>;
  @ViewChildren('brandItem') brandItems!: QueryList<ElementRef>;


    selectedmodelname: string = '';
    showmodelDropdown: boolean = false;
    selectedModelIndex: number = -1; // Track the index of the currently selected model
  
    seletedbrand_model: any[] = []; // List of models for the selected brand
    branddata_full: any = {};  // Full data structure
    selectedModelpackage: any; // To hold the selected model package
  
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
  
  toggleGeneralService(){
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





   jobcardobj ={
    mobile:"",
    name:"",
  }

  vehiclenumber={
    vehicleState:"TN",
    vehicleDistrict:"",
    vehicleCity:"",
    vehicleNumber:""
  }

  modelcolor:any = "";

  // location: any = ""
  odoMeter: boolean = false;


  isChecked: boolean = true;
  generalService: boolean= false;

  
  
  newComplaint: any;
  
  adddedComplaints: any[] = [];


  // locationOptions = [
  //   'Velachery',
  //    'Tambaram', 
  //    'Ramapuram'
  //   ]

  listColors = [
    'Blue',
    'Black',
    'Green',
    'Grey',
    'Orange',
    'Pink',
    'Red',
    'White',
    'Yellow'
  ];

  singlebrand:  boolean = false;
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
  complaintsarray_db: any=[];
  typeofservice: any;
  formattedComplaintsstringy: string;
  remarks: any = "";
  inventory_things: boolean = false ;
  addmodelpopup: any;
  addmodel:any;
  vehiclehistory_popup: any;
  // locationOptions: any;
  // showDropdownlocation: boolean;
  // showlocationdropdown: boolean;
  genralservice_boolean: boolean = false;
  advisor:any = ""
  technician: any = [];


  constructor(private LocalStoreService: LocalStoreService,private ngbModel: NgbModal,private toastr: ToastrService) {


  }




  ngOnInit(): void {

    console.log("the data inside the vehcile id",this.selectedvehcileid)

    this.onintbranchdata()
    this.getBrands()
    this.getlocation()
    this.loadtechniciandata()
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
    console.log("the data iniside the",this.adddedComplaints)

    const formattedComplaints = [];

  this.adddedComplaints.forEach((complaint, index) => {
  const complaintObject = {
    c_id: this.generateCID(), 
    [`complaint ${index + 1}`]: complaint, 
    value:complaint
  };
  formattedComplaints.push(complaintObject);
  
  this.formattedComplaintsstringy = JSON.stringify(formattedComplaints)

});
    this.newComplaint = '';
  }
  
  removeComplaint(index: number) {
    this.adddedComplaints.splice(index, 1); 
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

  savejobcard(){


    console.log('the data inside the ',this.vehiclenumber.vehicleCity)

    let vh_number = 
    (this.vehiclenumber.vehicleState || "") + 
    "-" + 
    (this.vehiclenumber.vehicleDistrict || "") + 
    "-" + 
    (this.vehiclenumber.vehicleCity || "") + 
    "-" + 
    (this.vehiclenumber.vehicleNumber || "");

    
    console.log('the data inside the merged vh number ',vh_number)
    console.log('the data inside the merged model ',this.selectedBrandName)
    console.log('the data inside the merged brand ',this.selectedmodelname)
    console.log('the data inside the  brand color',this.modelcolor)
    console.log("the odometer reading",this.odoMeter)

    let odometervalue
    if(this.odoMeter == true ||this.odometerreading == "" ){
      odometervalue = "Odometer not working"
    }else{
      odometervalue = this.odometerreading
    }

    let genralservicecheck
    let gs_selected_option_index
    if(this.generalService == true){
      genralservicecheck = "1"
      gs_selected_option_index = "0"
    }else{
      genralservicecheck = "0"
      gs_selected_option_index = "0"
      
    }

    const brandData = this.branddata_full[this.selectedBrandName];
     
    this.selectedModelpackage = brandData.bikespackage.find(
      (bike) => bike.bikename.toLowerCase() === this.selectedmodelname.toLowerCase()
    );

     let selectedamount= this.selectedModelpackage.gsp.offerselectedvalue

     const gs_selected_amount = `${selectedamount}, GSP`;

     

    // return
    this.LocalStoreService.postcustomer(this.jobcardobj,this.location).subscribe(async(customerdata)=>{

      console.log("the full data of the customer",customerdata)
      let userid = customerdata.userid

      this.LocalStoreService.addvehicle(userid,this.jobcardobj,vh_number,this.selectedBrandName,this.selectedmodelname,this.vehiclenumber,this.modelcolor,this.selectedvehcileid,this.selectedModelpackage).subscribe(vehciledata=>{

        console.log("the addvehicle vehcile data",vehciledata)

       this.LocalStoreService.addjobcard(vehciledata._id,odometervalue,this.fuelAmount,genralservicecheck,this.selectedModelpackage,this.formattedComplaintsstringy,
        this.jobcardobj.mobile,userid,this.remarks,gs_selected_option_index,gs_selected_amount,this.advisor
       ).subscribe(jobcarddata=>{

        this.toastr.success('jobcard added sucessfully!', 'Success!', { timeOut: 3000 });

        this.jobcardobj.mobile = "",
        this.jobcardobj.name = "",
        this.location= "",
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


  onintbranchdata(){

    this.LocalStoreService.getbranchbybranchidid().subscribe(data => {
      this.typeofservice = data.response[0].service
      this.genralservice_boolean = data.response[0].genralservice
      if(data.response[0].single_brand){
        this.singlebrand = data.response[0].single_brand
        this.garage_brandtype = data.response[0].brand
        
      }else{
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


  checkvehicles(vehiclehistorypage){

    console.log("the data inisde the checkvehciles history",this.jobcardobj.mobile.length)

    if(this.jobcardobj.mobile.length > 9){
      this.LocalStoreService.checkvehicles(this.jobcardobj.mobile).subscribe(data=>{

        
        this.vehcilehistorydata = data.response


        if(data.status == "1")
        this.vehiclehistory_popup= this.ngbModel.open(vehiclehistorypage, {
          size: 'xl',
        })
        console.log("the data inisde the checkvehciles history",data)
      })
    }
  }


  onSelectVehicle(selectedVehicleId: string) {
    console.log("Selected Vehicle ID:", selectedVehicleId);
  
    this.vehcilehistorydata.forEach((data) => {
      if (data.customer_vehicles._id === selectedVehicleId) {
        console.log("Matched Vehicle:", data);

        this.jobcardobj.name = data.name;
        this.location = data.address
        this.selectedvehcileid = data.customer_vehicles._id
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

  addmodelpopup_close(){

    this.addmodelpopup.close()

  }


  openmodelpopup(modelpage) {
    this.inventory_things = false
    this.addmodelpopup = this.ngbModel.open(modelpage, {
    })
  }

  savemodel(){
    let process = "checkmodel"
    // let selectedbrand = ""
    this.LocalStoreService.checkinventorydataexist(process,this.addmodel,this.selectedBrandName).subscribe(data=>{
      if(data.response == true){
        this.inventory_things = true
      }
      if( data.response != true){

        let flag = "addmodel"
        
        this.LocalStoreService.brandsave(this.selectedBrandName, flag,this.addmodel).subscribe(data => {
          this.addmodel = ""
          this.inventory_things = false
          this.addmodelpopup.close()
          // this.selectBrand(this.selectedBrandName)
          
          
          
        })
      }
     
    })
  }

  vehiclehistorypopup_close(){

    this.vehiclehistory_popup.close()

  }

  addanother_vehicle(){

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

  clearall(){

    this.selectedvehcileid = ""
    this.jobcardobj.mobile = "",
    this.jobcardobj.name = "",
    this.location= "",
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

  loadtechniciandata(){

    let flag = "service advisor"
    this.LocalStoreService.GetAllTech(flag).subscribe(data=>{

      this.technician = data.response

      console.log("the data iniside the technician",this.technician)

    })
  }


  


}
