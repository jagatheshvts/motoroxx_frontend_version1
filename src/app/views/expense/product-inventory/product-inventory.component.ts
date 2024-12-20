import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-inventory',
  // standalone: false,
  // imports: [FormsModule],
  templateUrl: './product-inventory.component.html',
  styleUrl: './product-inventory.component.scss'
})
export class ProductInventoryComponent implements OnInit {
  productsdata: any[] = []



  totalRecords_products = 0;
  page = 1;
  pageSize = 10;
  search = "";
  sortField = "product_name";
  sortOrder = "asc";
  // productsdatass = [];
  // inputbrandarray = [];
  selectedBrandId: any = "";
  allBrandData: any;
  categorydata: any[] = []
  branddata: any[] = [];
  addbrand: any
  addmodel: any
  category: any
  productobj: {
    brand: string;
    partcode:String;
    product_id: string;
    product_name: string;
    product_desc: string;
    supplier_id: string;
    serial_no: string;
    category: string;
    category_id: string;
    HSN: string;
    GST_ID: string;
    MRP: any;
    qty: any;
    maximum_discount: string;
    ROL: any;
    ROQ: any;
  } = {
      brand: '',
      partcode:'',
      product_id: '',
      product_name: '',
      product_desc: '',
      category: '',
      category_id: '',
      supplier_id: '',
      serial_no: '',
      HSN: '',
      GST_ID: '',
      MRP: 0.00,
      qty: 0.00,
      maximum_discount: '',
      ROL: 0.00,
      ROQ: 0.00
    };



  inputbrandarray = {
    brand: "",
    // brandId: ""
  }
  inputcategoryArray = {
    category: "",
    categoryId: ""
  }
  inputmodelArray = {
    model: "",
    // categoryId: ""
  }
  modelpopup: any;
  allsupplierdata: any;
  checkedproductmrp: any =  0.00;
  modelpopup_conform_popup: any;

  inventory_things:boolean = false
  searchTerm: any;
  // totalRecords_products: number;
  totalRecords_category: number;
  totalRecords_brands: number;


  filteredBrandData = [];
  filteredCategoryData = [];
  filteredBrandData_foredit =[];
  selectedBrandName: any;
  selectedcategoryname: any;
  selectedmodelname: any;
  showDropdown: boolean;
  showcategoryDropdown: boolean;
  showmodelDropdown: boolean;
  fullproductdata_foredit: any;
  brandnameforedit: any;
  filteredcategoryData_foredit: any[];
  categorynameforedit: any;
  selectedFile: any;
  uploadStatus: string;
  selectedFile_customerdata: any;
  selectedFile_bulletdata: any;
  seletedbrand_model: any;
  branddata_full: any;
  modelpopupbrand: any;
  modelpopupmodel: any;
  modelpopupcategory: any;
  selected_model_foredit: any;
  modelnameforedit: any;
  garage_brandtype: any;
  singlebrand:  boolean = false;
 

  
  constructor(private dialogModal: NgbModal, private LocalStoreService: LocalStoreService,private cdr: ChangeDetectorRef,private toastr: ToastrService) { }
  ngOnInit(): void {
    // this.LocalStoreService.get_inventory_products().subscribe(data => {
    //   this.productsdata = data.response;
    //   this.totalRecords_products = data.response.length
    //   console.log("this is get from backend getproducts", this.productsdata)
    // })
    this.fetchProducts()
    this.onintbranchdata()
    this.getBrands()
    this.getCategory()
    this.getvendardata()
  }


  fetchProducts() {
    const params = {
      branchId: "your_branch_id",
      page: this.page,
      pageSize: this.pageSize,
      search: this.search,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };

    this.LocalStoreService.get_inventory_products(this.page,this.pageSize,this.search,this.sortField,this.sortOrder).subscribe(data => {
      this.productsdata = data.response;
      this.totalRecords_products = data.totalRecords;
      console.log("Data fetched:", this.productsdata);
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords_products / this.pageSize);
  }
  


  onSearchChange(searchValue: string) {
    this.search = searchValue;
    this.page = 1;
    this.fetchProducts();
  }

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    this.fetchProducts();
  }

