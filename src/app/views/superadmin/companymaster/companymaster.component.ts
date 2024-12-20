import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-companymaster',
  templateUrl: './companymaster.component.html',
  styleUrl: './companymaster.component.scss'
})
export class CompanymasterComponent implements OnInit {
  registrationForm: FormGroup;
  companydataforid: any;
  bankdetails: any;
  logoFile: any
  branchdata: any;
  addbranchbutton: boolean = false
  addgst: boolean = false
  // company_id = localStorage.getItem("logincompanyid")
  company_id: string | null;
  typeofcreating: string;
  branchusers: any;
  shopuserid: any;
  superadminname: any;
  superadmin_password: any;
  superadmin_authpin: any;
  superadmin_Mobile: any;
  adminpresent: boolean = false;
  techpresent: boolean = false;
  branchtech: any;
  techname: any;
  techid: any;

  branch_name: any;
  acc_no: any;
  acc_name: any;
  IFSC_code: any;
  address: any;
  Role: any
  buyingControl = new FormControl(false); // Default unchecked
  assignStaffControl = new FormControl(false); // Default unchecked
  inventorycustomer = new FormControl(false); // Default unchecked
  genralservice = new FormControl(false); // Default unchecked
  selectedBankName: any = {
    AllBanks: [],
    selectedBank: null
  };



  isCompleted: boolean;
  data: any = {
    email: ''
  };
  step2Form: UntypedFormGroup;
  branchdetails: any;
  dialogref: any;
  selectedBranchData: any;
  shortnameExists: boolean = false;
  passwordExists: any;
  // authpinExists: boolean;

  popupdata: any
  showAddCompany: boolean = false;





  tabIndexValue: number = 0; // Default tab index
  inviteForm: FormGroup;
  invited_users: any[] = [];

  updateinviteform = {
    master: false,
    company: false,
    brandmodel: false,
    supplier: false,

    businessMenu: false,
    jobcardpage: false,
    reports: false,

    Transactionmenu: false,
    payment: false,
    receipt: false,
    expense: false


  }

  // menus: any[] = [
  //   { 
  //     menuName: 'Dashboard', 
  //     menuStatus: false, 
  //     submenuArray: [
  //       { subMenuName: 'Jobcard', subMenuStatus: false },
  //       { subMenuName: 'Estimate', subMenuStatus: false },
  //       { subMenuName: 'Invoice', subMenuStatus: false }
  //     ] 
  //   },
  //   { 
  //     menuName: 'Business', 
  //     menuStatus: false, 
  //     submenuArray: [
  //       { subMenuName: 'VI', subMenuStatus: false },
  //       { subMenuName: 'Reports', subMenuStatus: false },
  //       { subMenuName: 'Sights', subMenuStatus: false },
  //       { subMenuName: 'Calculation', subMenuStatus: false }
  //     ] 
  //   },
  //   { 
  //     menuName: 'Insights', 
  //     menuStatus: false, 
  //     submenuArray: [
  //       { subMenuName: 'Payment', subMenuStatus: false },
  //       { subMenuName: 'Receipt', subMenuStatus: false },
  //       { subMenuName: 'Expense', subMenuStatus: false }
  //     ] 
  //   }
  // ];



  constructor(private route: ActivatedRoute, private LocalStoreService: LocalStoreService, private fb: FormBuilder, private model: NgbModal,
    private dialog: MatDialog, private fb2: UntypedFormBuilder, private toastr: ToastrService
  ) {

    this.inviteForm = this.fb.group({
      master: false,
      company: false,
      brandmodel: false,
      supplier: false,

      businessMenu: false,
      jobcardpage: false,
      reports: false,

      Transactionmenu: false,
      payment: false,
      receipt: false,
      expense: false
    });
  }

