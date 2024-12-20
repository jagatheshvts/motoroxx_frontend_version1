import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse  } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  authenticated = true;

  constructor(private store: LocalStoreService, private router: Router,private http: HttpClient) {
    this.checkAuth();
  }

  checkAuth() {
    this.authenticated = this.store.getItem("demo_login_status");
  }

  getuser() {
    return of({});
  }

  // signin(username,password) {
  //   this.authenticated = true;
  //   this.store.setItem("demo_login_status", true);
  //   return of({}).pipe(delay(1500));
  // }


  signin(username,password){
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/check_login`,{username:username,password:password})
    .pipe(map(responsedata =>{

      console.log("the data inside the signin",responsedata)
      if(responsedata.response.status == "1"){
        this.authenticated = true;
        this.store.setItem("demo_login_status", true);
          // return of({}).pipe(delay(1500));
          return responsedata;
      }
         
      }))
  }
  signout() {
    this.authenticated = false;
    this.store.setItem("demo_login_status", false);
    this.router.navigateByUrl("/sessions/signin");
  }
}
