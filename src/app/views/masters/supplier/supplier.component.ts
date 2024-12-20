import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  // animations: [SharedAnimations]
})
export class SupplierComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage: number = 0;
  startIndex: number = 0;
  rowsPerPage: number = 10;
  totalRecords: number = 0;
  allmasterdata: any[] = [];
  pagedData: any[] = [];
  searchTerm: string = '';
  dialogref: any;
  vendorid: any;
  editvendorsdata: any;
  selectedValue: string;
  sup_invno: string;

  vendorDetails = {
    name: '',
    relation: '',
    type: ''
  };

  contactDetails = {
    mobile: '',
    email: '',
    address: '',
    state: '',
    pincode: ''
  };

  taxDetails = {
    pan: '',
    gst: ''
  };


  dropdownItems = [
    { id: 1, name: 'Link 1' },
    { id: 2, name: 'Link 2' },
    { id: 3, name: 'Link 3' }
  ];


  inputDataArray = [];
  total_amount_receipt: any;
  total_cgst_receipt: any;
  total_sgst_receipt: any;
  total_igst_receipt: any
  isspareclicked: boolean = false;
  // supplierid_reciptid: any;
  supplier_credential: any;
  sup_receiptdate: string;
  mandatoryfields: boolean = false;
  mondatorydate: boolean = false;
  mandatoryinvno: boolean = false;
  mandatoryname: boolean = false;
  todaysdate: string;
  selectedDate: any;
  sup_paymentdata: any;
  selectedSupplier: any;
  payscreen: boolean = false;
  formrequired: boolean = false;

  banks: string[] = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Bank of Baroda',
    'Indian Bank',
    'Canara Bank',
    'Syndicate Bank',
    // Add more banks as needed
  ];

  selectedBank: any
  bankpage: boolean = false;
  upipage: boolean = false;
  choosedbank: any;
  paymentDate: any;
  paymentCash: any;
  payid: any;
  utrNumber: string;
  upiNumber: string;
  balancepay: number;
  expenseheads: any;
  selectedHead: string;
  showAddheads = false;
  newHead: string;



// multiselect testing

branddata: any[] = [];
  categorydata: any[] = [];
  selectedBrands: string[] = []; // Holds selected brands
  selectedCategories: string[] = []; // Holds selected categories
  showBrandDropdown = false;
  showCategoryDropdown = false;
inputbrandarray = {
    brand: "",
    brandId: ""
  }
  inputcategoryArray = {
    category: "",
    categoryId: ""
  }
  expence_head_popup: any;