  // onPageChange(newPage: number) {
  //   this.page = newPage;
  //   this.fetchProducts();
  // }


 

  get visiblePageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalRecords_products / this.pageSize);
    const maxVisible = 5; 
  
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    const pages: number[] = [];
    const startPage = Math.max(1, this.page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    // Add ellipses
    if (startPage > 1) {
      pages.unshift(1, -1); // -1 represents "..."
    }
    if (endPage < totalPages) {
      pages.push(-1, totalPages);
    }
  
    return pages;
  }
  
  onPageChange(newPage: number): void {
    const totalPages = Math.ceil(this.totalRecords_products / this.pageSize);
    if (newPage >= 1 && newPage <= totalPages) {
      this.page = newPage;
      this.fetchProducts(); // Fetch the data for the new page
    }
  }
  
  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.page = 1;
    this.fetchProducts();
  }





  getvendardata() {
    var cursor = '';
    this.LocalStoreService.getvendardata(cursor).subscribe(data => {
      this.allsupplierdata = data.response;
    });
  }
  openproductpopup(productpage) {
    this.modelpopup = this.dialogModal.open(productpage, {
      size: 'xl',
    })
    this.productobj= {
      brand: '',
      partcode: '',
      product_id: '',
      product_name: '',
      product_desc: '',
      category: '',
      category_id: '',
      supplier_id: '',
      serial_no: '',
      HSN: '',
      GST_ID: '',
      MRP: 0.00,
      qty: 0.00,
      maximum_discount: '',
      ROL: 0.00,
      ROQ: 0.00
    };
  }
  openbrandpopup(brandpage) {
    this.inventory_things = false
    this.modelpopupbrand = this.dialogModal.open(brandpage, {
    })
  }
  opencategorypopup(categorypage) {
    this.inventory_things = false
    this.modelpopupcategory = this.dialogModal.open(categorypage, {
    })
  }
  openmodelpopup(modelpage) {
    this.inventory_things = false
    this.modelpopupmodel = this.dialogModal.open(modelpage, {
    })
  }
  productsave(conform_mrp_popup) {
    let obj = {
      brand: "",
      brand_id: ""
    };
    let categoryObj = {
      category: '',
      category_id: ''
    }
    let modelobj = {
      model:''
    }
    categoryObj.category = this.inputcategoryArray.category;
    categoryObj.category_id = this.inputcategoryArray.categoryId;
    if(obj.brand != ""){

      obj.brand = this.inputbrandarray.brand
    }else{
      obj.brand = this.selectedBrandName

    }
    // obj.brand_id = this.inputbrandarray.brandId
    modelobj.model = this.inputmodelArray.model
    this.LocalStoreService.checkproduct(this.productobj.product_id).subscribe(data=>{
      if(data.response.coststatus == 1){
        this.checkedproductmrp = data.response.productmrp
        this.modelpopup_conform_popup = this.dialogModal.open(conform_mrp_popup, {
          size: 'sm'
        })
      }else{
        this.LocalStoreService.inventory_product(this.productobj, obj, categoryObj,modelobj).subscribe(data => {
          this.fetchProducts()
          // this.LocalStoreService.get_inventory_products().subscribe(data => {
          //   this.productsdata = data.response;
          //   console.log("this is get from backend getproducts", this.productsdata)
          // })
          console.log("this is data stored in backend", data)
          this.closedialog();
        })
      }
    })
  }

  onintbranchdata(){
    this.LocalStoreService.getbranchbybranchidid().subscribe(data => {
      console.log("the data inside the getbranchdata ",data)
      if(data.response[0].single_brand){
        this.singlebrand = data.response[0].single_brand
        this.garage_brandtype = data.response[0].brand
      }else{
        this.singlebrand = false
      }
    })
  }

  getBrands() {
    this.LocalStoreService.get_brandmodel_forinventory().subscribe(data => {
      if(this.singlebrand == true ){
        this.selectedBrandName = this.garage_brandtype
        this.branddata_full = data.response.vehicles[0]
        this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;
        this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v' );
      }else{
        this.branddata_full = data.response.vehicles[0]
        this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v' );
      }
    })
  }

  getCategory() {
    this.LocalStoreService.get_category_inventory().subscribe(data => {
      this.categorydata = data.response
      this.totalRecords_category = data.response.length
    })
  }

  onBrandSelect(event: any) {
    this.selectedBrandId = event.target.value; 
    console.log("Selected Brand ID:", this.selectedBrandId);
  }

  closedialog_brand(){
    this.modelpopupbrand.close()
  }

  savebrand() {
    let process = "checkbrand"
    let selectedbrand = ""
    this.LocalStoreService.checkinventorydataexist(process,this.addbrand,selectedbrand).subscribe(data=>{
      if(data.response == true){
        this.inventory_things = true
      }
      if( data.response != true){
        let flag = "addbrand"
        let model = ""
        this.LocalStoreService.brandsave(this.addbrand,flag,model).subscribe(data => {
          this.addbrand = ""
          this.inventory_things = false
          this.modelpopupbrand.close()
          this.getBrands()
        })
      }
    })
  }

  closedialog_model(){
    this.modelpopupmodel.close()
  }



  savemodel() {
    let process = "checkmodel"
    this.LocalStoreService.checkinventorydataexist(process,this.addmodel,this.selectedBrandName).subscribe(data=>{
      if(data.response == true){
        this.inventory_things = true
      }
      if( data.response != true){
        let flag = "addmodel"
        this.LocalStoreService.brandsave(this.selectedBrandName, flag,this.addmodel).subscribe(data => {
          this.addmodel = ""
          this.inventory_things = false
          this.modelpopupmodel.close()
          this.selectBrand(this.selectedBrandName)
        })
      }
    })
  }

  closedialog_category(){
    this.modelpopupcategory.close()
  }
  
  saveCategory() {
    let process = "checkcategory"
    let selectedbrand = ""
    this.LocalStoreService.checkinventorydataexist(process,this.category,selectedbrand).subscribe(data=>{
      if(data.response == true){
        this.inventory_things = true
      }
      if(data.response != true){
        this.LocalStoreService.saveCategory(this.category).subscribe(data => {
          this.category = ""
          this.inventory_things = false
          this.closedialog()
        })
      }
    })
  }

  closedialog() {
    this.modelpopup.close()
  }

  clearOnFocus(field: string) {
    if (this.productobj[field] === 0 || this.productobj[field] === "0.00") {
        this.productobj[field] = null;
    }
}

