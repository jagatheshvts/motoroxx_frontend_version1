import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
    loading: boolean;
    loadingText: string;
    signinForm: UntypedFormGroup;

    error:any
  errorborder:boolean
  logindataresponse:any
  choosebranch_bool: boolean = false;
  allbranchdata: any;
  selectedbranch:string = "";
    constructor(
        private fb: UntypedFormBuilder,
        private auth: AuthService,
        private router: Router,private LocalStoreService: LocalStoreService,
    ) { }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.loadingText = 'Loading Dashboard Module...';

                this.loading = true;
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.loading = false;
            }
        });

        this.signinForm = this.fb.group({
            username: ['test@example.com', Validators.required],
            password: ['1234', Validators.required]
        });
    }

    signin() {
        // this.loading = true;
        // this.loadingText = 'Sigining in...';
        // this.auth.signin(this.signinForm.value)
        //     .subscribe(res => {
        //         this.router.navigateByUrl('/dashboard/v1');
        //         this.loading = false;
        //     });


        this.auth.signin(this.signinForm.value.username,this.signinForm.value.password).subscribe(data=>{
            if(data){

              if(data.response.status == "1"){
                this.logindataresponse =  data.responsedata
                localStorage.setItem("username",this.signinForm.value.username)
                localStorage.setItem("password",this.signinForm.value.password)
                localStorage.setItem("loginbranchid",this.logindataresponse.branch_id)
                localStorage.setItem("logincompanyid",this.logindataresponse.company_id)
                localStorage.setItem("userrole",this.logindataresponse.role)
  
                localStorage.setItem("creater_superadmin", this.logindataresponse.createradmin);
              //   localStorage.setItem("ShowClientsDetails", this.logindataresponse.createradmin);
                console.log("log of creditails",this.logindataresponse.createradmin);
                
                
  
                if(this.logindataresponse.permission){
  
                    localStorage.setItem("permission",JSON.stringify(this.logindataresponse.permission))
       
                    console.log("the full data of the permission",JSON.parse(localStorage.getItem("permission")))
                }
                // localStorage.setItem("gstcalulation",this.logindataresponse.gstcalulation)
                localStorage.setItem("gstcalculationspare", this.logindataresponse.gstcalulation.spareplusgst);
                localStorage.setItem("gstcalculationpack", this.logindataresponse.gstcalulation.packageplusgst);
                localStorage.setItem("gstcalculationlabour", this.logindataresponse.gstcalulation.labourplusgst);
                localStorage.setItem("shopusername",this.logindataresponse.shopusername)
                localStorage.setItem("ShopuserId",this.logindataresponse.ShopuserId)
                localStorage.setItem("service",this.logindataresponse.service)
                localStorage.setItem('branch_name',this.logindataresponse.branch_name)
                localStorage.setItem('customerinventory',this.logindataresponse.customerinventory)
                console.log("the data of the register submit",this.logindataresponse)
  
                if(this.logindataresponse.createradmin){
                  this.router.navigateByUrl('/dashboard/cv5');
                  this.loading = false;
                }
                else if(this.logindataresponse.role == "admin"){
                  this.choosebranch_bool = true
                  // this.router.navigateByUrl('/superadmin/companycreation');
                  this.LocalStoreService.get_comapanybranchdata(this.logindataresponse.company_id).subscribe(data=>{
  
                    this.allbranchdata = data.response
  
  
  
                  })
  
                  this.loading = false;
  
  
                }
                else{
                   this.router.navigateByUrl('/dashboard/v1');
                this.loading = false;
                }
              //   this.router.navigateByUrl('/dashboard/v1');
              //   this.loading = false;
              }
            }else{
              console.log("worng password")
                  this.errorborder = true
                  this.error = "Username or password invalid"

            }
          })
    }

    selectedbranch_dropdown(branchid) {
        console.log('Selected ID:', branchid);

        localStorage.setItem("loginbranchid",branchid)
        let selectedbranchdata

        this.LocalStoreService.getbranchbybranchidid2(branchid).subscribe(branchdata=>{
          selectedbranchdata = branchdata.response[0]

          console.log("the data of the branch that selected1",selectedbranchdata.gstcalulation.spareplusgst)
          console.log("the data of the branch that selected2",branchdata)
          if(selectedbranchdata.gstcalulation){
     console.log("entered into the gstcalculation")
            localStorage.setItem("gstcalculationspare", selectedbranchdata.gstcalulation.spareplusgst);
            localStorage.setItem("gstcalculationpack", selectedbranchdata.gstcalulation.packageplusgst);
            localStorage.setItem("gstcalculationlabour", selectedbranchdata.gstcalulation.labourplusgst);
          }
          localStorage.setItem("service",selectedbranchdata.service)
          localStorage.setItem('branch_name',selectedbranchdata.branch_name)
          localStorage.setItem('customerinventory',selectedbranchdata.inventorycustomer)
        
            
            this.router.navigateByUrl('/dashboard/v1');
          

            this.loading = false;


        
        })

       
      }

}