  ngOnInit(): void {
    let creater_superadmin = localStorage.getItem('creater_superadmin')
    if (creater_superadmin == "true") {
        this.showAddCompany = true;
        console.log('Add Company menu is visible');  // Debug: Check if the condition is met
    } else {
        this.showAddCompany = false;
    }



    this.route.queryParams.subscribe(params => {
      // Check if company_id exists in query params
      if (params['company_id']) {
        this.company_id = params['company_id'];  // Use the company_id from the URL
      } else {
        // Fallback to company_id from localStorage
        this.company_id = localStorage.getItem('logincompanyid');
      }

      console.log(this.company_id);  // Use this company_id in your component logic
    });

    // this.inviteForm = this.fb.group({
    //   emailInviteUser: [''],
    //   allMenu: [false],
    //   menuArray: this.fb.array(this.menus.map(menu => this.createMenuGroup(menu)))
    // });


    this.step2Form = this.fb2.group({
      experience: [2]
    });

    this.listbank()
    this.LocalStoreService.getcompanybyid(this.company_id).subscribe(data => {
      this.companydataforid = data.response
      console.log("the data of company by id", this.companydataforid)
    })

  }
  createFormGroup() {

    if (this.typeofcreating == "branch") {
      this.registrationForm = this.fb.group({
        branchname: ['',],
        shoptype: ['',],
        shoparea: ['',],
        shopstreet: ['',],
        GST: ['',],
        branch: ['',],
        Mobile: ['',],
        Service: ['',],
        customertype: ['',],
        // changed
        gstincluded: [false],
        spareplusgst: [false],
        labourplusgst: [false],
        packageplusgst: [false],
        spareinclusive: [false],
        labourinclusive: [false],
        packageinclusive: [false]

      });
    } else if (this.typeofcreating == "adduser") {
      this.registrationForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.maxLength(4)]],
        authpin: ['', [Validators.required, Validators.maxLength(4)]],
        mobile: ['', [Validators.required, Validators.maxLength(10)]],
      });
    } else if (this.typeofcreating == "adduser_tech") {
      this.registrationForm = this.fb.group({
        firstname: ['', Validators.required],
        // fathersname: ['', Validators.required],
        shortname: ['', Validators.required],
        mobile: ['', Validators.required],
      });

    }
  }
  getbranchdetailsbybranchid() {

    console.log("clikced on the second content")
  }

  // getChange(event) {
  //   if (event == 1 || event == 2 || event == 3 || event == 4) {
  //     this.LocalStoreService.get_comapanybranchdata(this.company_id).subscribe(data => {
  //       this.branchdata = data.response
  //       this.branchdata.forEach(data => {
  //         if (!data.invoice_prefix) {
  //           data.invoice_prefix = "";
  //         }
  //         if (!data.financial_year) {
  //           data.financial_year = { invoice_year: "" }; // Initialize financial_year object
  //         } else if (!data.financial_year.invoice_year) {
  //           data.financial_year.invoice_year = "";
  //         }
  //         if (!data.invoice_runningnumber) {
  //           data.invoice_runningnumber = { value: "" }; // Initialize invoice_runningnumber object
  //         }
  //         if (!data.estimate_runningnumber) {
  //           data.estimate_runningnumber = { value: "" }; // Initialize invoice_runningnumber object
  //         }
  //         if (!data.estimate_year) {
  //           data.estimate_year = { estimateyear: "" }; // Initialize invoice_runningnumber object
  //         }
  //         if (!data.BookingReferenceId) {
  //           data.BookingReferenceId = { value: "" }; // Initialize BookingReferenceId object
  //         }
  //         if (!data.jobcard_year) {
  //           data.jobcard_year = { jobcardyear: "" };
  //         }
  //         if (!data.service) {
  //           data.service = "";
  //         }
  //         if (!data.gstincluded) {
  //           data.gstincluded = false;
  //         }
  //         if (!data.gstcalulation) {
  //           data.gstcalulation = {
  //             spareplusgst: false,
  //             spareinclusive: false,
  //             labourplusgst: false,
  //             labourinclusive: false,
  //             packageplusgst: false,
  //             packageinclusive: false,
  //           }
  //         }
  //       });
  //     })
  //   }
  //   if (event == 1) {
  //     this.addbranchbutton = true
  //   } else {
  //     this.addbranchbutton = false
  //   }
  // }

  updatebranchdata(branchid) {
    console.log("clicked for updated branch", branchid)
  }

  updatebranch(branchid, flag) {
    this.LocalStoreService.updatealldetailsbranch(branchid, this.branchdata).subscribe(data => {
      this.toastr.success('branch updated!', 'Success!', { timeOut: 3000 });
    })
  }

  onLogoSelected(event, data) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      data.logo = reader.result;
    };
    reader.readAsDataURL(file);
  }

  savecompany(companyid) {
    this.LocalStoreService.savecompany(companyid, this.companydataforid).subscribe(data => {
      this.toastr.success('company updated!', 'Success!', { timeOut: 3000 });
    })
  }

  updaterunningnoinbranch(branchid) {
    let flag = "runningno"
    this.LocalStoreService.updaterunningno_branch(branchid, this.branchdata, flag).subscribe(data => {
      this.toastr.success('Running No Updated!', 'Success!', { timeOut: 3000 });
    })
  }
  updatebankdetails(branchid, bank_name, branch_name, acc_no, acc_name, IFSC_code, address) {
    let flag = "bankdetails"
    let bankdata = {

      bankname: this.selectedBankName.selectedBank,
      branch: branch_name,
      accountnumber: acc_no,
      acc_name: acc_name,
      ifsc: IFSC_code,
      address: address
    }
    this.LocalStoreService.updaterunningno_branch(branchid, bankdata, flag).subscribe(data => {
      this.toastr.success('Bank Details Updated!', 'Success!', { timeOut: 3000 });
      this.branch_name = "";
      this.acc_no = "";
      this.acc_name = "";
      this.IFSC_code = "";
      this.address = "";
    })
  }

  onFileSelected(event: any) {
    this.logoFile = event.target.files;
  }


  addbranchpopup(branchcreatingpage) {
    this.typeofcreating = "branch"
    this.createFormGroup()
    this.popupdata = this.model.open(branchcreatingpage, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    })
  }

  createbranch() {
   
    this.LocalStoreService.createbranch(this.company_id, this.registrationForm.value,this.buyingControl.value,this.assignStaffControl.value,this.inventorycustomer.value,this.genralservice.value).subscribe(data => {

      this.toastr.success('Branch Created!', 'Success!', { timeOut: 3000 });

      console.log("branch created", data)

      this.closedialog()

    })

  }
  closedialog() {
    this.popupdata.close()

  }

  onBranchClick(branchid) {
    this.LocalStoreService.getusersofbranch(branchid).subscribe(data => {
      this.branchusers = data.response
    })
    this.LocalStoreService.gettechofbranch(branchid).subscribe(data => {
      this.branchtech = data.response
    })
  }

  checkgst() {
    console.log("gst clicked", this.registrationForm.value.gstincluded)

    if (this.registrationForm.value.gstincluded == false) {
      this.addgst = false
    } else {
      this.addgst = true
    }
  }

  updatespareCheckbox(checkedCheckbox: string) {
    if (checkedCheckbox === 'inclusive') {
      this.registrationForm.get('spareinclusive').setValue(false);
    } else if (checkedCheckbox === 'exclusive') {
      this.registrationForm.get('spareplusgst').setValue(false);
    }
  }

  updatelabourCheckbox(checkedCheckbox: string) {
    if (checkedCheckbox === 'inclusive') {
      this.registrationForm.get('labourinclusive').setValue(false);
    } else if (checkedCheckbox === 'exclusive') {
      this.registrationForm.get('labourplusgst').setValue(false);
    }
  }

  updatepackageCheckbox(checkedCheckbox: string) {
    if (checkedCheckbox === 'inclusive') {
      this.registrationForm.get('packageinclusive').setValue(false);
    } else if (checkedCheckbox === 'exclusive') {
      this.registrationForm.get('packageplusgst').setValue(false);
    }
  }

  branchdetailspareCheckbox(checkboxdata: string, data: any) {
    if (checkboxdata === 'inclusive') {
      data.gstcalulation.spareinclusive = !data.gstcalulation.spareplusgst;
    } else if (checkboxdata === 'exclusive') {
      data.gstcalulation.spareplusgst = !data.gstcalulation.spareinclusive;
    }
  }
  branchdetaillabourCheckbox(checkboxdata: string, data: any) {
    if (checkboxdata === 'inclusive') {
      data.gstcalulation.labourinclusive = !data.gstcalulation.labourplusgst;
    } else if (checkboxdata === 'exclusive') {
      data.gstcalulation.labourplusgst = !data.gstcalulation.labourinclusive;
    }
  }
  branchdetailpackageCheckbox(checkboxdata: string, data: any) {
    if (checkboxdata === 'inclusive') {
      data.gstcalulation.packageinclusive = !data.gstcalulation.packageplusgst;
    } else if (checkboxdata === 'exclusive') {
      data.gstcalulation.packageplusgst = !data.gstcalulation.packageinclusive;
    }
  }

  adminuseruser_popup(users_id, updateuserpage) {
    this.shopuserid = users_id
    const shopuserdata = this.branchusers.find(user => user._id == users_id)
    if (shopuserdata) {
      this.superadminname = shopuserdata.superadmin_username
      this.superadmin_password = shopuserdata.password
      this.superadmin_authpin = shopuserdata.authpin
      this.adminpresent = shopuserdata.present
      if(shopuserdata.role){
        this.Role = shopuserdata.role
      }


    }

    if (shopuserdata && shopuserdata.permission) {
      
      console.log("the data inside the shopuserdata.permission ", shopuserdata)

      // this.updateinviteform.master = shopuserdata.permission.master
      // this.updateinviteform.company = shopuserdata.permission.company
      // this.updateinviteform.brandmodel = shopuserdata.permission.brandmodel
      // this.updateinviteform.supplier = shopuserdata.permission.supplier
      // this.updateinviteform.businessMenu = shopuserdata.permission.businessMenu
      // this.updateinviteform.jobcardpage = shopuserdata.permission.jobcardpage
      // this.updateinviteform.reports = shopuserdata.permission.reports
      // this.updateinviteform.Transactionmenu = shopuserdata.permission.Transactionmenu
      // this.updateinviteform.payment = shopuserdata.permission.payment
      // this.updateinviteform.receipt = shopuserdata.permission.receipt
      // this.updateinviteform.expense = shopuserdata.permission.expense


      this.updateinviteform = {

        
        master: !!shopuserdata.permission.master,
        company: !!shopuserdata.permission.company,
        brandmodel: !!shopuserdata.permission.brandmodel,
        supplier: !!shopuserdata.permission.supplier,
        businessMenu: !!shopuserdata.permission.businessMenu,
        jobcardpage: !!shopuserdata.permission.jobcardpage,
        reports: !!shopuserdata.permission.reports,
        Transactionmenu: !!shopuserdata.permission.Transactionmenu,
        payment: !!shopuserdata.permission.payment,
        receipt: !!shopuserdata.permission.receipt,
        expense: !!shopuserdata.permission.expense,
    };

      console.log("the data inside the shopuserdata.permission inside ", this.updateinviteform.master)
    } else {

      // this.updateinviteform.master = false
      // this.updateinviteform.company = false
      // this.updateinviteform.brandmodel = false
      // this.updateinviteform.supplier = false
      // this.updateinviteform.businessMenu = false
      // this.updateinviteform.jobcardpage = false
      // this.updateinviteform.reports = false
      // this.updateinviteform.Transactionmenu = false
      // this.updateinviteform.payment = false
      // this.updateinviteform.receipt = false
      // this.updateinviteform.expense = false


      this.updateinviteform = {
        master: false,
        company: false,
        brandmodel: false,
        supplier: false,
        businessMenu: false,
        jobcardpage: false,
        reports: false,
        Transactionmenu: false,
        payment: false,
        receipt: false,
        expense: false,
    };

    }


    this.popupdata = this.model.open(updateuserpage, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      size: "lg",
    })


  }

  tech_popup(techid, updatetechpage) {
    this.techid = techid
    const techdata = this.branchtech.find(user => user._id == techid)
    if (techdata) {
      this.techname = techdata.shortname
      this.techpresent = techdata.present
    }
    this.popupdata = this.model.open(updatetechpage, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      size: "sm",
    })
  }

  updateadmindata() {
    let flag = "shopusers"
    this.LocalStoreService.updatesuperadmin(this.shopuserid, this.superadminname, this.superadmin_password, this.superadmin_authpin, this.adminpresent, flag,this.updateinviteform,this.Role,this.superadmin_Mobile).subscribe(data => {
    })
    this.popupdata.close()
  }

  updatetechdata() {
    let flag = "tech"
    this.LocalStoreService.updatetechdata(this.techid, this.techname, this.techpresent, flag).subscribe(data => {
      const techdata = this.branchtech.find(user => user._id == this.techid)
    })
    this.popupdata.close()
  }

  closeadminModal() {
    this.popupdata.close()
  }

  listbank() {
    this.LocalStoreService.bankList().subscribe(data => {
      console.log("Bank list data:", data);
      if (data && data.response) {
        this.selectedBankName = {
          AllBanks: data.response.AllBanks
        };
        console.log("All Banks Data>>>>>>>", this.selectedBankName.AllBanks)
      } else {
        this.selectedBankName = { AllBanks: [] };
      }
    });
  }

  selectedbank(event: any) {
    this.selectedBankName.AllBanks.selectedBank = event.value;
  }

  onStep1Next(e) {
    this.LocalStoreService.get_comapanybranchdata(this.company_id).subscribe(data => {
      this.branchdata = data.response
      this.branchdata.forEach(data => {
        if (!data.invoice_prefix) {
          data.invoice_prefix = "";
        }
        if (!data.financial_year) {
          data.financial_year = { invoice_year: "" };
        } else if (!data.financial_year.invoice_year) {
          data.financial_year.invoice_year = "";
        }
        if (!data.invoice_runningnumber) {
          data.invoice_runningnumber = { value: "" };
        }

        if (!data.proforma_invoice_runningnumber) {
          data.proforma_invoice_runningnumber = { value: "" };


        }

        if (!data.proforma_invoice_prefix) {
          data.proforma_invoice_prefix = "";
        }
        if (!data.estimate_runningnumber) {
          data.estimate_runningnumber = { value: "" };
        }
        if (!data.estimate_year) {
          data.estimate_year = { estimateyear: "" };
        }
        if (!data.BookingReferenceId) {
          data.BookingReferenceId = { value: "" };
        }
        if (!data.jobcard_year) {
          data.jobcard_year = { jobcardyear: "" };
        }
        if (!data.service) {
          data.service = "";
        }
        if (!data.gstincluded) {
          data.gstincluded = false;
        }
        if (!data.gstcalulation) {
          data.gstcalulation = {
            spareplusgst: false,
            spareinclusive: false,
            labourplusgst: false,
            labourinclusive: false,
            packageplusgst: false,
            packageinclusive: false,
          }
        }
      });
    })
  }
  onStep2Next(e) {
    this.LocalStoreService.get_comapanybranchdata(this.company_id).subscribe(data => {
      this.branchdata = data.response
      this.branchdata.forEach(data => {
        if (!data.invoice_prefix) {
          data.invoice_prefix = "";
        }
        if (!data.financial_year) {
          data.financial_year = { invoice_year: "" };
        } else if (!data.financial_year.invoice_year) {
          data.financial_year.invoice_year = "";
        }
        if (!data.invoice_runningnumber) {
          data.invoice_runningnumber = { value: "" };
        }


        if (!data.proforma_invoice_runningnumber) {
          data.proforma_invoice_runningnumber = { value: "" };


        }

        if (!data.proforma_invoice_prefix) {
          data.proforma_invoice_prefix = "";
        }
        if (!data.estimate_runningnumber) {
          data.estimate_runningnumber = { value: "" };
        }
        if (!data.estimate_year) {
          data.estimate_year = { estimateyear: "" };
        }
        if (!data.BookingReferenceId) {
          data.BookingReferenceId = { value: "" };
        }
        if (!data.jobcard_year) {
          data.jobcard_year = { jobcardyear: "" };
        }
        if (!data.service) {
          data.service = "";
        }
        if (!data.gstincluded) {
          data.gstincluded = false;
        }
        if (!data.gstcalulation) {
          data.gstcalulation = {
            spareplusgst: false,
            spareinclusive: false,
            labourplusgst: false,
            labourinclusive: false,
            packageplusgst: false,
            packageinclusive: false,
          }
        }
      });
    })
  }
  onStep3Next(e) {

    this.LocalStoreService.get_comapanybranchdata(this.company_id).subscribe(data => {
      this.branchdata = data.response
      this.branchdata.forEach(data => {
        if (!data.invoice_prefix) {
          data.invoice_prefix = "";
        }
        if (!data.financial_year) {
          data.financial_year = { invoice_year: "" };
        } else if (!data.financial_year.invoice_year) {
          data.financial_year.invoice_year = "";
        }
        if (!data.invoice_runningnumber) {
          data.invoice_runningnumber = { value: "" };
        }

        if (!data.proforma_invoice_runningnumber) {
          data.proforma_invoice_runningnumber = { value: "" };


        }

        if (!data.proforma_invoice_prefix) {
          data.proforma_invoice_prefix = "";
        }
        if (!data.estimate_runningnumber) {
          data.estimate_runningnumber = { value: "" };
        }
        if (!data.estimate_year) {
          data.estimate_year = { estimateyear: "" };
        }
        if (!data.BookingReferenceId) {
          data.BookingReferenceId = { value: "" };
        }
        if (!data.jobcard_year) {
          data.jobcard_year = { jobcardyear: "" };
        }
        if (!data.service) {
          data.service = "";
        }
        if (!data.gstincluded) {
          data.gstincluded = false;
        }
        if (!data.gstcalulation) {
          data.gstcalulation = {
            spareplusgst: false,
            spareinclusive: false,
            labourplusgst: false,
            labourinclusive: false,
            packageplusgst: false,
            packageinclusive: false,
          }
        }
      });
      console.log("the data of allbranch in the company", this.branchdata)
    })

  }
  onStep4Next(e) {
    this.LocalStoreService.get_comapanybranchdata(this.company_id).subscribe(data => {
      this.branchdata = data.response

      this.branchdata.forEach(data => {
        if (!data.invoice_prefix) {
          data.invoice_prefix = "";
        }
        if (!data.financial_year) {
          data.financial_year = { invoice_year: "" };
        } else if (!data.financial_year.invoice_year) {
          data.financial_year.invoice_year = "";
        }
        if (!data.invoice_runningnumber) {
          data.invoice_runningnumber = { value: "" };
        }


        if (!data.proforma_invoice_runningnumber) {
          data.proforma_invoice_runningnumber = { value: "" };


        }

        if (!data.proforma_invoice_prefix) {
          data.proforma_invoice_prefix = "";
        }
        if (!data.estimate_runningnumber) {
          data.estimate_runningnumber = { value: "" };
        }
        if (!data.estimate_year) {
          data.estimate_year = { estimateyear: "" };
        }
        if (!data.BookingReferenceId) {
          data.BookingReferenceId = { value: "" };
        }
        if (!data.jobcard_year) {
          data.jobcard_year = { jobcardyear: "" };
        }
        if (!data.service) {
          data.service = "";
        }
        if (!data.gstincluded) {
          data.gstincluded = false;
        }
        if (!data.gstcalulation) {
          data.gstcalulation = {
            spareplusgst: false,
            spareinclusive: false,
            labourplusgst: false,
            labourinclusive: false,
            packageplusgst: false,
            packageinclusive: false,
          }
        }
      });
      console.log("the data of allbranch in the company", this.branchdata)
    })
  }

  onStep5Next(e) {
    this.LocalStoreService.get_comapanybranchdata(this.company_id).subscribe(data => {
      this.branchdata = data.response
      this.branchdata.forEach(data => {
        if (!data.invoice_prefix) {
          data.invoice_prefix = "";
        }
        if (!data.financial_year) {
          data.financial_year = { invoice_year: "" };
        } else if (!data.financial_year.invoice_year) {
          data.financial_year.invoice_year = "";
        }
        if (!data.invoice_runningnumber) {
          data.invoice_runningnumber = { value: "" };
        }

        if (!data.proforma_invoice_runningnumber) {
          data.proforma_invoice_runningnumber = { value: "" };


        }

        if (!data.proforma_invoice_prefix) {
          data.proforma_invoice_prefix = "";
        }
        if (!data.estimate_runningnumber) {
          data.estimate_runningnumber = { value: "" };
        }
        if (!data.estimate_year) {
          data.estimate_year = { estimateyear: "" };
        }
        if (!data.BookingReferenceId) {
          data.BookingReferenceId = { value: "" };
        }
        if (!data.jobcard_year) {

          data.jobcard_year = { jobcardyear: "" };

        }
        if (!data.service) {
          data.service = "";
        }

        if (!data.gstincluded) {

          data.gstincluded = false;

        }
        if (!data.gstcalulation) {
          data.gstcalulation = {
            spareplusgst: false,
            spareinclusive: false,
            labourplusgst: false,
            labourinclusive: false,
            packageplusgst: false,
            packageinclusive: false,
          }
        }
      });
      console.log("the data of allbranch in the company", this.branchdata)
    })


  }







  adduserpopup(branchdata, adduserpagepopup) {

    this.selectedBranchData = branchdata

    this.typeofcreating = "adduser"
    this.createFormGroup()
    this.popupdata = this.dialog.open(adduserpagepopup, {
      maxHeight: '120vh',
      width: '50%',
      // disableClose: true,
    })
    // this.LocalStoreService.getbranchdetailsbyid(branchdata.company_id).subscribe(data => {
    //   this.branchdetails = data.response
    //   console.log("the data inside the branchdetails",branchdata.company_id)
    // })
  }


  createuser() {

    // if (this.inviteForm.valid) {
    //   console.log("the invite form data",this.inviteForm.value);
    // } else {
    //   console.error('Form is invalid');
    // }



    // return
    const inviteFormData = this.inviteForm.value;

    console.log("the data inside the create user", inviteFormData)

    const authpin = this.registrationForm.value.authpin;
    const password = this.registrationForm.value.password;
    this.LocalStoreService.check_passowrd_authpin(password, authpin, this.selectedBranchData).subscribe(data => {
      this.passwordExists = data.response
      if (this.registrationForm.valid && data.response != true) {
        this.LocalStoreService.adduser(this.selectedBranchData, this.registrationForm.value, inviteFormData, this.Role).subscribe(data => {
          console.log("the data in the addbrach", this.registrationForm.value)
          console.log("the data of branchdata for respected id", this.selectedBranchData)

          this.popupdata.close()
          // this.selectedBranch = false
        })
      }
    })
    // return
  }


  addtechpopup(branchdata, adduserpagepopup) {

    this.selectedBranchData = branchdata

    this.typeofcreating = "adduser_tech"

    this.createFormGroup()

    this.popupdata = this.dialog.open(adduserpagepopup, {

      maxHeight: '200vh',
      width: '30%',
      // disableClose: true,

    })

    // this.LocalStoreService.getbranchdetailsbyid(companyid).subscribe(data => {
    //   this.branchdetails = data.response
    //   console.log("the data of the branch", this.branchdetails)
    // })
  }

  create_tech() {





    // return
    const shortname = this.registrationForm.value.shortname;
    this.LocalStoreService.check_techusers(shortname, this.selectedBranchData).subscribe(data => {
      this.shortnameExists = data.response
      if (this.registrationForm.valid && data.response != true) {
        console.log("the data in the technician", this.registrationForm.value)
        this.LocalStoreService.addtechuser(this.selectedBranchData, this.registrationForm.value).subscribe(data => {
          console.log("the data in the addbrach", this.registrationForm.value)
          console.log("the data of branchdata for respected id", this.selectedBranchData)
          this.popupdata.close()
          // this.selectedBranchFor_Tech = false
        })
      }
    })
  }

  checkShortnameExists() {
    const shortname = this.registrationForm.value.shortname;
    console.log("shortname", shortname)
    this.LocalStoreService.check_techusers(shortname, this.selectedBranchData).subscribe(data => {
      this.shortnameExists = data.response
    })
  }

  toggleSubMenus(menu: string, event: any) {
    const checked = event.checked;
    if (menu === 'master') {
      this.inviteForm.patchValue({
        company: checked,
        brandmodel: checked,
        supplier: checked
      });
    } else if (menu === 'business') {
      this.inviteForm.patchValue({
        jobcardpage: checked,
        reports: checked,
        // calculation: checked
      });
    } else if (menu === 'transaction') {
      this.inviteForm.patchValue({
        payment: checked,
        receipt: checked,
        expense: checked
      });
    }
  }

  // Toggle all menus and submenus when 'All Permissions with Edit' is checked
  toggleAllPermissions(event: any) {
    const checked = event.checked;

    this.inviteForm.patchValue({
      master: checked,
      company: checked,
      brandmodel: checked,
      supplier: checked,

      businessMenu: checked,
      jobcardpage: checked,
      reports: checked,
      // calculation: checked,

      Transactionmenu: checked,
      payment: checked,
      receipt: checked,
      expense: checked
    });
  }

  submitForm() {
    if (this.inviteForm.valid) {
      console.log(this.inviteForm.value);
    } else {
      console.error('Form is invalid');
    }
  }





  toggleupdateSubMenus(menu: string, event: any) {
    const checked = event.checked;
    if (menu === 'master') {
      this.updateinviteform.company = true,
        this.updateinviteform.brandmodel = true,
        this.updateinviteform.supplier = true
    } else if (menu === 'business') {
      this.updateinviteform.jobcardpage = true,
        this.updateinviteform.reports = true
    } else if (menu === 'transaction') {
      this.updateinviteform.payment = true,
        this.updateinviteform.receipt = true,
        this.updateinviteform.expense = true
    }
  }

  // Toggle all menus and submenus when 'All Permissions with Edit' is checked
  toggleupdateAllPermissions(event: any) {

    this.updateinviteform.master = true,
      this.updateinviteform.company = true,
      this.updateinviteform.brandmodel = true,
      this.updateinviteform.supplier = true,
      this.updateinviteform.businessMenu = true,
      this.updateinviteform.jobcardpage = true,
      this.updateinviteform.reports = true,
      this.updateinviteform.Transactionmenu = true,
      this.updateinviteform.payment = true,
      this.updateinviteform.receipt = true,
      this.updateinviteform.expense = true
  }



}