formatOnBlur(field: string) {
    if (this.productobj[field] == null || this.productobj[field] === "") {
        this.productobj[field] = "0.00";
    } else {
        this.productobj[field] = parseFloat(this.productobj[field]).toFixed(2);
    }
}

conform_mrp_popup_process(process){
  if(process == 'no'){
    console.log("the data enter into the process yes",this.checkedproductmrp)
    this.productobj.MRP = this.checkedproductmrp
    console.log("the data enter into the process yes",process)
  }
  let obj = {
    brand: "",
    brand_id: ""
  };
   let categoryObj = {
    category: '',
    category_id: ''
  };
  let modelobj = {
    model:''
  }
  categoryObj.category = this.inputcategoryArray.category;
  categoryObj.category_id = this.inputcategoryArray.categoryId;
  obj.brand = this.inputbrandarray.brand,
  this.LocalStoreService.inventory_product(this.productobj, obj, categoryObj,modelobj).subscribe(data => {
    this.fetchProducts()    // this.LocalStoreService.get_inventory_products().subscribe(data => {
    //   this.productsdata = data.response;
    //   console.log("this is get from backend getproducts", this.productsdata)
    // })
    console.log("this is data stored in backend", data)
    this.modelpopup_conform_popup.close()
    this.closedialog();
  })
}


