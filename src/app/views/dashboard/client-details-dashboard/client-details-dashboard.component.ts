import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-client-details-dashboard',
  // standalone: true,
  // imports: [],
  templateUrl: './client-details-dashboard.component.html',
  styleUrl: './client-details-dashboard.component.scss'
})
export class ClientDetailsDashboardComponent implements OnInit {
  


  // alldatas: any
  // searchTerm: string = '';
  activebranchlength = 0;
  nonactivebranchlength = 0;
  totalclient = 0;
  showTesting = false;
  alldatas: any = { data: [] }; // Initialize an empty array for `data`
  filteredClients: any[] = []; // Array to store the filtered list
  searchTerm: string = ''; 
  


  constructor(private localservice: LocalStoreService) {

  }
  ngOnInit(): void {
    

   let creater_superadmin = localStorage.getItem('creater_superadmin')
   if (creater_superadmin == "true") {
    console.log('creater_superadmin  true');
    this.getonload_companydetails();

   }
   else{
    console.log('ShowClientsDetails  false');

   }
 
    
  }
  getonload_companydetails(){

    this.localservice.getallclients_forsuperadmin().subscribe(data=>{

      console.log("the data inasid ethe response superaDMIN ",data);
      this.alldatas = data;
      this.filteredClients = this.alldatas.data;

      this.alldatas.data.forEach(data=>{
        if(data.branchactive == true && data.testing == false){

          this.activebranchlength++ 

        
        }else if(data.branchactive == false && data.testing == false){
          this.nonactivebranchlength++
        }
      })
      this.totalclient = this.activebranchlength + this.nonactivebranchlength;

      console.log("active branch",this.activebranchlength);
      console.log("unactive branch",this.nonactivebranchlength);
      console.log("Total client", this.totalclient);
      

    })


  }
  filterClients(): void {
    this.filteredClients = this.alldatas.data.filter((client: any) =>
      client.companyName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


}
