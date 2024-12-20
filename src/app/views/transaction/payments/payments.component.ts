// import { Component, OnInit, ViewChild } from '@angular/core';
// import { LocalStoreService } from 'src/app/shared/services/local-store.service'; 
// import { MatSelectChange } from '@angular/material/select';
// import * as moment from 'moment';
// import { MatDialog } from '@angular/material/dialog';

// @Component({
//   selector: 'app-payments',
//   templateUrl: './payments.component.html',
//   styleUrls: ['./payments.component.scss']
// })
// export class PaymentsComponent implements OnInit {

//   currentPage: number = 0;
//   startIndex: number = 0;
//   rowsPerPage: number = 10;
//   totalRecords: number = 0;
//   allmasterdata: any[] = [];
//   pagedData: any[] = [];
//   searchTerm: string = '';
//   dialogref: any;
//   vendorid: any;
//   editvendorsdata: any;
//   selectedValue: string;
//   sup_invno: string;



//   inputDataArray = [];
//   total_amount_receipt: any;
//   total_cgst_receipt: any;
//   total_sgst_receipt: any;
//   total_igst_receipt: any
//   isspareclicked: boolean = false;
//   supplier_credential: any;
//   sup_receiptdate: string;
//   mandatoryfields: boolean = false;
//   mondatorydate: boolean = false;
//   mandatoryinvno: boolean = false;
//   mandatoryname: boolean = false;
//   todaysdate: string;
//   selectedDate: any;
//   sup_paymentdata: any;
//   selectedSupplier: any;
//   payscreen: boolean = false;

//   banks: any

//   selectedBank: any
//   bankpage: boolean = false;
//   upipage: boolean = false;
//   choosedbank: any;
//   paymentDate: any;
//   paymentCash: any = '0.00';
//   payid: any;
//   utrNumber: string;
//   upiNumber: string;
//   particular: string;
//   balancepay: number;

//   showError: boolean = false;
//   bankcontainercard: any;

//   bankcredentials: any
//   handcashpage: boolean = false;
//   radioselectedValue: number;
//   suptype: any;
//   supmobile: any;
//   supaddress: any;
//   supgstno: any;
//   suppliercontainercard: boolean = false;
//   particularpopupdata: any;
//   forparticularpopup_alldata: any;
//   forparticularpopup_index: any;
//   forparticularpopup_length: any;
//   particularpopupdata_for: any;
//   particularpopupdata_supplier: any;
//   particularpopupdata_transdate: any;
//   particularpopupdata_amount: any;
//   particularpopupdata_transref: any;
//   supname: any;
//   supplierfulldata: any;
//   constructor(private LocalStoreService: LocalStoreService, private dialog: MatDialog,) { }

//   ngOnInit(): void {


//     this.sup_paymentdata = []

//     this.getvendardata()

//     this.getbankdetails()

//     this.todaysdate = moment(new Date).format('YYYY-MM-DD hh:mm A');

//   }

//   onSelectionChange(event: MatSelectChange) {
//     console.log('Selected ID:', event.value);

//     this.supplier_credential = event.value
//     this.showError = false;
//   }

//   checkSupplierSelection(): void {
//     if (!this.selectedSupplier) {
//       this.showError = true;
//     }
//   }


//   getcontainerdataforsupplier() {

//     this.LocalStoreService.getvendor_byid(this.vendorid).subscribe(data => {


//     });

//   }

//   onSelectionChange_payment(event: MatSelectChange) {

//     this.sup_paymentdata = []

//     this.suppliercontainercard = true
//     var receipt = 0
//     var payment = 0
//     this.supplier_credential = event.value._id
//     this.supplierfulldata = event.value
//     this.LocalStoreService.getvendor_byid(event.value._id).subscribe(data => {
//       var forsuppliercontainer = data.response
//       var objectdataforsupplier
//       forsuppliercontainer.forEach(data => {
//         objectdataforsupplier = data
//         this.suptype = data.type
//         this.supmobile = data.mobile
//         this.supaddress = data.address1
//         this.supgstno = data.gstno
//         this.suptype = data.type
//       this.supname = data.name
//       })
//     });
//     this.LocalStoreService.sup_transbyid(event.value._id).subscribe(data => {