updatePagedData() {
  console.log("the data inside the filter", this.productsdata);
  const filteredData = this.productsdata.filter(item =>
    item.brand.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  this.totalRecords_products = filteredData.length;
  this.productsdata = filteredData
  if(this.searchTerm == ""){
    this.fetchProducts()
    // this.LocalStoreService.get_inventory_products().subscribe(data => {
    //   this.productsdata = data.response;
    //   this.totalRecords_products = data.response.length
    //   console.log("this is get from backend getproducts", this.productsdata)
    // })
  }
}

filterData() {
  this.updatePagedData();
}

filterBrands() {
  this.filteredBrandData = this.branddata.filter(brand =>
    brand.toLowerCase().includes(this.selectedBrandName.toLowerCase())
  );
}

filterbrand_foredit(){

  this.filteredBrandData_foredit = this.branddata.filter(brand =>
    brand.brand.toLowerCase().includes(this.brandnameforedit.toLowerCase())
  );

}
filtercategory_foredit(){

  this.filteredcategoryData_foredit = this.categorydata.filter(category =>
    category.category.toLowerCase().includes(this.categorynameforedit.toLowerCase())
  );

}

filterCategory() {
  this.filteredCategoryData = this.categorydata.filter(category =>
    category.category.toLowerCase().includes(this.selectedcategoryname.toLowerCase())
  );
}

selectBrand(brand) {

  this.selectedBrandName = brand; 
  console.log("the data inside the brand in select brand",brand)
  this.inputbrandarray.brand = brand;
  this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;


  this.filteredBrandData = [];         
}
selectmodel(model) {
  this.inputmodelArray.model = model.bikename;
  // this.inputcategoryArray.categoryId = category._id;
  this.selectedmodelname = model.bikename; 
  this.filteredCategoryData = [];         
}


selectcategory(category) {
  this.inputcategoryArray.category = category.category;
  this.inputcategoryArray.categoryId = category._id;
  this.selectedcategoryname = category.category; 
  this.filteredCategoryData = [];         
}

selectBrand_foredit(brand){

  this.fullproductdata_foredit.brand = brand.brand;
  // this.fullproductdata_foredit.brand_id = brand._id;
  this.brandnameforedit = brand; 

  this.selected_model_foredit = this.branddata_full[this.brandnameforedit].bikespackage;
  this.filteredBrandData_foredit = [];  

  
}

selectmodel_foredit(model){

  this.fullproductdata_foredit.model = model.bikename;
  // this.inputcategoryArray.categoryId = category._id;
  this.modelnameforedit = model.bikename; 
  this.filteredCategoryData = [];  

}
selectcategory_foredit(category){

  this.fullproductdata_foredit.category = category.category;
  this.fullproductdata_foredit.category_id = category._id;
  this.categorynameforedit = category.category; 
  this.filteredcategoryData_foredit = [];  

}


checkFullProductId(partcode){
  this.LocalStoreService.checkFullProductId(partcode).subscribe(data=>{

    if(data.response2){
      console.log("the data inside the checkFullProductId true",data)

      let checkproductresponse = data.response

      this.productobj.supplier_id = checkproductresponse.supplier_id
      this.allsupplierdata["name"] = checkproductresponse.supplier_name
      this.productobj.serial_no = checkproductresponse.serial_no
      this.productobj.product_name = checkproductresponse.product_name
      this.productobj.HSN = checkproductresponse.HSN
      this.productobj.GST_ID = checkproductresponse.GST_ID
      this.productobj.MRP = checkproductresponse.MRP
      this.productobj.qty = checkproductresponse.qty
      this.productobj.maximum_discount = checkproductresponse.maximum_discount
      this.productobj.ROL = checkproductresponse.ROL
      this.productobj.ROQ = checkproductresponse.ROQ
      this.productobj.product_desc = checkproductresponse.product_desc
      this.selectedBrandName = checkproductresponse.brand
      this.inputbrandarray.brand = checkproductresponse.brand;
      // this.inputbrandarray.brandId = checkproductresponse.brand_id;
      // this.brandobj.brand = checkproductresponse.brand
      // this.brandobj.brand_id = checkproductresponse.brand_id
      this.selectedcategoryname = checkproductresponse.category
      // this.categoryObj.category = checkproductresponse.category
      // this.categoryObj.category_id = checkproductresponse.category_id

      this.inputcategoryArray.category = checkproductresponse.category;
      // this.inputcategoryArray.categoryId = checkproductresponse.category_id;

    }else{
      console.log("the data inside the checkFullProductId false",data)
    }


  })
}

editproduct_popup(productpage_orginal,_id,fullproductdata){

  this.fullproductdata_foredit = fullproductdata
  this.brandnameforedit = fullproductdata.brand
  this.modelnameforedit = fullproductdata.model
  this.categorynameforedit = fullproductdata.category

  this.modelpopup = this.dialogModal.open(productpage_orginal, {

     size: 'xl'

  })
}


hidebrandDropdown() {
  setTimeout(() => this.showDropdown = false, 400);
}

hidecategoryDropdown() {
  setTimeout(() => this.showcategoryDropdown = false, 400);
}
hidemodelDropdown() {
  setTimeout(() => this.showmodelDropdown = false, 400);
}

update_product(){


  console.log("the updated product data",this.fullproductdata_foredit)


  this.LocalStoreService.updateproduct_inventory(this.fullproductdata_foredit).subscribe(data=>{

    this.fetchProducts()

    // this.LocalStoreService.get_inventory_products().subscribe(data => {
    //   this.productsdata = data.response;
    // })
    this.closedialog();

  })

}

onSupplierChange(supplierId: string) {
  const selectedSupplier = this.allsupplierdata.find(supplier => supplier._id === supplierId);
  if (selectedSupplier) {
      console.log('Selected Supplier Name:', selectedSupplier.name);
      this.fullproductdata_foredit.supplier_name = selectedSupplier.name
  }
}



onUpload(): void {
  if (!this.selectedFile ) {
    this.uploadStatus = 'Please select a file and ensure branch ID is provided';
    return;
  }

  this.uploadStatus = 'Uploading...';

  // Call the service to upload the file and branchId
  this.LocalStoreService.uploadExcelToDB(this.selectedFile)
    .subscribe(
      response => {
        console.log('Upload successful:', response);
        this.uploadStatus = 'Upload successful!';
        this.toastr.success('excel uploaded sucessfully!', 'Success!', { timeOut: 3000 });
      },
      error => {
        console.error('Upload error:', error);
        this.uploadStatus = 'Upload failed. Please try again.';
      }
    );
}

onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
  console.log("this is selected file",  this.selectedFile)
}


