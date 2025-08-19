import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-jobcard-print',
  // standalone: true,
  // imports: [],
  templateUrl: './jobcard-print.component.html',
  styleUrl: './jobcard-print.component.scss'
})



export class JobcardPrintComponent implements OnInit {
  jobCardData: any;

  constructor(private activateroute: ActivatedRoute){

  }




  ngOnInit(): void {

    this.oninit_print()
   

  
  }


  oninit_print() {

    this.activateroute.queryParams.subscribe(params => {

      if (params['alljobcarddata']) {
        this.jobCardData = JSON.parse(params['alljobcarddata']); 
        console.log(this.jobCardData);
      }
      
    });



  }


  

 



 

}
