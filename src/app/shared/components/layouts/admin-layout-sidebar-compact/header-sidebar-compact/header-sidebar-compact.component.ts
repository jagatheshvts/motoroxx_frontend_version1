import { Component, OnInit } from "@angular/core";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { SearchService } from "src/app/shared/services/search.service";
import { AuthService } from "src/app/shared/services/auth.service";
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { Router } from "@angular/router";
import { MatTooltipModule } from '@angular/material/tooltip';




@Component({
  selector: "app-header-sidebar-compact",
  templateUrl: "./header-sidebar-compact.component.html",
  styleUrls: ["./header-sidebar-compact.component.scss"]
})
export class HeaderSidebarCompactComponent implements OnInit {
  notifications: any[];

  role:any
  logincompanyid: any;
  allbranchdata: any;
  selectedbranch:any;
  

  constructor(
    private navService: NavigationService,
    public searchService: SearchService,
    private auth: AuthService,
    private LocalStoreService: LocalStoreService,
    private router: Router,
  ) {
    this.notifications = [
      {
        icon: "i-Speach-Bubble-6",
        title: "New message",
        badge: "3",
        text: "James: Hey! are you busy?",
        time: new Date(),
        status: "primary",
        link: "/chat"
      },
      {
        icon: "i-Receipt-3",
        title: "New order received",
        badge: "$4036",
        text: "1 Headphone, 3 iPhone x",
        time: new Date("11/11/2023"),
        status: "success",
        link: "/tables/full"
      },
      {
        icon: "i-Empty-Box",
        title: "Product out of stock",
        text: "Headphone E67, R98, XL90, Q77",
        time: new Date("11/10/2023"),
        status: "danger",
        link: "/tables/list"
      },
      {
        icon: "i-Data-Power",
        title: "Server up!",
        text: "Server rebooted successfully",
        time: new Date("11/08/2023"),
        status: "success",
        link: "/dashboard/v2"
      },
      {
        icon: "i-Data-Block",
        title: "Server down!",
        badge: "Resolved",
        text: "Region 1: Server crashed!",
        time: new Date("11/06/2023"),
        status: "danger",
        link: "/dashboard/v3"
      }
    ];
  }

  ngOnInit() {

    this.role= localStorage.getItem('userrole')
    this.logincompanyid= localStorage.getItem('logincompanyid')

    this.LocalStoreService.get_comapanybranchdata(this.logincompanyid).subscribe(data=>{
  
      this.allbranchdata = data.response



    })


  }


  logBranchId(branchid: string) {


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
    
        
        // this.router.navigateByUrl('/dashboard/v1');
      

        // this.loading = false;
        window.location.reload();


    
    })
  }

  toggelSidebar() {
    const state = this.navService.sidebarState;
    state.sidenavOpen = !state.sidenavOpen;
    state.childnavOpen = !state.childnavOpen;
  }

  signout() {
    localStorage.clear();
    sessionStorage.clear();


    this.auth.signout();
    window.location.reload(); 
  }



  activePage: string = '';
  jobcardheader() {
    this.activePage = 'jobcard';
    this.router.navigate(['/Business/jobcard']);
   
  }
  estimateinvoice() {
    this.activePage = 'est/inv';
    this.router.navigate(['/Business']);
  }
  gstpage() {
    this.activePage = 'gst';
    this.router.navigate(['/uikits/Gst']);

  }
  vipagedirect() {
    this.activePage = 'vi';
    this.router.navigate(['/uikits/VI']);
  }
  estimatepage() {
    this.activePage= 'est';
    this.router.navigate(['/uikits/Est']);
  }
  invoicepage() {
    this.activePage = 'inv';
    this.router.navigate(['/uikits/Inv']);
  }
  inwardpage(){
    this.activePage = 'inward';
    this.router.navigate(['/transaction/receipt']);
  }
  payment(){
    this.activePage = 'payment';
    this.router.navigate(['/transaction/payments']);
  }





}
