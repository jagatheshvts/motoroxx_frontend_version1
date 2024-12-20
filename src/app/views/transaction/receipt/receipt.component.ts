



import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

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


  inputDataArray: any[] = []
  total_amount_receipt: any = "0.00";
  total_cgst_receipt: any = "0.00";
  total_sgst_receipt: any = "0.00";
  total_igst_receipt: any = "0.00"
  receipt_total: any = "0.00";
  total_tax_receipt: any = "0.00";
  grand_total: any = "0.00";
  amount_before_tax: any = "0.00";
  tax_total: any = "0.00";
  amount_after_tax: any = "0.00";
  round_off: any = "0.00";
  rowTotal: any = "0.00";
  noOfItems: any = ""
  receiptTotalData: any[] = [];

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

  banks: string[] = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Bank of Baroda',
    'Indian Bank',
    'Canara Bank',
    'Syndicate Bank',
  ];

  selectedBank: any
  bankpage: boolean = false;
  upipage: boolean = false;
  choosedbank: any;
  paymentDate: any;
  paymentCash: any;
  payid: any;
  utiNumber: string;
  upiNumber: string;
  balancepay: number;
  suppliercontainercard: boolean = false;
  suptype: any;
  supmobile: any;
  supaddress: any;
  supgstno: any;
  forparticularpopup_alldata: any;
  forparticularpopup_index: any;
  forparticularpopup_length: any;
  particularpopupdata: any;
  particularpopupdata_for: any;
  particularpopupdata_transdate: any;
  particularpopupdata_transref: any;
  particularpopupdata_amount: any;
  inventorycustomer:boolean = false
  invetory_brands: any;
  invetory_category: any;
  inventory_brandid: any;
  inventory_categoryid: any;
  isDropdownOpen: boolean;
  modelpopup_conform_popup: any;
  inputindexnumber: any;
  checkedproductmrp: any;
  receiptdata_foredit = [];
  edittable_receipt: boolean = false;
  supplier_receipt_id: any;
  receiptupdateindex: any;
  checking_input_conform_mrp_popup: boolean = false;
  finalinputlength: number;
  branddata_full: any;
  branddata: string[];

  constructor(private LocalStoreService: LocalStoreService, private dialog: MatDialog, private fb: FormBuilder,private dialogModal: NgbModal) { }

  ngOnInit(): void {


  

    this.getvendardata();
    this.calculateTotals()
    this.todaysdate = moment(new Date).format('YYYY-MM-DD hh:mm A');
     
    var customerinventory = localStorage.getItem("customerinventory");
    
    if(customerinventory == "false"){
      this.inventorycustomer = false
    }else{
      this.inventorycustomer = true 
    }

    this.get_inventorybrands()
    this.get_inventorycategory()
  }

  getvendardata() {
    var cursor = '';
    this.LocalStoreService.getvendardata(cursor).subscribe(data => {
      this.allmasterdata = data.response;
      this.totalRecords = this.allmasterdata.length;
      this.updatePagedData();
    });
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





  supplier_receipt() {
    console.log(" enter into receipt Saving method");
    this.mandatoryfields = false;
    this.mondatorydate = false;
    this.mandatoryinvno = false;
    let hasErrors = false;

    // Basic field validations
    if (!this.sup_invno) {
      this.mandatoryinvno = true;
      hasErrors = true;
    }

    if (!this.sup_receiptdate) {
      this.mondatorydate = true;
      hasErrors = true;
    }

    this.receiptTotalData.forEach(item => {
      if (!this.noOfItems || !item.amount_before_tax || !item.tax_total || item.amount_after_tax || !item.round_off || !item.grand_total) {
        hasErrors = true;
      }
    })

    if (!this.noOfItems||!this.amount_before_tax || !this.tax_total || !this.amount_after_tax || !this.round_off || !this.grand_total) {
      hasErrors = true;
    }

    if (hasErrors) {
      this.mandatoryfields = true;
    } else {
      // Call the service to post supplier receipt data
      this.LocalStoreService.postsupplierreceipt(
        this.supplier_credential,
        this.receiptTotalData,
        this.sup_receiptdate,
        this.sup_invno,
        this.noOfItems,
        this.amount_before_tax,
        this.tax_total,
        this.amount_after_tax,
        this.round_off,
        this.grand_total,
      ).subscribe(response => {
        console.log('Receipt saved successfully:', response);
        this.resetInput();
      });
    }
  }

  
    
  supplier_receipt_inventory(conform_mrp_popup){


    console.log("the data insid the inputdataarray",this.inputDataArray.length)
    console.log("the data insid the inputdataarray",this.inputDataArray)
     
    
   
    // return
   if(this.inputDataArray.length == 1){

    this.LocalStoreService.checkproduct(this.inputDataArray[0].prodid).subscribe(data=>{

      if(data.response.coststatus == 1){
        this.checkedproductmrp = data.response.productmrp

        this.inputindexnumber = 1

        this.checking_input_conform_mrp_popup = true
         
        this.modelpopup_conform_popup = this.dialogModal.open(conform_mrp_popup, {

          size: 'lg'
        })


      }else{

        this.inputDataArray.forEach(data=>{
          data.brand_id =  data.brand._id
          data.brand = data.brand.brand
          data.category_id = data.category._id
          data.category = data.category.category
        })
  
        console.log("the data inside the inputDataArray in the final submit",this.inputDataArray)
  
        this.LocalStoreService.supplier_receipt_inventory(this.supplier_credential,this.inputDataArray,this.inventory_brandid,this.sup_receiptdate,this.sup_invno,this.total_amount_receipt, this.total_cgst_receipt, this.total_sgst_receipt, this.total_igst_receipt, this.receipt_total, this.amount_before_tax, this.tax_total, this.amount_after_tax, this.round_off, this.grand_total).subscribe(data=>{
  
  
          this.inputDataArray = [];
         
             this.total_amount_receipt = '0.00';
          this.total_cgst_receipt = '0.00';
          this.total_sgst_receipt = '0.00';
          this.total_igst_receipt = '0.00';
          this.receipt_total = '0.00';
          this.selectedDate = "";
          this.sup_invno = "";
          this.amount_before_tax = "";
          this.amount_after_tax = "";
          this.tax_total = "";
          this.round_off = "";
          this.grand_total = "";
          this.selectedSupplier = ""
          this.supaddress = ""
          this.supmobile = ""
          this.supgstno = ""
          this.selectedBank = ""
          this.isspareclicked = false
        })

        this.checking_input_conform_mrp_popup = false

      }

    })

   }else{
    this.finalinputlength= this.inputDataArray.length - 1 
    this.LocalStoreService.checkproduct(this.inputDataArray[this.finalinputlength].prodid).subscribe(data=>{

      if(data.response.coststatus == 1){
        this.checkedproductmrp = data.response.productmrp

        this.inputindexnumber = this.finalinputlength

        this.checking_input_conform_mrp_popup = true
         
        this.modelpopup_conform_popup = this.dialogModal.open(conform_mrp_popup, {
          size: 'lg'
        })
      }else{

        this.inputDataArray.forEach(data=>{
          data.brand_id =  data.brand._id
          data.brand = data.brand.brand
          data.category_id = data.category._id
          data.category = data.category.category
        })
  
        console.log("the data inside the inputDataArray in the final submit",this.inputDataArray)
  
        this.LocalStoreService.supplier_receipt_inventory(this.supplier_credential,this.inputDataArray,this.inventory_brandid,this.sup_receiptdate,this.sup_invno,this.total_amount_receipt, this.total_cgst_receipt, this.total_sgst_receipt, this.total_igst_receipt, this.receipt_total, this.amount_before_tax, this.tax_total, this.amount_after_tax, this.round_off, this.grand_total).subscribe(data=>{
  
  
          this.inputDataArray = [];
         
             this.total_amount_receipt = '0.00';
          this.total_cgst_receipt = '0.00';
          this.total_sgst_receipt = '0.00';
          this.total_igst_receipt = '0.00';
          this.receipt_total = '0.00';
          this.selectedDate = "";
          this.sup_invno = "";
          this.amount_before_tax = "";
          this.amount_after_tax = "";
          this.tax_total = "";
          this.round_off = "";
          this.grand_total = "";
          this.selectedSupplier = ""
          this.supaddress = ""
          this.supmobile = ""
          this.supgstno = ""
          this.selectedBank = ""
          this.isspareclicked = false
        })
      }

    })
   } 

     


  }

  //now uncommented for test end

  receiptValue() {
    console.log('Enter in the save method>>>>>>', this.sup_receiptdate);
    this.mandatoryfields = false;
    this.mondatorydate = false;
    this.mandatoryinvno = false;
    let hasErrors = false;
    if (!this.sup_invno) {
      this.mandatoryinvno = true;
      hasErrors = true;
    }
    if (!this.sup_receiptdate) {
      this.mondatorydate = true;
      hasErrors = true;
    }
    this.receiptTotalData.forEach(item => {
      if (!this.noOfItems || !item.amount_before_tax || !item.tax_total || item.amount_after_tax || !item.round_off || !item.grand_total) {
        hasErrors = true;
      }
    })
   
    if (hasErrors) {
      this.mandatoryfields = true;
    } else {
      console.log("before receiptTotalData:", this.receiptTotalData);
      const receiptItems = {
        no_of_items: this.noOfItems,
        before_tax: this.amount_before_tax,
        tax_amount: this.tax_total,
        after_tax: this.amount_after_tax,
        round_off_value: this.round_off,
        total: this.grand_total
      }
      this.receiptTotalData.push(receiptItems);
      console.log("after pushed>>>>>>>", this.receiptTotalData)
      this.LocalStoreService.receiptTotalValue(
          this.supplier_credential,
          this.receiptTotalData,
          this.sup_receiptdate,
          this.sup_invno
      ).subscribe(data => {
        this.sup_invno= '';
        this.receiptTotalData = [];
        this.supplier_credential = '';
        this.sup_receiptdate;
      });
    }
  }


  addInputField(i,conform_mrp_popup) {

    this.isspareclicked = true
    this.inputDataArray.push(
      { brand: '',brand_id: '',category_id: '',category:'','prodid':'','prodName':'',HSN:'', unitmeasurement: '0.00', MRP:'', qty: '', rate: '0.00',gst:'', cgst: '0.00', sgst: '0.00', igst: '0.00',total:'0.00' },
    );

    if(this.inputDataArray.length > 0){

      this.LocalStoreService.checkproduct(this.inputDataArray[i].prodid).subscribe(data=>{

        if(data.response.coststatus == 1){

          console.log("the data entered into the else there is matching product",data)
  
  
          this.checkedproductmrp = data.response.productmrp

          this.inputindexnumber = i
           
          this.modelpopup_conform_popup = this.dialogModal.open(conform_mrp_popup, {
  
            size: 'lg'
          })
        }

      })
    }
    this.calculateTotals();
  }

  deleteInputField(index: number): void {
    this.inputDataArray.splice(index, 1);
    this.calculateTotals();
  }

  additemsopen() {

    this.isspareclicked = true
  

    this.inputDataArray.push(
      { brand: '',brand_id:'',category_id:'', category:'','prodid':'','prodName':'',HSN:'', unitmeasurement: '0.00', MRP:'', qty: '', rate: '0.00',gst:'', cgst: '0.00', sgst: '0.00', igst: '0.00',total:'0.00' },
    );

  }


  onSelectionChange(event: any) {
    const target = event.target as HTMLSelectElement;
    const selectIndex = target.selectedIndex;
    const selectedItem = this.allmasterdata[selectIndex]
    this.selectedSupplier = selectedItem;

    // Check and log the selected item
    if (selectedItem) {
      console.log("Selected Item:", selectedItem);
      console.log('Selected ID:', selectedItem._id); // Make sure _id exists in your data
    } else {
      console.error("Selected item is undefined or null");
    }
    this.suppliercontainercard = true
    this.supplier_credential = selectedItem
    this.LocalStoreService.getvendor_byid(selectedItem._id).subscribe(data => {
      var forsuppliercontainer = data.response
      var objectdataforsupplier
      forsuppliercontainer.forEach(data => {
        objectdataforsupplier = data
        this.suptype = data.type
        this.supmobile = data.mobile
        this.supaddress = data.address1
        this.supgstno = data.gstno
        this.suptype = data.type
      })
      console.log('this is object data container>>>>>>>>>>>>', forsuppliercontainer)
    });

    this.LocalStoreService.sup_transbyid(selectedItem._id).subscribe(data => {
      var receipt = 0
      var payment = 0

      console.log("the data of the supplierrrrrrrr", data.response)

      var paymentdata = data.response;
      console.log("this is payment data***********************", paymentdata)

      var objectdatapay

      paymentdata.forEach(data => {
        objectdatapay = data


      })
      if (data.response.length > 0) {
        this.sup_paymentdata = paymentdata[0];
        console.log("this is sup data>>>>********************************", this.sup_paymentdata)

        this.sup_paymentdata.transaction.forEach(transaction => {
          if (transaction.receiptpayment.totalreceipt_amount) {
            receipt += transaction.receiptpayment.totalreceipt_amount;
            console.log("Updated receipt total:", receipt);
          }
          if (transaction.receiptpayment.payment) {
            payment += transaction.receiptpayment.payment;
            console.log("Updated payment total:", payment);
          }
          
          if (transaction.receiptpayment.grand_total) {
            receipt += transaction.receiptpayment.grand_total;
            console.log("Grand total added to receipt:", transaction.receiptpayment.grand_total);
          }
        });
        this.balancepay = receipt - payment
        console.log("this is balance pay::::=>>>>", this.balancepay)
      }
    })
  }
 
  

  formatDate(event: any) {
    this.sup_receiptdate = moment(event.value).format('YYYY-MM-DD hh:mm A');
  }




  handleFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    if (value === '0.00') {
      target.value = '';
    } else if (value.endsWith('.00')) {
      target.setSelectionRange(value.length - 3, value.length - 3);
    }
  }

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    value = value.replace(/[^0-9.]/g, '');

    let parts = value.split('.');
    if (parts[0] !== '') {
      parts[0] = parts[0].replace(/^0+/, '') || '0';
    }

    value = parts.join('.');

    if (!value.includes('.')) {
      value += '.00';
    } else if (value.split('.')[1].length === 0) {
      value += '00';
    } else if (value.split('.')[1].length === 1) {
      value += '0';
    }

    target.value = value;

    target.setSelectionRange(value.length - 3, value.length - 3);
  }

  handleBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    if (!value || isNaN(+value)) {
      target.value = '0.00';
    } else {
      let parts = value.split('.');
      if (parts.length === 1) {
        target.value = `${parts[0]}.00`;
      } else {
        target.value = `${parts[0]}.${(parts[1] || '').padEnd(2, '0')}`;
      }
    }
  }




  handleCheckboxChange(gst, checkboxType) {
    if (checkboxType === 'gst18') {
      gst.gst28 = false;
    } else if (checkboxType === 'gst28') {
      gst.gst18 = false;
    }
  }


  getTruncatedText(text: string): string {
    const maxLength = 60;
    const dots = '....';
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + dots;
    }
    return text;
  }



  openparticularpopup(particularpage, data, alldata, index) {

    this.forparticularpopup_alldata = alldata
    this.forparticularpopup_index = index
    this.forparticularpopup_length = alldata.length

    this.particularpopupdata = alldata[index].receiptpayment.joinedparticulars || alldata[index].receiptpayment.particulars

    this.particularpopupdata_for = alldata[index].receiptpayment.for
    this.particularpopupdata_transdate = alldata[index].receiptpayment.date
    this.particularpopupdata_transref = alldata[index].receiptpayment.particulars
    this.particularpopupdata_amount = alldata[index].receiptpayment.totalreceipt_amount || alldata[index].receiptpayment.payment

    this.particularpopupdata = alldata[index].receiptpayment.joinedparticulars || alldata[index].receiptpayment.particulars

    this.dialogref = this.dialog.open(particularpage, {
      width: '32%',
      // height:'80%'
    });
  }

  previousparticular() {

    if (this.forparticularpopup_index > 0) {
      this.forparticularpopup_index--
    }
    if (this.forparticularpopup_alldata[this.forparticularpopup_index]) {
      this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for
      this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date
      this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
      this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
      this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
    }
  }

  nextparticular() {

    var totalcontent = this.forparticularpopup_length - 2
    if (totalcontent >= this.forparticularpopup_index) {
      this.forparticularpopup_index++
    }
    if (this.forparticularpopup_alldata[this.forparticularpopup_index]) {
      this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for
      this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date
      this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
      this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
      this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
    }
  }
  calculateTotals() {
    let totalAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let total = 0;

    this.inputDataArray.forEach(item => {
      const totalamount = parseFloat(item.amount) || 0;
      item.amount = totalamount.toFixed(2);
      totalAmount += totalamount;

      const cgst = parseFloat(item.cgst) || 0;
      const sgst = parseFloat(item.sgst) || 0;
      const igst = parseFloat(item.igst) || 0;

      item.rowTotal = (totalamount + cgst + sgst + igst).toFixed(2);
      totalCGST += cgst;
      totalSGST += sgst;
      totalIGST += igst;
    });

    this.total_amount_receipt = totalAmount.toFixed(2);
    this.total_cgst_receipt = totalCGST.toFixed(2);
    this.total_sgst_receipt = totalSGST.toFixed(2);
    this.total_igst_receipt = totalIGST.toFixed(2);

    total = parseFloat(this.total_amount_receipt) + parseFloat(this.total_cgst_receipt) + parseFloat(this.total_sgst_receipt) + parseFloat(this.total_igst_receipt);
    this.rowTotal = total.toFixed(2);
  }

  onUoMChange(event: Event): void {
    console.log('Unit of Measure changed', event.target);
  }


  openCalendar(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.showPicker();
    console.log("this is input date>>>>>>>>>>>>>>>>>>>>>", inputElement, this.selectedDate);

  }
  resetInput() {
    this.grand_total = "";
    this.amount_after_tax = "";
    this.amount_before_tax = "";
    this.tax_total = "";
    this.round_off = "";
    this.noOfItems= "";
  }


  get_inventorybrands(){
    this.LocalStoreService.get_invetory_brands().subscribe(data=>{

      this.invetory_brands = data.response

      console.log("the data inside the inventorybrands",this.invetory_brands)

    })


    // this.LocalStoreService.get_brandmodel_forinventory().subscribe(data => {

    //   this.branddata_full = data.response.vehicles[0]

    //   console.log("the data inside the branddata for inventory ",this.branddata_full)

    //   this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v' );

    //   // console.log("data data of the specific key value", data)

    // })




  }
  get_inventorycategory(){
    this.LocalStoreService.get_category_inventory().subscribe(data=>{

      this.invetory_category = data.response

      console.log("the data inside the inventorybrands",this.invetory_category)

    })
  }



  conform_mrp_popup_process(process){
    if(process == 'no'){

      if(this.checking_input_conform_mrp_popup == false){
        this.inputDataArray[this.inputindexnumber].MRP = this.checkedproductmrp
        this.inputDataArray[this.inputindexnumber].rate = this.checkedproductmrp
        this.modelpopup_conform_popup.close()
      }else{

        this.inputDataArray[this.inputindexnumber].MRP = this.checkedproductmrp
        this.inputDataArray[this.inputindexnumber].rate = this.checkedproductmrp


        this.inputDataArray.forEach(data=>{
          data.brand_id =  data.brand._id
          data.brand = data.brand.brand
          data.category_id = data.category._id
          data.category = data.category.category
        })
  
        console.log("the data inside the inputDataArray in the final submit",this.inputDataArray)
  
        this.LocalStoreService.supplier_receipt_inventory(this.supplier_credential,this.inputDataArray,this.inventory_brandid,this.sup_receiptdate,this.sup_invno,this.total_amount_receipt, this.total_cgst_receipt, this.total_sgst_receipt, this.total_igst_receipt, this.receipt_total, this.amount_before_tax, this.tax_total, this.amount_after_tax, this.round_off, this.grand_total).subscribe(data=>{
  
  
          this.inputDataArray = [];
         
             this.total_amount_receipt = '0.00';
          this.total_cgst_receipt = '0.00';
          this.total_sgst_receipt = '0.00';
          this.total_igst_receipt = '0.00';
          this.receipt_total = '0.00';
          this.selectedDate = "";
          this.sup_invno = "";
          this.amount_before_tax = "";
          this.amount_after_tax = "";
          this.tax_total = "";
          this.round_off = "";
          this.grand_total = "";
          this.selectedSupplier = ""
          this.supaddress = ""
          this.supmobile = ""
          this.supgstno = ""
          this.selectedBank = ""
          this.isspareclicked = false
        })

        this.checking_input_conform_mrp_popup = false
        this.modelpopup_conform_popup.close()





      }
    }else{


      if(this.checking_input_conform_mrp_popup == true){

        this.inputDataArray.forEach(data=>{
          data.brand_id =  data.brand._id
          data.brand = data.brand.brand
          data.category_id = data.category._id
          data.category = data.category.category
        })
  
        console.log("the data inside the inputDataArray in the final submit",this.inputDataArray)
  
        this.LocalStoreService.supplier_receipt_inventory(this.supplier_credential,this.inputDataArray,this.inventory_brandid,this.sup_receiptdate,this.sup_invno,this.total_amount_receipt, this.total_cgst_receipt, this.total_sgst_receipt, this.total_igst_receipt, this.receipt_total, this.amount_before_tax, this.tax_total, this.amount_after_tax, this.round_off, this.grand_total).subscribe(data=>{
  
  
          this.inputDataArray = [];
         
             this.total_amount_receipt = '0.00';
          this.total_cgst_receipt = '0.00';
          this.total_sgst_receipt = '0.00';
          this.total_igst_receipt = '0.00';
          this.receipt_total = '0.00';
          this.selectedDate = "";
          this.sup_invno = "";
          this.amount_before_tax = "";
          this.amount_after_tax = "";
          this.tax_total = "";
          this.round_off = "";
          this.grand_total = "";
          this.selectedSupplier = ""
          this.supaddress = ""
          this.supmobile = ""
          this.supgstno = ""
          this.selectedBank = ""
          this.isspareclicked = false
        })

        this.checking_input_conform_mrp_popup = false
        this.modelpopup_conform_popup.close()

      }
     

      this.modelpopup_conform_popup.close()
    }
  
  }

  