onFileSelected_customerdata(event: any): void {

  this.selectedFile_customerdata = event.target.files[0];
  console.log("this is selected file",  this.selectedFile_customerdata)

}


onFileSelected_bulletdata(event: any): void {

  this.selectedFile_bulletdata = event.target.files[0];
  console.log("this is selected file",  this.selectedFile_bulletdata)

}

onUpload_bulletdata(){
  if (!this.selectedFile_bulletdata ) {
    this.uploadStatus = 'Please select a file and ensure branch ID is provided';
    return;
  }

  this.uploadStatus = 'Uploading...';

  // Call the service to upload the file and branchId
  this.LocalStoreService.uploadExcelToDB_bulletdata(this.selectedFile_bulletdata)
    .subscribe(
      response => {
        console.log('Upload successful:', response);
        this.uploadStatus = 'Upload successful!';
        this.toastr.success('excel uploaded sucessfully!', 'Success!', { timeOut: 3000 });
      },
      error => {
        console.error('Upload error:', error);
        this.uploadStatus = 'Upload failed. Please try again.';
      }
    );

}

onUpload_customerdata(){
  if (!this.selectedFile_customerdata ) {
    this.uploadStatus = 'Please select a file and ensure branch ID is provided';
    return;
  }

  this.uploadStatus = 'Uploading...';

  // Call the service to upload the file and branchId
  this.LocalStoreService.uploadExcelToDB_customerdata(this.selectedFile_customerdata)
    .subscribe(
      response => {
        console.log('Upload successful:', response);
        this.uploadStatus = 'Upload successful!';
        this.toastr.success('excel uploaded sucessfully!', 'Success!', { timeOut: 3000 });
      },
      error => {
        console.error('Upload error:', error);
        this.uploadStatus = 'Upload failed. Please try again.';
      }
    );

}






}