//       console.log("the data of the supplierrrrrrrr", data.response)

//       var paymentdata = data.response



//       var objectdatapay

//       paymentdata.forEach(data => {
//         objectdatapay = data
     

//       })
//       if (data.response.length > 0) {
//         this.sup_paymentdata = objectdatapay


//         objectdatapay.transaction.forEach(data => {
//           if (data.receiptpayment.totalreceipt_amount) {
//             receipt += data.receiptpayment.totalreceipt_amount
//           }
//           if (data.receiptpayment.payment) {
//             payment += data.receiptpayment.payment
//           }
//         })

//         this.balancepay = receipt - payment
//       }
//     })
//   }


//   getbankdetails() {

//     this.LocalStoreService.getbankdetails().subscribe(data => {
//       this.banks = data.response
//       console.log("the full data of the bank", this.banks)

//     });

//   }


//   getvendardata() {
//     var cursor = '';
//     this.LocalStoreService.getvendardata(cursor).subscribe(data => {
//       this.allmasterdata = data.response;
//       this.totalRecords = this.allmasterdata.length;
//     });
//   }

//   selectPaymentMethod(method) {
//     console.log('Selected payment method:', method);

//     if (method == "Bank" && this.selectedSupplier) {
//       this.bankpage = true
//       this.payscreen = true
//       this.upipage = false
//       this.handcashpage = false

//     } else if (method == "UPI" && this.selectedSupplier) {
//       this.upipage = true
//       this.bankpage = false
//       this.payscreen = true
//       this.handcashpage = false

//     } else if (method == "Cash" && this.selectedSupplier) {

//       this.upipage = false
//       this.bankpage = false
//       this.payscreen = true
//       this.handcashpage = true

//     }


//     switch (method) {
//       case 'Bank':
//         this.radioselectedValue = 1;
//         break;
//       case 'UPI':
//         this.radioselectedValue = 2;
//         break;
//       case 'Cash':
//         this.radioselectedValue = 3;
//         break;
//     }
//   }

//   onBankChange(bank) {
//     const joinedParticulars = bank.bankname + "-" + bank.branch + "-" + bank.ifsc + "-" + bank.accountnumber.slice(-4);
//     this.bankcredentials = {
//       bankname: bank.bankname,
//       branch: bank.branch,
//       ifsc: bank.ifsc,
//       accountnumber: bank.accountnumber
//     }
//     this.choosedbank = bank.bankname
//     this.bankcontainercard = joinedParticulars
//     console.log("the data inside the choosed bank", this.choosedbank)
//   }

//   proceedpayment(upipage, paymentDate, payid, paymentCash, particular) {

//     var receipt = 0
//     var payment = 0

//     var formateddate_pay = moment(paymentDate).format('YYYY-MM-DD hh:mm A');
//     console.log("the data inside the proceed payment", formateddate_pay, payid, paymentCash)
//     var status
//     if (this.bankpage == true) {
//       status = "bank"
//     } else if (this.upipage == true) {
//       status = "upi"
//     } else {
//       status = "cash"
//     }
//     this.LocalStoreService.postpayments_forsupplier(this.supplier_credential,this.supplierfulldata, formateddate_pay, payid, paymentCash, this.choosedbank, particular, status, this.bankcredentials).subscribe(data => {
//       this.paymentDate = ""
//       this.paymentCash = "0.00"
//       this.utrNumber = ""
//       this.upiNumber = ""
//       this.particular = ""
//       this.selectedSupplier = "" 
//       this.supaddress = ""
//       this.supmobile = ""
//       this.supgstno = ""
//       this.selectedBank = ""
//       this.bankcontainercard = ""
//       this.suppliercontainercard = false
//       this.bankpage = false
//       this.upipage = false
//       this.handcashpage = false