editreceipt_popup(sup_paymentdata, i) {

  this.receiptupdateindex = i
  this.edittable_receipt = true;
  this.supplier_receipt_id = sup_paymentdata._id
  this.receiptdata_foredit = sup_paymentdata.transaction?.[i] || null;
  console.log("The data inside the sup_paymentdata:", this.receiptdata_foredit);
}

updateBrand(data: any, selectedBrandId: any): void {

  const selectedBrand = this.invetory_brands.find(brand => brand.id === selectedBrandId);
    const brandobj=this.invetory_brands.find(brand => brand.brand == selectedBrandId )
    data.brand_id = brandobj._id
    console.log("this is category", data)
}
updateCategory(data: any, selectedcategoryId: any): void {

  console.log("the data inside the selectedcategoryId",selectedcategoryId)
  const selectedcategory = this.invetory_category.find(category => category.id === selectedcategoryId);
  const categoryobj=this.invetory_category.find(category => category.category == selectedcategoryId )

    // data.category = selectedcategory;
    data.category_id = categoryobj._id
    console.log("this is category", data)
}




update_receiptdata(){
  console.log("Current data in receiptdata_foredit.receiptdata:", this.receiptdata_foredit);

  this.LocalStoreService.update_receipt_inventory(this.supplier_receipt_id,this.receiptdata_foredit,this.receiptupdateindex).subscribe(data=>{

    this.edittable_receipt = false

  })
}

}






