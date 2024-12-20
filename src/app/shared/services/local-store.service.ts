import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';


import { Router } from "@angular/router";
import { of } from "rxjs"; 
import { delay } from "rxjs/operators";


import { saveAs } from 'file-saver';


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  private ls = window.localStorage;
  constructor(private router: Router, private http: HttpClient) { }

  public setItem(key, value) {
    value = JSON.stringify(value);
    this.ls.setItem(key, value);
    return true;
  }

  public getItem(key) {
    const value = this.ls.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      // console.log(e)
      return null;
    }
  }
  public clear() {
    this.ls.clear();
  }


  getvehicle_based_on_date(date, branchid) {

    return this.http.get<any>(`${environment.apiUrl}/shopusers/estimate/getvehicle_based_on_date?date=${date}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  getestimate_based_on_date(date, branchid) {
    return this.http.get<any>(`${environment.apiUrl}/shopusers/estimate/getestimate_based_on_date?date=${date}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  getinvoice_based_on_date(date, branchid) {

    return this.http.get<any>(`${environment.apiUrl}/shopusers/estimate/getinvoice_based_on_date?date=${date}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  gettotal_gstdatewise(startdate, status) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_datewise_totalreport?startdate=${startdate}&status=${status}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  gettotal_gstrangeewise(startdate, enddate, status) {
    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_rangewise_totalreport?startdate=${startdate}&enddate=${enddate}&status=${status}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  public exportAsmonthlyreport_data(json: any[], excelFileName: string): void {

    console.log("entered the excel")
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);


    const workbook: XLSX.WorkBook = { Sheets: { 'customerdata': worksheet }, SheetNames: ['customerdata'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.savemothlyreport_data(excelBuffer, excelFileName);
  }


  private savemothlyreport_data(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const Today = new Date();

    FileSaver.saveAs(data, fileName + 'customerdata' + EXCEL_EXTENSION);
  }


  getsparedatareport(startdate, enddate) {

    var branchid = localStorage.getItem("loginbranchid");


    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getsparereport?startdate=${startdate}&enddate=${enddate}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }


  sparereportexcel(startdate: string, enddate: string): Observable<Blob> {

    var branchid = localStorage.getItem("loginbranchid");

    const url = `${environment.apiUrl}/superadmin/superadminauth/getsparereport_excel?startdate=${startdate}&enddate=${enddate}&branchid=${branchid}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(response => {
        return response;
      })
    );
  }

  getbatteryreport_excel(startdate: string, enddate: string): Observable<Blob> {

    var branchid = localStorage.getItem("loginbranchid");

    const url = `${environment.apiUrl}/superadmin/superadminauth/getbatteryreport_excel?startdate=${startdate}&enddate=${enddate}&branchid=${branchid}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(response => {
        return response;
      })
    );
  }


  getbatteryreport(startdate, enddate) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getbatteryreport?startdate=${startdate}&enddate=${enddate}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }


  alltechnician() {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getalltechnician?branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  get_alltech_jobcard(alltechids, startdate, enddate, status) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_alltech_jobcard?branchid=${branchid}&startdate=${startdate}&enddate=${enddate}&status=${status}&alltechids=${alltechids}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  gettechnician_jobcard(techdata, startdate, enddate, status) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/gettechnician_jobcard?branchid=${branchid}&startdate=${startdate}&enddate=${enddate}&status=${status}&techdata=${techdata}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  get_dayilreport(date, status) {
    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_datafor_dailyreport?date=${date}&status=${status}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }


  public exportAsExcelFile_task(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    // Customize the header row to include the "Spare" column
    const header = ["Created Date", "Invoice Date", "Invoice No", "Name", "Mobile", "Brand", "Model", "Vehicle Number", "Spare", "Qty", "Rate", "Amount", "TaxAmount", "GST%", "CGST9%", "SGST9%", "CGST14%", "SGST14%"];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].v = header[C];
    }

    // Calculate and set column widths based on content
    const colWidths = header.map((header, index) => {
      const maxContentWidth = json.reduce((maxWidth, row) => {
        const cellValue = row[header] || "";
        const cellWidth = cellValue.toString().length;
        return Math.max(maxWidth, cellWidth);
      }, header.length);
      return { wch: maxContentWidth + 2 }; // Adding some padding
    });

    worksheet['!cols'] = colWidths;

    const workbook: XLSX.WorkBook = { Sheets: { 'GST_report': worksheet }, SheetNames: ['GST_report'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile_task(excelBuffer, excelFileName);
  }


  private saveAsExcelFile_task(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const Today = new Date();

    FileSaver.saveAs(data, fileName + 'customerdata' + EXCEL_EXTENSION);
  }




  public esportestspareexcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    // Customize the header row to include the "Spare" column
    const header = ["Created Date", "estimate Date", "Name", "Mobile", "Brand", "Model", "Vehicle Number", "Spare", "Qty", "Rate", "Amount",];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].v = header[C];
    }

    // Calculate and set column widths based on content
    const colWidths = header.map((header, index) => {
      const maxContentWidth = json.reduce((maxWidth, row) => {
        const cellValue = row[header] || "";
        const cellWidth = cellValue.toString().length;
        return Math.max(maxWidth, cellWidth);
      }, header.length);
      return { wch: maxContentWidth + 2 }; // Adding some padding
    });

    worksheet['!cols'] = colWidths;

    const workbook: XLSX.WorkBook = { Sheets: { 'GST_report': worksheet }, SheetNames: ['GST_report'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFileesti_task(excelBuffer, excelFileName);
  }


  private saveAsExcelFileesti_task(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const Today = new Date();

    FileSaver.saveAs(data, fileName + 'customerdata' + EXCEL_EXTENSION);
  }



  get_data_forwhatsappscreen(selectedyearmonth, status) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_data_forwhatsappscreen?date=${selectedyearmonth}&status=${status}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }



  whatsapp_sentupdate(jobid) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/whatsapp_sentupdate`, {
      jobid: jobid
    }).pipe(map(responsedata => {
      return responsedata
    }))


  }

  getmasterdata(curser) {

    var branchid = localStorage.getItem("loginbranchid");


    return this.http.get<any>(`${environment.apiUrl}/shopusers/estimate/weppagedetails?cursor=${curser}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata;
      }))
  }


  getsearchdata_forwebapp(searchTerm) {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getsearchdata_forwebapp?name=${searchTerm}`)
      .pipe(map(responsedata => {
        return responsedata;
      }))
  }

  getjobcarddata(jobcarid, flags) {

    console.log("the data of the flag", flags)
    return this.http.post<any>(`${environment.apiUrl}/shopusers/estimate/getjocardbyid`, { jobcarid: jobcarid, flag: flags }).pipe(map(responsedata => {
      return responsedata
    }))
  }


  updateinvoicespares(jobCardId, invoicedata) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.post<any>(`${environment.apiUrl}/shopusers/estimate/invoice_newrequirement_forwebapp`, { branch_id: branchid, jobCardId: jobCardId, invoicedata: invoicedata }).pipe(map(responsedata => {
      return responsedata
    }))
  }

  edit_for_invoicerunning_running_number(jobcardid, servicespares, complaintsparedata, extraspares, allspares, inputDataArray, servicelabours, complaint_labours, extralabours, CombinedLabourArray, inputLabourDataArray) {
    return this.http.post<any>(`${environment.apiUrl}/shopusers/estimate/edit_for_invoicerunning_running_number`, {
      jobcardid: jobcardid, servicespares: servicespares, complaintsparedata: complaintsparedata, extraspares: extraspares,
      allspares: allspares, addedspares: inputDataArray, servicelabours: servicelabours, complaint_labours: complaint_labours, extralabours: extralabours, alllabours: CombinedLabourArray, addedlabours: inputLabourDataArray
    }).pipe(map(responsedata => {
      return responsedata
    }))
  }

  updateallspares(jobCardId, estimatedata) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.post<any>(`${environment.apiUrl}/shopusers/estimate/estimate_newrequirement_forwebapp`, { branch_id: branchid, jobCardId: jobCardId, estimatedata: estimatedata }).pipe(map(responsedata => {
      return responsedata
    }))
  }

  customerhistory(mobile, flag) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/shopusers/addcomplaints/historypopup?mobile=${mobile}&flag=${flag}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  getStatusList() {

    return this.http.get<any>(`${environment.apiUrl}/shopusers/estimate/getstatuslistfor_weppage`).pipe
      (map(responsedata => {
        return responsedata
      }))
  }

  statusupdate_adminpage(statusvalue, statuskey, jobcardid) {
    return this.http.post<any>(`${environment.apiUrl}/shopusers/estimate/updateby_weppage_status`, { key: statuskey, value: statusvalue, jobcard_id: jobcardid }).pipe(map(responsedata => {
      return responsedata
    }))
  }

  edit_customer(userid, vehicleid, jobcardid, name, mobile) {
    return this.http.post<any>(`${environment.apiUrl}/shopusers/shopprofile/edit_customer`, {
      userid: userid, vehicleid: vehicleid, jobcardid: jobcardid, name: name, mobile: mobile
    }).pipe(map(responsedata => {
      return responsedata
    }))

  }

  markasdelete(boolean, deletestatus, jobcardid) {
    return this.http.post<any>(`${environment.apiUrl}/shopusers/addcomplaints/update_delete_status`, {
      deletstatusboolean: boolean, deletestatus: deletestatus, jobcardid: jobcardid
    }).pipe(map(responsedata => {
      return responsedata
    }))

  }

  getSpareSuggestions(brand, model, searchingname) {

    var servicetype = localStorage.getItem("service");
    var company_id = localStorage.getItem("logincompanyid");
    var branchid = localStorage.getItem("loginbranchid");
    


    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getsparevalues?brand=${brand}&model=${model}&searchingname=${searchingname}&servicetype=${servicetype}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  getfiltereddata(curser, dropdownvalue) {

    var branchid = localStorage.getItem("loginbranchid");


    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/status_filtereddata?cursor=${curser}&branchid=${branchid}&dropdownvalue=${dropdownvalue}`)
      .pipe(map(responsedata => {
        return responsedata;
      }))
  }

  getvendardata(curser) {

    console.log('enter +++')
    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getsupplier_data?cursor=${curser}&branchid=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))
  }

  getvendor_byid(vendorid) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getsupplier_byid?vendorid=${vendorid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))
  }

  editvendor_byid(vendorid, editvendorsdata) {
    var branchid = localStorage.getItem("loginbranchid");

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/editsupplier_byid`, {
      vendorid: vendorid, editvendorsdata: editvendorsdata
    }).pipe(map(responsedata => {
      return responsedata
    }))
  }

  create_vendor(vendorDetails, contactDetails, taxDetails, selectedHead,selectedBrands,selectedCategories) {
    let branchId = localStorage.getItem('loginbranchid');
    let companyid = localStorage.getItem("logincompanyid")

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/postsupplier`, { branch_id: branchId, company_id: companyid, vendor: vendorDetails, contact: contactDetails, tax: taxDetails, selectedHead: selectedHead,selectedBrands:selectedBrands,selectedCategories:selectedCategories })
      .pipe(map(response => {
        return response
      }))
  }

  sup_transbyid(vendorid) {

    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/sup_transbyid?vendorid=${vendorid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))
  }


  // postsupplierreceipt(supplier_credetials,receiptdata,receiptdate,sup_invno,amount,cgst,sgst,igst){

  //   let branchId = localStorage.getItem('loginbranchid')
  //   let companyid = localStorage.getItem("logincompanyid")

  //   return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/postsupplierreceipt`, { branch_id:branchId , company_id: companyid, supplier_credetials: supplier_credetials,receiptdata:receiptdata,
  //     receiptdate:receiptdate,sup_invno:sup_invno,amount:amount,cgst:cgst,sgst:sgst,igst:igst

  //   })
  //   .pipe(map(response => {
  //     return response
  //   }))

  // }


  //arvind newly did

  postsupplierreceipt(
    supplier_credetials,
    receiptdata,
    receiptdate,
    sup_invno,
    no_of_items,
    beforeTax,
    taxTotal,
    afterTax,
    roundOff,
    grandTotal
  ) {
    let branchId = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid");
  
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/postsupplierreceipt`, {
      branch_id: branchId,
      company_id: companyid,
      receiptdata: receiptdata,
      supplier_credetials: supplier_credetials,
      receiptdate: receiptdate,
      sup_invno: sup_invno,
      no_of_items: no_of_items,
      amountbeforetax: beforeTax,
      totaltax: taxTotal,
      amountaftertax: afterTax,
      roundoff: roundOff,
      grandtotal: grandTotal
    }).pipe(map((response) => {
      return response;
    }));
  }
 
  receiptTotalValue(supplier_credetials, receiptdata, receiptdate, sup_invno) {
    const companyid = localStorage.getItem("logincompanyid");
    const branchid = localStorage.getItem("loginbranchid");
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/receiptValue`, {
      branch_id: branchid,
      company_id: companyid,
      receiptdata: receiptdata,
      supplier_credetials: supplier_credetials,
      receiptdate: receiptdate,
      sup_invno: sup_invno,
    }).pipe(map(response => {
      console.log("Sending Receipt Data: ", receiptdata); // Log to check values
      return response
    }))
  }




  // postpayments_forsupplier(supplier_credetials,supplierfulldata,formateddate_pay,payid,paymentCash,choosedbank,particular,status,bankcredentials){

  //   let branchId = localStorage.getItem('loginbranchid')
  //   let companyid = localStorage.getItem("logincompanyid")

  //   return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/postpayments_forsupplier`, { branch_id:branchId , company_id: companyid, supplierid: supplier_credetials,formateddate_pay:formateddate_pay,
  //     payid:payid,paymentCash:paymentCash,bank:choosedbank,particular:particular,status:status,bankcredentials:bankcredentials,fulldata:supplierfulldata

  //   })
  //   .pipe(map(response => {
  //     return response
  //   }))

  // }

  postpayments_forsupplier(supplier_credetials, supplierfulldata, formateddate_pay, payid, paymentCash, choosedbank, particular, status, bankcredentials) {

    let branchId = localStorage.getItem('loginbranchid')
    let companyid = localStorage.getItem("logincompanyid")

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/postpayments_forsupplier`, {
      branch_id: branchId, company_id: companyid, supplierid: supplier_credetials, formateddate_pay: formateddate_pay,
      payid: payid, paymentCash: paymentCash, bank: choosedbank, particular: particular, status: status, bankcredentials: bankcredentials, fulldata: supplierfulldata
    })
      .pipe(map(response => {
        return response
      }))

  }


  getbankdetails() {

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getbankdetails?branchid=${branchid}&companyId=${companyid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }


  getexpenseheads() {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_expensehead`)
      .pipe(map(responsedata => {
        return responsedata
      }))
  }

  add_expensehead(newHead) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/add_expensehead`, { head: newHead })
      .pipe(map(response => {
        return response
      }))

  }



  getdataby_expensehead(startdate, enddate, expensehead, suppliernames) {
    var branchid = localStorage.getItem("loginbranchid");

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getdataby_expensehead?startdate=${startdate}&enddate=${enddate}&branchid=${branchid}&expensehead=${expensehead}&suppliernames=${suppliernames}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  

  

  averageDatalastTwoMonths(date, loginbranchid) {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/averageReport_lastTwoMonths?date=${date}&branchId=${loginbranchid}`)
      .pipe(map(responseData => {
        return responseData.response;
      }))
  }

  lastthreeMonthsdata(date, loginbranchid) {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/last_threemonthsdata?date=${date}&branchId=${loginbranchid}`)
      .pipe(map(responseData => {
        console.log('Backend Response amount:', responseData);
        return responseData.response;
      }));
  }

  vehicleDatalastThreeMonths(date: string, loginbranchid) {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/totalVehicle_lastThreeMonths?date=${date}&branchId=${loginbranchid}`)
      .pipe(map(responseData => {
        console.log('Backend Response vehicle:', responseData);
        return responseData.response;
      }));
  }







  //newly added for superadmin

  getcompanybyid(company_id) {

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getcompanyby_id?companyid=${company_id}`)
      .pipe(map(responsedata => {

        return responsedata
      }))

  }


  get_comapanybranchdata(companyid) {
    let branchid = localStorage.getItem("loginbranchid");   
    let userrole = localStorage.getItem('userrole')
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_comapanybranchdata?company_id=${companyid}&branchid=${branchid}&userrole=${userrole}`)
      .pipe(map(responsedata => {

        return responsedata
      }))
  }

  updatealldetailsbranch(branchid, branchdata) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/updatealldetailsbranch`, { branchid: branchid, branchdata: branchdata })
      .pipe(map(responsedata => {

        return responsedata

      }))

  }

  savecompany(companyid, companydata) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/updatealldetailscompany`, { companyid: companyid, companydata: companydata })
      .pipe(map(responsedata => {

        return responsedata

      }))

  }

  updaterunningno_branch(branchid, branchdata, flag) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/updaterunningno_branch`, { branchid: branchid, branchdata: branchdata, flag: flag })
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  createbranch(companyid, createdbranch,buyingControl,assignStaffControl,inventorycustomer,genralservice) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/createbranch`, { companyid: companyid, createdbranch: createdbranch,buyingControl:buyingControl,assignStaffControl:assignStaffControl,inventorycustomer:inventorycustomer,genralservice:genralservice })
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  getusersofbranch(branchid) {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getusersofbranch?branchid=${branchid}`)
      .pipe(map(responsedata => {

        return responsedata
      }))

  }


  gettechofbranch(branchid) {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/gettechofbranch?branchid=${branchid}`)
      .pipe(map(responsedata => {

        return responsedata
      }))

  }


  updatesuperadmin(shopuserid, superadminname, superadmin_password, superadmin_authpin, deletestatus, flag,updateinviteform,Role,superadmin_Mobile) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/updatesuperadmin`, {
      shopuserid: shopuserid, superadminname: superadminname,
      superadmin_password: superadmin_password, superadmin_authpin: superadmin_authpin, deletestatus: deletestatus, flag: flag,
      updateinviteform:updateinviteform,Role:Role,superadmin_Mobile:superadmin_Mobile
    })
      .pipe(map(responsedata => {
        return responsedata

      }))
  }

  updatetechdata(techid, techname, techpresent, flag) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/updatesuperadmin`, {
      techid: techid, techname: techname,
      techpresent: techpresent, flag: flag
    })
      .pipe(map(responsedata => {
        return responsedata

      }))
  }

  bankList() {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getbankName`)
      .pipe(map(response => {
        console.log("data from backend>>>>>>>>>>>>>>", response)
        return response;
      }))
  }





  //brand and model services

  getoilrates() {

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getoilrates`)
      .pipe(map(responsedata => {

        return responsedata
      }))

  }


  getbrandmodelprizes() {
    let service = localStorage.getItem('service')
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getbrandmodelprizes?service=${service}&branchId=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))
  }


  getcarbrandmodelprizes() {
    let service = localStorage.getItem('service')
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getcarbrandmodelprizes?service=${service}&branchId=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))
  }




  updateprizedata(selectedbrand, updateddata) {

    console.log("the data inside the brand full bikes",updateddata)

    let service = localStorage.getItem('service')
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.put<any>(`${environment.apiUrl}/superadmin/superadminauth/updateprizedata`, { brand: selectedbrand, updateddata: updateddata, service: service, branchid:branchid })
      .pipe(map(responsedata => {
        return responsedata

      }))

  }


  addingbikes(brandname, bikename, length, gsp, bsp, gspRegularPriceChecked, gspOffer1Checked, gspOffer2Checked, bspRegularPriceChecked, bspOffer1Checked, bspOffer2Checked) {
    let servicetype = localStorage.getItem('service')
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.post<any>(`${environment.apiUrl}/shopusers/shopauth/addbikes`, {
      brandname: brandname, bikename: bikename, length: length,
      gsp: gsp, bsp: bsp, gspRegularPriceChecked: gspRegularPriceChecked, gspOffer1Checked: gspOffer1Checked, gspOffer2Checked: gspOffer2Checked,
      bspRegularPriceChecked: bspRegularPriceChecked, bspOffer1Checked: bspOffer1Checked, bspOffer2Checked: bspOffer2Checked, servicetype: servicetype,
      branchid:branchid
    })
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  updateoilrates(oilarraydata) {
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/updateoilrates`, { updaterate: oilarraydata })
      .pipe(map(responsedata => {
        return responsedata
      }))

  }



  getbranchdetailsbyid(companyid) {
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getbranchbyid?companyid=${companyid}`)
      .pipe(map(responsedata => {

        return responsedata
      }))
  }

  adduser(selectedbranch, registerationvalue,permission,Role) {
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/adduser`, { selectedbranchdata: selectedbranch, adduserdata: registerationvalue, permission:permission,role:Role })
      .pipe(map(responsedata => {
        return responsedata
      }))
  }


  check_techusers(shortname, selectedBranchData_tech) {

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/check_techuser?shortname=${shortname}&branch_id=${selectedBranchData_tech._id}`)
      .pipe(map(responsedata => {

        return responsedata
      }))


  }


  check_passowrd_authpin(password,authpin, selectedBranchData) {

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/check_passowrd_authpin?password=${password}&authpin=${authpin}&branch_id=${selectedBranchData._id}`)
      .pipe(map(responsedata => {

        return responsedata
      }))


  }

  addtechuser(selectedbranch, registerationvalue) {
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/addtechnician`, { selectedbranchdata: selectedbranch, addtecniciondata: registerationvalue })
      .pipe(map(responsedata => {
        return responsedata
      }))
  }



  getcompdetails(loginbranch, logincompany) {

    let username = localStorage.getItem('username')
    let password = localStorage.getItem('password')
    let userrole = localStorage.getItem('userrole')
    console.log("the data inside the userrole",userrole)
    let ShopuserId = localStorage.getItem('ShopuserId')
    let creater_superadmin = localStorage.getItem('creater_superadmin')

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getallcompany?loginbranch=${loginbranch}&logincompany=${logincompany}&username=${username}&password=${password}&userrole=${userrole}&ShopuserId=${ShopuserId}&creater_superadmin=${creater_superadmin}`)
      .pipe(map(responsedata => {

        return responsedata

      }))
  }


  getallbranchdata() {

 

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getallbranchdata`)
      .pipe(map(responsedata => {

        return responsedata

      }))
  }


  createcompany(companydata) {

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/create_company`, { companydata: companydata })
      .pipe(map(responsedata => {
        return responsedata

      }))
  }

  averageData_lastTwoMonths(date: string, loginbranchid) {
    return this.http
      .get<any>(
        `${environment.apiUrl}/superadmin/superadminauth/averageReport_lastTwoMonths?date=${date}&branchId=${loginbranchid}`
      )
      .pipe(
        map((responseData) => {
          console.log("Backend Response average :", responseData);
          return responseData.response;
        })
      );
  }


  last_threeMonths_data(date: string, loginbranchid) {
    return this.http
      .get<any>(
        `${environment.apiUrl}/superadmin/superadminauth/last_threemonthsdata?date=${date}&branchId=${loginbranchid}`
      )
      .pipe(
        map((responseData) => {
          console.log("Backend Response amount:", responseData);
          return responseData.response;
        })
      );
  }

  vehicleData_lastThreeMonths(date: string, loginbranchid) {
    return this.http
      .get<any>(
        `${environment.apiUrl}/superadmin/superadminauth/totalVehicle_lastThreeMonths?date=${date}&branchId=${loginbranchid}`
      )
      .pipe(
        map((responseData) => {
          console.log("Backend Response vehicle:", responseData);
          return responseData.response;
        })
      );
  }


  getbranchbybranchidid(){
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getbranchbybranchidid?branchid=${branchid}`)
    .pipe(map(responsedata => {

      return responsedata

    }))
  }


  addvehiclebrand(brand,brandaddingfor){

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/addvehiclebrand`, { brand:brand,brandaddingfor:brandaddingfor})
    .pipe(map(responsedata => {
      return responsedata
    }))

  }

  supplier_receipt_inventory(supplier_credential,inputDataArray,inventory_brandid,sup_receiptdate,sup_invno,total_amount_receipt,total_cgst_receipt,total_sgst_receipt,total_igst_receipt,receipt_total,amount_before_tax,tax_total,
    amount_after_tax,round_off,grand_total
  ){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/supplier_receipt_inventory`, { supplier_credential:supplier_credential,inputDataArray:inputDataArray,sup_receiptdate:sup_receiptdate,
      sup_invno:sup_invno,total_amount_receipt:total_amount_receipt,total_cgst_receipt:total_cgst_receipt,total_sgst_receipt:total_sgst_receipt,total_igst_receipt:total_igst_receipt,receipt_total:receipt_total,
      amount_before_tax:amount_before_tax,tax_total:tax_total,amount_after_tax:amount_after_tax,round_off:round_off,grand_total:grand_total,inventory_brandid:inventory_brandid,company_id:companyid,branch_id:branchid
    })
    .pipe(map(responsedata => {
      return responsedata
    }))
  }

  get_invetory_brands(){
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_invetory_brands?branchId=${branchid}`)
    .pipe(map(responsedata => {
      return responsedata
    }))
  }

  get_category_inventory(){
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_category_inventory?branchId=${branchid}`)
    .pipe(map(responsedata => {
      return responsedata
    }))
  }

  
  inventory_product(productobj, obj, categoryobj,modelobj) {

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    return this.http
      .post<any>(
        `${environment.apiUrl}/superadmin/superadminauth/product_inventory`, { productobj: productobj, branch_id: branchid, company_id: companyid,brandobj:obj,categoryobj:categoryobj,modelobj:modelobj  }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );

  }

  // get_inventory_products() {
  //   let branchid = localStorage.getItem("loginbranchid");
  //   console.log("this is branch id", branchid);
  //   let companyid = localStorage.getItem("logincompanyid")


  //   return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_inventory_products?branchId=${branchid}`).pipe(map(responsedata=>{
  //     return responsedata
  //   }))

  // }

  get_inventory_products(page,pageSize,search,sortField,sortOrder) {
    let branchid = localStorage.getItem("loginbranchid");
    console.log("this is branch id", branchid);
    let companyid = localStorage.getItem("logincompanyid")
    
   
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_inventory_products?branchId=${branchid}&page=${page}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`).pipe(map(responsedata=>{
      return responsedata
    }))

  }


  brandsave(addbrand,flag,model){

//     console.log("enter brandsave localstore",addbrand)
//     console.log("enter brandsave localstore flag",flag)
// return
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")

    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/addbrand_inventory`, {brand: addbrand,flag:flag,branch_id:branchid,company_id:companyid,model:model}).pipe(map((responsedata)=>{
      console.log("this is backend data brand", responsedata)
      return responsedata.response
    }))
  }
  saveCategory(category){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/inventory_category`, {category:category,branch_id:branchid,company_id:companyid}).pipe(map((responsedata)=>{
      return responsedata.response
    }))
  } 
  get_inventory_brands(){
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_invetory_brands?branchId=${branchid}`).pipe(
      map((responseData) => {
        console.log("Backend Response Brand:", responseData);
        return responseData;
      })
    );
  }


  checkproduct(product_id){
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/checkproduct?branchId=${branchid}&product_id=${product_id}`).pipe(
      map((responseData) => {
        console.log("Backend Response Brand:", responseData);
        return responseData;
      })
    );
  }

  checkinventorydataexist(process,clintdata,selectedbrand){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/checkinventorydataexist?branchId=${branchid}&process=${process}&company_id=${companyid}&clintdata=${clintdata}&brand=${selectedbrand}`).pipe(
      map((responseData) => {
        console.log("Backend Response Brand:", responseData);
        return responseData;
      })
    );
  }

  checkFullProductId(partcode){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/checkFullProductId?branchId=${branchid}&company_id=${companyid}&partcode=${partcode}`).pipe(
      map((responseData) => {
        console.log("Backend Response Brand:", responseData);
        return responseData;
      })
    );

  }


  updateproduct_inventory(fullproductdata_foredit){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/updateproduct_inventory`, {fullproductdata_foredit:fullproductdata_foredit,branch_id:branchid,company_id:companyid}).pipe(map((responsedata)=>{
      return responsedata.response
    }))

  }


  inventory_spareparts(brand, model, searchingname,type) {

    var servicetype = localStorage.getItem("service");
    var company_id = localStorage.getItem("logincompanyid");
    var branchid = localStorage.getItem("loginbranchid");
    


    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/inventory_spareparts?brand=${brand}&model=${model}&searchingname=${searchingname}&servicetype=${servicetype}&company_id=${company_id}&branchid=${branchid}&flag=${type}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  update_receipt_inventory(supplier_id,receiptdata,receiptupdateindex){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/update_receipt_inventory`, {supplier_id:supplier_id,receiptdata:receiptdata,receiptupdateindex:receiptupdateindex}).pipe(map((responsedata)=>{
      return responsedata.response
    }))

  }



  uploadExcelToDB(file: File){
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")

    // return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/uploadproductexcelsheet?branchId=${branchid}`, {file: file}).pipe(map((responsedata)=>{
    //   return responsedata.response
    // }))
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('branchId', branchid);
    formdata.append('company_id', companyid);
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/uploadproductexcelsheet`, formdata).pipe(map((responsedata)=>{
      return responsedata.response
    }))
  }


  uploadExcelToDB_customerdata(file: File){
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")

    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('branchId', branchid);
    formdata.append('company_id', companyid);
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/uploadExcelToDB_customerdata`, formdata).pipe(map((responsedata)=>{
      return responsedata.response
    }))
  }

  uploadExcelToDB_bulletdata(file: File){
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
 
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('branchId', branchid);
    formdata.append('company_id', companyid);
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/uploadExcelToDB_bulletdata`, formdata).pipe(map((responsedata)=>{
      return responsedata.response
    }))
  }


  get_brandmodel_forinventory() {
    let service = localStorage.getItem('service')
    var branchid = localStorage.getItem("loginbranchid");
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_brandmodel_forinventory?service=${service}&branchId=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))
  }


  postcustomer(jobcardobj,location){
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    let ShopuserId = localStorage.getItem('ShopuserId')

    return this.http.post<any>(`${environment.apiUrl}/shopusers/shopprofile/addshopprofile`, {company_id:companyid,branch_id:branchid,shopuserid:ShopuserId,name:jobcardobj.name,mobile:jobcardobj.mobile,address:location



    }).pipe(map((responsedata)=>{
      return responsedata.result
    }))
  }
  addvehicle(userID,jobcardobj,vh_number,selectedBrandName,selectedmodelname,vehiclenumber,color,selectedvehcileid,selectedModelpackage){

    console.log("the userid in the addvehcile",userID)
    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    let ShopuserId = localStorage.getItem('ShopuserId');

    let gs_selectedservice = JSON.stringify(selectedModelpackage)


    return this.http.post<any>(`${environment.apiUrl}/shopusers/shopaddvehicle/addshopvehicle_webapp`, {company_id:companyid,branch_id:branchid,shopuserid:ShopuserId,name:jobcardobj.name,mobile:jobcardobj.mobile,
      vh_number:vh_number,brand:selectedBrandName,bike:selectedmodelname,bikecolor:color,vehicleNumber:vehiclenumber,userID:userID,from:"webapp",_id:selectedvehcileid,gs_selectedservice:gs_selectedservice
    }).pipe(map((responsedata)=>{
      console.log("the data inside the localstore addvehicle",responsedata)
      console.log("the data inside the localstore addvehicle response",responsedata.response)
      return responsedata.response

    }))
  }

  checkvehicles(mobile){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    let ShopuserId = localStorage.getItem('ShopuserId')
    return this.http.get<any>(`${environment.apiUrl}/shopusers/addcomplaints/get_shopusers_jobcard?branch_ID=${branchid}&mobile=${mobile}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  addjobcard(vehicle_id,odometervalue,fuelAmount,genralservicecheck,selectedModelpackage,formattedComplaintsstringy,
    mobile,userid,remarks,gs_selected_option_index,gs_selected_amount,advisor){

      let branchid = localStorage.getItem("loginbranchid");
      let companyid = localStorage.getItem("logincompanyid")
      let ShopuserId = localStorage.getItem('ShopuserId')
      var servicetype = localStorage.getItem("service");
      var shopusername = localStorage.getItem("shopusername");

      let vehiclestatus = {
        number : "1",
        value : "VechicleIn"
      }

      let vehiclestatusstringy = JSON.stringify(vehiclestatus)
      let selectedModelpackagestringy = JSON.stringify(selectedModelpackage)

      return this.http.post<any>(`${environment.apiUrl}/shopusers/addcomplaints/addcomplaints_forwebapp`, {company_id:companyid,branch_id:branchid,ShopuserId:ShopuserId,mobile:mobile,userid:userid,odometerreading:odometervalue,
        vehicle_id:vehicle_id,leveloffuel:fuelAmount,genralservice:genralservicecheck,gs_selectedservice:selectedModelpackagestringy,complaintData:formattedComplaintsstringy,remarks:remarks,from:"webapp",gs_selected_option_index:gs_selected_option_index,selectedamount:gs_selected_amount,
        typeofservice:servicetype,shopusername:shopusername,vehiclestatus:vehiclestatusstringy,advisor:advisor

      }).pipe(map((responsedata)=>{
       
        return responsedata.response
  
      }))

  }

  getlocations(){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    let ShopuserId = localStorage.getItem('ShopuserId')
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getlocations?branch_id=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  get_templatebranchdata(){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    let ShopuserId = localStorage.getItem('ShopuserId')
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_templatebranchdata?branch_id=${branchid}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }

  GetAllTech(flag){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    let ShopuserId = localStorage.getItem('ShopuserId')
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/GetAllTech?branch_id=${branchid}&flag=${flag}`)
      .pipe(map(responsedata => {
        return responsedata
      }))

  }


  getjobcardpayment(jobcardid){

    return this.http.get<any>(`${environment.apiUrl}/shopusers/addcomplaints/getpayments2?jobcard_id=${jobcardid}`)
    .pipe(map(responsedata => {
      return responsedata
    }))



  }

  postpayments_new(jobcard_id,vehiclestatus,userid,vehicle_id,paymentobj,paymentreceived,mobile,balance_amount,isfinalpayment){

    let branchid = localStorage.getItem("loginbranchid");
    let companyid = localStorage.getItem("logincompanyid")
    let ShopuserId = localStorage.getItem('ShopuserId')
    var servicetype = localStorage.getItem("service");
    var shopusername = localStorage.getItem("shopusername");

    return this.http.post<any>(`${environment.apiUrl}/shopusers/addcomplaints/postpayments_new`, {company_id:companyid,branch_id:branchid,jobcard_id:jobcard_id,userid:userid,vehicle_id:vehicle_id,payment:paymentobj,
      total_payment_received:paymentreceived,mobile:mobile,balance_amount:balance_amount,shopusername:shopusername,shopuserid:ShopuserId,finalpay:isfinalpayment



    }).pipe(map((responsedata)=>{
      return responsedata.result
    }))



  }




  savetemplate(data: any) {
    const branchId = localStorage.getItem("loginbranchid");
    const companyId = localStorage.getItem("logincompanyid");
  
    const payload = {
      branch_id: branchId,
      company_id: companyId,
      templatesname: data.templatesname,
      spare: data
    };
  
    console.log("Data being sent to backend:", payload);
  
    return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/garagetemplates`, payload)
      .pipe(
        map((responseData) => {
          console.log("Backend template response:", responseData.response);
          return responseData.response;
        })
      );
  }
  
  
  
  gettemplate() {
    let companyid = localStorage.getItem("logincompanyid");
    let branchid = localStorage.getItem("loginbranchid");
    console.log("this is company id and branch id>>>>>>", companyid, branchid)
    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/getgaragetemplates?branch_id=${branchid}`).pipe(map((responsedata) => {
      console.log("this is gt template function data>>>>>>>", responsedata.response);
      return responsedata.response
    }))

  }


  shopappupdateqty_productinventory(spares_inventory,jobcard_id){

   let stringyfyspares = JSON.stringify(spares_inventory)


   return this.http.post<any>(`${environment.apiUrl}/superadmin/superadminauth/shopappupdateqty_productinventory`, {jobcard_id:jobcard_id,productdetails:stringyfyspares}).pipe(map((responsedata)=>{
    return responsedata.result
  }))

  }

  get_qty_inventory(productid){

    return this.http.get<any>(`${environment.apiUrl}/superadmin/superadminauth/get_qty_inventory?productid=${productid}`).pipe(map((responsedata) => {
      console.log("this is gt template function data>>>>>>>", responsedata.response);
      return responsedata.response
    }))

  }



  







  




  


  


}