//       this.LocalStoreService.sup_transbyid(this.supplier_credential).subscribe(data => {
//         var paymentdata = data.response
//         var objectdatapay
//         paymentdata.forEach(data => {
//           objectdatapay = data
//         })
//         if (data.response.length > 0) {
//           this.sup_paymentdata = objectdatapay
//           objectdatapay.transaction.forEach(data => {
//             if (data.receiptpayment.totalreceipt_amount) {
//               receipt += data.receiptpayment.totalreceipt_amount
//             }
//             if (data.receiptpayment.payment) {
//               payment += data.receiptpayment.payment
//             }
//           })
//           this.balancepay = receipt - payment
//         }
//       })
//       this.supplier_credential = ''
//     })
//   }


//   handleFocus(event: FocusEvent) {
//     const target = event.target as HTMLInputElement;
//     let value = target.value;

//     if (value === '0.00') {
//       target.value = '';
//     } else if (value.endsWith('.00')) {
//       target.setSelectionRange(value.length - 3, value.length - 3);
//     }
//   }

//   handleInput(event: Event) {
//     const target = event.target as HTMLInputElement;
//     let value = target.value;

//     value = value.replace(/[^0-9.]/g, '');

//     let parts = value.split('.');
//     if (parts[0] !== '') {
//       parts[0] = parts[0].replace(/^0+/, '') || '0';
//     }

//     value = parts.join('.');

//     if (!value.includes('.')) {
//       value += '.00';
//     } else if (value.split('.')[1].length === 0) {
//       value += '00';
//     } else if (value.split('.')[1].length === 1) {
//       value += '0';
//     }

//     target.value = value;

//     target.setSelectionRange(value.length - 3, value.length - 3);
//   }

//   handleBlur(event: FocusEvent) {
//     const target = event.target as HTMLInputElement;
//     let value = target.value;

//     if (!value || isNaN(+value)) {
//       target.value = '0.00';
//     } else {
//       let parts = value.split('.');
//       if (parts.length === 1) {
//         target.value = `${parts[0]}.00`;
//       } else {
//         target.value = `${parts[0]}.${(parts[1] || '').padEnd(2, '0')}`;
//       }
//     }
//   }


//   getTruncatedText(text: string): string {
//     const maxLength = 60;
//     const dots = '....';
//     if (text.length > maxLength) {
//       return text.substring(0, maxLength) + dots;
//     }
//     return text;
//   }

//   openparticularpopup(particularpage, data,alldata,index) {

//     this.forparticularpopup_alldata = alldata
//     this.forparticularpopup_index = index
//     this.forparticularpopup_length = alldata.length

//     this.particularpopupdata = alldata[index].receiptpayment.joinedparticulars || alldata[index].receiptpayment.particulars
  
//     this.particularpopupdata_for = alldata[index].receiptpayment.for 
//     this.particularpopupdata_transdate = alldata[index].receiptpayment.date 
//     this.particularpopupdata_transref = alldata[index].receiptpayment.particulars 
//     this.particularpopupdata_amount = alldata[index].receiptpayment.totalreceipt_amount || alldata[index].receiptpayment.payment
    
//     this.particularpopupdata = alldata[index].receiptpayment.joinedparticulars || alldata[index].receiptpayment.particulars

//     this.dialogref = this.dialog.open(particularpage, {
//       width: '32%',
//     });
//   }

//   previousparticular(){

//     if(this.forparticularpopup_index > 0){
//       this.forparticularpopup_index--
//       }
//     if(this.forparticularpopup_alldata[this.forparticularpopup_index]){
//     this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for 
//     this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date 
//     this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars 
//     this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
//     this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
//     }
//   }

//   nextparticular(){

//     var totalcontent = this.forparticularpopup_length - 2
//     if(totalcontent >= this.forparticularpopup_index){
//     this.forparticularpopup_index++
//     }
//     if(this.forparticularpopup_alldata[this.forparticularpopup_index]){
//     this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for 
//     this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date 
//     this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars 
//     this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
//     this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
//     }


//   }

// }


// code added for aravind ui

