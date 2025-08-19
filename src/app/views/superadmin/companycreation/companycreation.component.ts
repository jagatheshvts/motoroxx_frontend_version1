import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanymasterComponent } from '../companymaster/companymaster.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-companycreation',
 
  templateUrl: './companycreation.component.html',
  styleUrl: './companycreation.component.scss'
})
export class CompanycreationComponent implements OnInit {
  companydetails: any;
  dialogref: any;
  registrationForm: FormGroup;
  showAddCompany: boolean = false;
  allbranchdata: any;



  constructor(private route: ActivatedRoute, private LocalStoreService: LocalStoreService,  private fb: FormBuilder, private model: NgbModal,
    private dialog: MatDialog,private fb2: UntypedFormBuilder, private toastr: ToastrService,private router: Router
  ) { }


  ngOnInit(): void {



    let username = localStorage.getItem('username')
    let password = localStorage.getItem('password')
    let creater_superadmin = localStorage.getItem('creater_superadmin')
        if (creater_superadmin == "true") {
            this.showAddCompany = true;
            console.log('Add Company menu is visible');  // Debug: Check if the condition is met
        } else {
            this.showAddCompany = false;
        }

    this.getcompanydetails();
    this.getallbranchdata()
    
  }

  getcompanydetails() {

    var loginbranch = localStorage.getItem("loginbranchid");
    let logincompany = localStorage.getItem("logincompanyid")
      this.LocalStoreService.getcompdetails(loginbranch,logincompany).subscribe(data => {
        this.companydetails = data.response
      })
    }

    getallbranchdata(){

      this.LocalStoreService.getallbranchdata().subscribe(data => {
        this.allbranchdata = data.response
      })
    }


    fullcompanydetails(company_id){

      // this.router.navigate(['superadmin/companymaster']);

      this.router.navigate(['superadmin/companymaster'], { queryParams: { company_id: company_id } });


      // const popupdata = this.model.open(CompanymasterComponent,{
      //   ariaLabelledBy: "modal-basic-title",
      //   size: "lg",
      // })
   
      // popupdata.componentInstance.company_id = company_id
  
    }



    createFormGroup(){

      this.registrationForm = this.fb.group({
        companyname: ['',],
        companyshortname: ['',],
        pan: ['',],
        gst: ['',],
        address: ['',],
        type: ['',],
        mobile: ['',],
        logo: ['']
      });

    }


    createcompany(companycreatingpage){
      // this.typeofcreating = "company"
    this.createFormGroup()
    this.dialogref = this.model.open(companycreatingpage, {

      ariaLabelledBy: "modal-basic-title",
      size: "lg",
   
      // maxHeight: '100vh',
      // disableClose: true,
    })

    }
     
    closedialog(){

      this.dialogref.close()
    }




    create_company(){
      console.log("the details of the registeration form", this.registrationForm.value)
      this.LocalStoreService.createcompany(this.registrationForm.value).subscribe(data => {
        console.log("the data inside the create company", data)
        this.getcompanydetails()
  
        this.closedialog()
      })
    }
  

}