// multiselect testing







  constructor(
    private LocalStoreService: LocalStoreService,
    private dialog: MatDialog, 
    private fb: FormBuilder,
    private model : NgbModal


  ) {


  }

  ngOnInit() {

    this.getexpenseheads()
    this.getvendardata();

    this.todaysdate = moment(new Date).format('YYYY-MM-DD hh:mm A');


    this.getBrands();
    this.getCategory();
  }



  getBrands() {
    this.LocalStoreService.get_inventory_brands().subscribe(data => {
      console.log('this is brand data total>>>>>>>>>>>>>>>>>>>>>', data)
      this.branddata = data.response
      console.log("this is brand data>>>>>>>>>>>>>>>>>>>>>>>>", this.branddata)
    })
  }
  getCategory() {
    this.LocalStoreService.get_category_inventory().subscribe(data => {
      this.categorydata = data.response
    })
  }



  toggleBrandDropdown(event: Event): void {
    event.stopPropagation();
    this.showBrandDropdown = !this.showBrandDropdown;
    this.showCategoryDropdown = false;
  }

  toggleCategoryDropdown(event: Event): void {
    event.stopPropagation();
    this.showCategoryDropdown = !this.showCategoryDropdown;
    this.showBrandDropdown = false;
  }

  onBrandCheckboxChange(event: Event, brand: any): void {
    event.stopPropagation(); // Prevents the dropdown from closing
    const target = event.target as HTMLInputElement;
    
    if (target.checked) {
      this.selectedBrands.push(brand.brand);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand.brand);
    }
  }

  onCategoryCheckboxChange(event: Event, category: any): void {
    event.stopPropagation(); // Prevents the dropdown from closing
    const target = event.target as HTMLInputElement;
    
    if (target.checked) {
      this.selectedCategories.push(category.category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category.category);
    }
  } 









  getvendardata() {
    var cursor = '';
    this.LocalStoreService.getvendardata(cursor).subscribe(data => {
      this.allmasterdata = data.response;
      this.totalRecords = this.allmasterdata.length;
      this.updatePagedData();
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.rowsPerPage = event.pageSize;
    this.startIndex = this.currentPage * this.rowsPerPage;
    this.updatePagedData();
  }

  updatePagedData() {
    const filteredData = this.allmasterdata.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
    this.totalRecords = filteredData.length;
    this.pagedData = filteredData.slice(this.startIndex, this.startIndex + this.rowsPerPage);
  }

  filterData() {
    this.currentPage = 0;
    this.startIndex = 0;
    this.updatePagedData();
  }


  editvendorpopup(vendoreditpage, vendorid) {

    this.vendorid = vendorid

    this.LocalStoreService.getvendor_byid(this.vendorid).subscribe(data => {
      this.editvendorsdata = data.response;
    });
    this.model.open(vendoreditpage,{
      // fullscreen : "md"
      size : "lg"
    })
    return;

  }



  editvendorsdatas(vendorid, editvendorsdata) {
    editvendorsdata.forEach(data => {
      if (data.type == "Individual") {
        data.individual = true
        data.business = false
      } else {
        data.business = true
        data.individual = false
      }
      this.LocalStoreService.editvendor_byid(vendorid, data).subscribe(data => {

      });
    })
    this.dialogref.close()
    this.getvendardata();
  }


  onRelationshipSinceChange(data) {
    const dateParts = data.relationship_since.split("-");
    data.relationship_since = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }


  createvendorpopup(vendorcreatepage) {

    this.dialogref = this.model.open(vendorcreatepage,{
      // fullscreen : "md"
      size : "xl"
    })

    
    return;

    this.reset()

    this.dialogref = this.dialog.open(vendorcreatepage, {
      width: '70%',
      height: '100%'
    });

  }
// closeEdit(){
//   this.model.
// }

  createVendor() {

    this.formrequired = true


    console.log("the data inside the multiselect",this.selectedBrands)
    console.log("the data inside the multiselect categories",this.selectedCategories)


    // return

    if (this.contactDetails.mobile != '' && this.vendorDetails.name != '') {

      this.LocalStoreService.create_vendor(this.vendorDetails, this.contactDetails, this.taxDetails, this.selectedHead,this.selectedBrands,this.selectedCategories).subscribe(data => {
        console.log("registered data: ", data);

        this.dialogref.close()
        this.getvendardata();
      })

    }

  }
  reset() {
    this.vendorDetails = {
      name: '',
      relation: '',
      type: ''
    };
    this.contactDetails = {
      mobile: '',
      email: '',
      address: '',
      state: '',
      pincode: ''
    };
    this.taxDetails = {
      pan: '',
      gst: ''
    };
  }


  supplierreceipt_popup(supplierreceipt_page) {

    this.dialogref = this.dialog.open(supplierreceipt_page, {
      width: '65%',
      height: '80%'
    });

  }


  supplierpay_popup(supplierpayment_page) {

    this.sup_paymentdata = []

    this.dialogref = this.dialog.open(supplierpayment_page, {
      width: '70%',
      height: '80%'
    });

  }


  onSelectionChange(event: MatSelectChange) {
    console.log('Selected ID:', event.value);

    this.supplier_credential = event.value
  }


  onSelectionChange_payment(event: MatSelectChange) {


    var receipt = 0
    var payment = 0

    this.supplier_credential = event.value

    this.LocalStoreService.sup_transbyid(event.value).subscribe(data => {

      console.log("the data of the supplierrrrrrrr", data.response)

      var paymentdata = data.response

      var objectdatapay

      paymentdata.forEach(data => {
        objectdatapay = data
      })
      if (data.response.length > 0) {
        this.sup_paymentdata = objectdatapay


        objectdatapay.transaction.forEach(data => {
          if (data.receiptpayment.totalreceipt_amount) {
            receipt += data.receiptpayment.totalreceipt_amount
          }
          if (data.receiptpayment.payment) {
            payment += data.receiptpayment.payment
          }
        })

        this.balancepay = receipt - payment
      }





    })
  }


  formatDate(event: any) {
    this.sup_receiptdate = moment(event.value).format('YYYY-MM-DD hh:mm A');
  }


  addInputField() {

    this.isspareclicked = true
    this.inputDataArray.push({ spare: '', qty: '', rate: '', gst: '', gst18: '', gst28: '', });


  }

  handleCheckboxChange(data, checkboxType) {
    if (checkboxType === 'gst18') {
      data.gst28 = false;
    } else if (checkboxType === 'gst28') {
      data.gst18 = false;
    }


    this.calculateAmount(data);
    // this.extraspares = [...this.extraspares];
  }


  calculateAmount(data) {

    // this.total_amount_receipt = 0
    // this.total_cgst_receipt = 0
    // this.total_sgst_receipt = 0
    const qty = parseFloat(data.qty) || 0;
    const rate = parseFloat(data.rate) || 0;
    let gstRate = 0;

    if (data.gst18) {
      gstRate = 18;
      data.gst = "18%"
    } else if (data.gst28) {
      gstRate = 28;
      data.gst = "28%"
    }

    var amount = qty * rate;

    data.totalgst = (amount * gstRate) / 100
    // var cgst = (data.amount * gstRate) / 100;
    // data.cgst = cgst/ 2;
    // var sgst = (data.amount * gstRate) / 100;
    // data.sgst = sgst / 2 ;


    // this.inputDataArray.forEach(inputalldata=>{
    //   this.total_amount_receipt += inputalldata.amount
    //   this.total_cgst_receipt += inputalldata.cgst
    //   this.total_sgst_receipt += inputalldata.sgst
    // })


  }

  // supplier_receipt(){
  //   this.mandatoryfields = false
  //   this.mondatorydate = false
  //   this.mandatoryinvno = false

  //   if(this.sup_invno == undefined){
  //   this.mandatoryinvno = true
  //   }

  //   if(this.sup_receiptdate == undefined){
  //   this.mondatorydate = true
  //   }

  //   if(this.sup_invno != undefined || this.sup_receiptdate != undefined || this.sup_receiptdate != null || this.sup_invno != "" ){
  //     console.log("enter to save",this.sup_invno )
  //     this.mandatoryfields = false
  //     this.LocalStoreService.postsupplierreceipt(this.supplier_credential,this.inputDataArray,this.sup_receiptdate,this.sup_invno,this.total_amount_receipt,this.total_cgst_receipt,this.total_sgst_receipt).subscribe(data=>{
  //       this.dialogref.close()

  //       this.inputDataArray = [],
  //       this.total_amount_receipt = 0,
  //       this.total_cgst_receipt = 0,
  //       this.total_sgst_receipt = 0,
  //       this.selectedDate = ""
  //       this.sup_invno = ""
  //     })
  //   }else{
  //     console.log("enter to notsave")
  //     this.mandatoryfields = true
  //   }
  // }


  // supplier_receipt() {
  //   // Reset flags
  //   this.mandatoryfields = false;
  //   this.mondatorydate = false;
  //   this.mandatoryinvno = false;

  //   let hasErrors = false;

  //   if (!this.sup_invno) {
  //     this.mandatoryinvno = true;
  //     hasErrors = true;
  //   }

  //   if (!this.sup_receiptdate) {
  //     this.mondatorydate = true;
  //     hasErrors = true;
  //   }

  //   this.inputDataArray.forEach(item => {
  //     if (!item.spare || !item.qty || !item.rate || !item.amount || !item.cgst || !item.sgst || !item.igst) {
  //       hasErrors = true;
  //     }
  //   });

  //   if (!this.total_amount_receipt || !this.total_cgst_receipt || !this.total_sgst_receipt) {
  //     hasErrors = true;
  //   }

  //   if (hasErrors) {
  //     this.mandatoryfields = true;
  //   } else {
  //     console.log("enter to save", this.sup_invno);
  //     this.LocalStoreService.postsupplierreceipt(this.supplier_credential, this.inputDataArray, this.sup_receiptdate, this.sup_invno, this.total_amount_receipt, this.total_cgst_receipt, this.total_sgst_receipt,this.total_igst_receipt).subscribe(data => {
  //       this.dialogref.close();
  //       this.inputDataArray = [];
  //       this.total_amount_receipt = 0;
  //       this.total_cgst_receipt = 0;
  //       this.total_sgst_receipt = 0;
  //       this.selectedDate = "";
  //       this.sup_invno = "";
  //     });
  //   }
  // }




  isFormValid() {
    return this.selectedSupplier && this.selectedDate && this.sup_invno &&
      this.inputDataArray.every(data => data.spare && data.qty && data.rate && data.amount && data.cgst && data.sgst && data.igst) &&
      this.total_amount_receipt && this.total_cgst_receipt && this.total_sgst_receipt && this.total_igst_receipt;
  }


  paymentscreen() {
    this.payscreen = true
  }


  selectPaymentMethod(method) {
    // Implement your logic based on the selected payment method
    console.log('Selected payment method:', method);

    if (method == "Bank") {
      this.bankpage = true
      this.payscreen = true
      this.upipage = false
    } else {
      this.upipage = true
      this.bankpage = false
      this.payscreen = true

    }
  }

  onBankChange(bank) {

    this.choosedbank = bank

  }


  proceedpayment(upipage, paymentDate, payid, paymentCash) {

    var formateddate_pay = moment(paymentDate).format('YYYY-MM-DD hh:mm A');

    console.log("the data inside the proceed payment", formateddate_pay, payid, paymentCash)

    this.LocalStoreService.postpayments_forsupplier(this.supplier_credential, "", formateddate_pay, payid, paymentCash, this.choosedbank, "", "", "").subscribe(data => {
      this.paymentDate = ""
      this.paymentCash = ""
      this.utrNumber = ""
      this.upiNumber = ""

      this.LocalStoreService.sup_transbyid(this.supplier_credential).subscribe(data => {
        var paymentdata = data.response
        var objectdatapay
        paymentdata.forEach(data => {
          objectdatapay = data
        })
        if (data.response.length > 0) {
          this.sup_paymentdata = objectdatapay
        }
      })
      this.supplier_credential = ''

    })

  }

  businessTypeCheck() {
    if (this.vendorDetails.type === 'Individual') {
      this.taxDetails.gst = '';
    }
  }


  closecreatevendor() {
    this.model.dismissAll()
  }
  closeeditvendor() {
    this.model.dismissAll()
  }


  getexpenseheads() {
    this.LocalStoreService.getexpenseheads().subscribe(data => {
      this.expenseheads = data.response
    })
  }


  onexpenseChange(event: any) {
    if (event.target.value === 'addNew') {
      this.showAddheads = true;
    } else {
      this.showAddheads = false;
    }
  }

  // saveNewHead() {
  //   if (this.newHead) {


  //     this.LocalStoreService.add_expensehead(this.newHead).subscribe(data=>{
  //     })
  //     this.expenseheads.allheads.push({ head: this.newHead });
  //     this.newHead = ''; 
  //     this.showAddheads = false;
  //     this.selectedHead = "" 
  //   }
  // }


  // saveNewHead() {
  //   if (this.newHead) {
  //     const headExists = this.expenseheads.allheads.some(headObj => 
  //       headObj.head.toLowerCase() === this.newHead.toLowerCase()
  //     );

  //     if (headExists) {
  //       if (confirm(`The head "${this.newHead}" already exists. Do you want to add it ?`)) {
  //         this.addHead();
  //       } else {
  //         return;
  //       }
  //     } else {
  //       this.addHead();
  //     }
  //   }
  // }

  headExists: boolean = false;  // Add a property to track head existence
  MIN_LENGTH_FOR_CHECK = 4;     // Minimum length of characters before checking

  matchingHead: string | null = null;  // To store the matching head
  alertShown: boolean = false;         // To track if alert has been shown

  checkHeadExistence() {
    if (this.newHead.length >= this.MIN_LENGTH_FOR_CHECK) {
      const matchingHeadObj = this.expenseheads.allheads.find(headObj =>
        headObj.head.toLowerCase().includes(this.newHead.toLowerCase())
      );

      if (matchingHeadObj) {
        this.matchingHead = matchingHeadObj.head;
        if (!this.alertShown) {
          alert(`A head containing "${this.newHead}" already exists: "${this.matchingHead}".`);
          this.alertShown = true;
        }
      } else {
        this.matchingHead = null;
      }
    } else {
      this.matchingHead = null;
    }
  }

  matchingperfectHead: string | null = null;  // To store the matching head

  saveNewHead() {
    if (this.newHead) {

      const headperfectexist = this.expenseheads.allheads.some(headObj1 =>
        headObj1.head.toLowerCase() === this.newHead.toLowerCase())


      const headExists = this.expenseheads.allheads.some(headObj =>
        headObj.head.toLowerCase().includes(this.newHead.toLowerCase())
      );


      if (headperfectexist) {

        this.matchingperfectHead = headperfectexist.head;


        // if (!this.alertShown) {
        alert(`A head containing "${this.newHead}" already exists`);
        // this.alertShown = true; 
        // }

      } else if (headExists) {
        if (confirm(`A head containing "${this.newHead}" already exists. Do you want to add it?`)) {
          this.addHead();
          this.alertShown = false;
        }

      }

      // if (headExists) {
      //   if (confirm(`A head containing "${this.newHead}" already exists. Do you want to add it?`)) {
      //     this.addHead();
      //     this.alertShown = false; 
      //   }
      // } 
      else {
        this.addHead();
        this.alertShown = false;
      }
    }
  }




  addHead() {
    this.LocalStoreService.add_expensehead(this.newHead).subscribe(data => {
    });

    this.expenseheads.allheads.push({ head: this.newHead });
    this.newHead = '';
    this.showAddheads = false;
    this.selectedHead = "";
    this.close_expenhead_popup()
  }


  closedialog() {
    this.dialogref.close()
  }

  close_expenhead_popup(){

    this.expence_head_popup.close()

  }

  addnew_expence_popup(addnew_expencepage){

     this.expence_head_popup= this.model.open(addnew_expencepage,{
      
      size : "md"
    })
    

  }

  onExpenseChange(event: Event,addnew_expencepage): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    if (selectedValue === 'addNew') {
      this.addnew_expence_popup(addnew_expencepage);
      this.selectedHead = ''; // Optional: reset the selection if needed
    }
  }
  
}