import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service'; 
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

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

  banks: any

  selectedBank: any
  bankpage: boolean = false;
  upipage: boolean = false;
  choosedbank: any;
  paymentDate: any;
  paymentCash: any = '0.00';
  payid: any;
  utrNumber: string= '';
  upiNumber: string= '';
  particular: string = '';
  balancepay: number;

  showError: boolean = false;
  bankcontainercard: any;

  bankcredentials: any
  handcashpage: boolean = false;
  radioselectedValue: number;
  suptype: any;
  supmobile: any;
  supaddress: any;
  supgstno: any;
  suppliercontainercard: boolean = false;
  particularpopupdata: any;
  forparticularpopup_alldata: any;
  forparticularpopup_index: any;
  forparticularpopup_length: any;
  particularpopupdata_for: any;
  particularpopupdata_supplier: any;
  particularpopupdata_transdate: any;
  particularpopupdata_amount: any;
  particularpopupdata_transref: any;
  supname: any;
  supplierfulldata:any;
  constructor(private LocalStoreService: LocalStoreService, private dialog: MatDialog,) { }

  ngOnInit(): void {


    this.sup_paymentdata = []

    this.getvendardata()

    this.getbankdetails()

    this.todaysdate = moment(new Date).format('YYYY-MM-DD hh:mm A');

  }

  onSelectionChange(event: MatSelectChange) {
    console.log('Selected ID:', event.value);

    this.supplier_credential = event.value
    this.showError = false;
  }

  checkSupplierSelection(): void {
    if (!this.selectedSupplier) {
      this.showError = true;
    }
  }


  getcontainerdataforsupplier() {
    this.LocalStoreService.getvendor_byid(this.vendorid).subscribe(data => {
      // this.editvendorsdata = data.response;
    });
  }

  onSelectionChange_payment(event: any) {
    const target = event.target as HTMLSelectElement;
    const selectIndex = target.selectedIndex;
    const selectedItem = this.allmasterdata[selectIndex];
    this.supplierfulldata = selectedItem;

    console.log("the data inside the the onchange>>>>>>>>>>>>>>>>",this.supplierfulldata)
    if (selectedItem){
      console.log("Selected Item:", selectedItem);
      console.log('Selected ID:', selectedItem._id); // Make sure _id exists in your data
    } else {
      console.error("Selected item is undefined or null");
    }
    this.sup_paymentdata = []

    this.suppliercontainercard = true
    var receipt = 0
    var payment = 0
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
      this.supname = data.name
      })
    });
    this.LocalStoreService.sup_transbyid(selectedItem._id).subscribe(data => {

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


  getbankdetails() {
    this.LocalStoreService.getbankdetails().subscribe(data => {
      this.banks = data.response
      console.log("the full data of the bank", this.banks)
    });
  }


  getvendardata() {
    var cursor = '';
    this.LocalStoreService.getvendardata(cursor).subscribe(data => {
      this.allmasterdata = data.response;
      this.totalRecords = this.allmasterdata.length;
    });
  }

  selectPaymentMethod(method) {
    // Implement your logic based on the selected payment method
    console.log('Selected payment method:', method);

    if (method == "Bank" && this.selectedSupplier) {
      this.bankpage = true
      this.payscreen = true
      this.upipage = false
      this.handcashpage = false
      this.radioselectedValue = 1;
    } else if (method == "UPI" && this.selectedSupplier) {
      this.upipage = true
      this.bankpage = false
      this.payscreen = true
      this.handcashpage = false
      this.radioselectedValue = 2;
    } else if (method == "Cash" && this.selectedSupplier) {

      this.upipage = false
      this.bankpage = false
      this.payscreen = true
      this.handcashpage = true
      this.radioselectedValue = 3;
    }


    switch (method) {
      case 'Bank':
        this.radioselectedValue = 1;
        break;
      case 'UPI':
        this.radioselectedValue = 2;
        break;
      case 'Cash':
        this.radioselectedValue = 3;
        break;
    }
  }

  onBankChange(bank: any) {
    console.log("this is bank:  ", bank);
    console.log("this is bank details", bank.accountnumber)
    const joinedParticulars = `${bank.bankname}-${bank.branch}-${bank.ifsc}-${bank.accountnumber.slice(-4)}`;
    this.bankcredentials = {
      bankname: bank.bankname,
      branch: bank.branch,
      ifsc: bank.ifsc,
      accountnumber: bank.accountnumber
    }
    this.choosedbank = bank.bankname
    this.bankcontainercard = joinedParticulars
    console.log("******************", this.bankcontainercard)
    console.log("the data inside the choosed bank", this.choosedbank)
    // if (bank && bank.accountnumber) {
      
    //   const joinedParticulars = `${bank.bankname}-${bank.branch}-${bank.ifsc}-${bank.accountnumber}`;
    //   this.bankcredentials = {
    //     bankname: bank.bankname,
    //     branch: bank.branch,
    //     ifsc: bank.ifsc,
    //     accountnumber: bank.accountnumber
    //   };
    //   this.choosedbank = bank.bankname;
    //   this.bankcontainercard = joinedParticulars;
    //   console.log("The data inside the choosed bank:", this.choosedbank);
    // } else {
    //   console.error('Bank or account number is undefined');
    // }
  }

  proceedpayment(upipage, paymentDate, payid, paymentCash, particular) {

    var receipt = 0
    var payment = 0
    console.log("the data of the proceddpayment id>>>??>>?>",this.supplier_credential)
    var formateddate_pay = moment(paymentDate).format('YYYY-MM-DD hh:mm A');
    console.log("the data inside the proceed payment", formateddate_pay, payid, paymentCash, upipage)
    var status
    if (this.bankpage == true) {
      status = "bank"
    } else if (this.upipage == true) {
      status = "upi"
    } else {
      status = "cash"
    }
    this.LocalStoreService.postpayments_forsupplier(this.supplier_credential,this.supplierfulldata, formateddate_pay, payid, paymentCash, this.choosedbank, particular, status, this.bankcredentials).subscribe(data => {
      this.paymentDate = ""
      this.paymentCash = "0.00"
      this.utrNumber = ""
      this.upiNumber = ""
      this.particular = ""
      this.selectedSupplier = ""
      this.supaddress = ""
      this.supmobile = ""
      this.supgstno = ""
      this.selectedBank = ""
      this.bankcontainercard = ""
      this.suppliercontainercard = false
      this.bankpage = false
      this.upipage = false
      this.handcashpage = false

      this.LocalStoreService.sup_transbyid(this.supplier_credential._id).subscribe(data => {
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
      this.supplier_credential = ''
    })
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


  getTruncatedText(text: string): string {
    const maxLength = 60;
    const dots = '....';
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + dots;
    }
    return text;
  }

  openparticularpopup(particularpage, data,alldata,index) {

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

  previousparticular(){

    if(this.forparticularpopup_index > 0){
      this.forparticularpopup_index--
      }
    if(this.forparticularpopup_alldata[this.forparticularpopup_index]){
    this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for 
    this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date 
    this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars 
    this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
    this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
    }
  }

  nextparticular(){

    var totalcontent = this.forparticularpopup_length - 2
    if(totalcontent >= this.forparticularpopup_index){
    this.forparticularpopup_index++
    }
    if(this.forparticularpopup_alldata[this.forparticularpopup_index]){
    this.particularpopupdata_for = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.for 
    this.particularpopupdata_transdate = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.date 
    this.particularpopupdata_transref = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars 
    this.particularpopupdata_amount = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.totalreceipt_amount || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.payment
    this.particularpopupdata = this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.joinedparticulars || this.forparticularpopup_alldata[this.forparticularpopup_index].receiptpayment.particulars
    }
  }


  openCalendar(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.showPicker(); 
    console.log("this is input date>>>>>>>>>>>>>>>>>>>>>", inputElement, this.selectedDate);
    
  }
  resetBank(){
    this.utrNumber = '';
    this.paymentCash = '';
    this.particular = '';
    this.selectedBank = '';
    this.paymentDate = '';
  }
  resetUpi(){
    this.upiNumber = '';
    this.paymentCash = '';
    this.paymentDate = '';
    this.particular = '';
  }
  resetCash(){
    this.paymentDate = '';
    this.paymentCash = '';
    this.particular = '';
  }
}
