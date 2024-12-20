import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';

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
    constructor(
        private fb: UntypedFormBuilder,
        private auth: AuthService,
        private router: Router
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
            console.log("the data inside the check login",data.responsedata)

            if(data.response.status == "1"){
              this.logindataresponse =  data.responsedata
              localStorage.setItem("username",this.signinForm.value.username)
              localStorage.setItem("password",this.signinForm.value.password)
              localStorage.setItem("loginbranchid",this.logindataresponse.branch_id)
              localStorage.setItem("logincompanyid",this.logindataresponse.company_id)
              localStorage.setItem("userrole",this.logindataresponse.role)

              localStorage.setItem("creater_superadmin", this.logindataresponse.createradmin);

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
              this.router.navigateByUrl('/dashboard/v1');
              this.loading = false;
            }else{
              console.log("worng password")
              this.errorborder = true
              this.error = "Username or password invalid"
            }
          })
    }

}
