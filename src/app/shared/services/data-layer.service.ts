import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import { Router } from "@angular/router";
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
@Injectable({
    providedIn: 'root'
})
export class DataLayerService {

    constructor(
        private http: HttpClient, private LocalStoreService: LocalStoreService
    ) { }


    getInvoices() {
        return this.http.get<any[]>('/api/invoices');
    }
    getInvoice(id) {
        return this.http.get<any[]>('/api/invoices/' + id);
    }
    saveInvoice(invoice) {
        if (invoice.id) {
            return this.http.put<any[]>('/api/invoices/' + invoice.id, invoice);
        } else {
            invoice.id = Utils.genId();
            return this.http.post<any[]>('/api/invoices/', invoice);
        }
    }
    deleteInvoice(id) {
        return this.http.delete<any[]>('/api/invoices/' + id);
    }
    getMails() {
        return this.http.get<any[]>('/api/mails');
    }
    getCountries() {
        return this.http.get<any[]>('/api/countries');
    }
    getProducts() {
        return this.http.get<any[]>('api/products');
    }

    getinventoryqty(data) {
        if (data.extra_spares.length > 0) {
            data.extra_spares.forEach(data => {
                if (data.id) {
                    this.invqtyapi(data.id,data)
                } else {
                    return data.inventoryqty = "NA"
                }
            })
        }
        if (data.all_spares.length > 0) {
            data.all_spares.forEach(data => {
                if (data.id) {
                    this.invqtyapi(data.id,data)
                } else {
                    return data.inventoryqty = "NA"
                }
            })
        }
        if (data.service_spares.length > 0) {
            data.service_spares.forEach(data => {
                if (data.id) {
                    this.invqtyapi(data.id,data)
                } else {
                    return data.inventoryqty = "NA"
                }
            })
        }
        if (data.all_labours.length > 0) {
            data.all_labours.forEach(data => {
                if (data.id) {
                    this.invqtyapi(data.id,data)
                } else {
                    return data.inventoryqty = "NA"
                }
            })
        }
        if (data.extra_labours.length > 0) {
            data.extra_labours.forEach(data => {
                if (data.id) {
                    this.invqtyapi(data.id,data)
                } else {
                    return data.inventoryqty = "NA"
                }
            })
        }
    }
    invqtyapi(id,data){
        this.LocalStoreService.get_qty_inventory(id).subscribe(invendata => {
            console.log("the data inside the data qty product", invendata.qty)
            return data.inventoryqty = invendata.qty
        })
    }
    getinventoryqty_esti(data){
        this.invqtyapi(data.id,data)

    }



    //savemultpleinvoice

   gstfalse_spares(data){

    var qty = parseFloat(data.qty) || 0.0;
    var rate = parseFloat(data.rate) || 0.0;
    data.amount = qty * rate;
    data.gst = "18%";
    data.gst18 = false,
    data.gst28 =false,
    data.percent = "0",
    data.taxablevalue = "0",
    data.rate_tax_value = "0",
    data.rate_without_gst="0";


    if(data.discount){
    let discount = parseFloat(data.discount) || 0.0
    let amount = parseFloat(data.amount) || 0.0
    let final = (amount * discount) / 100;
    let amountfinal = amount - final
    data.amount = amountfinal
    }
    data.payableamount = data.amount.toString(),
    data.spares_with_18 = "0",
    data.spares_with_28 = "0"
   

   }

   gsttrue_spares(data,gstcalculationspare){

    var qty = parseFloat(data.qty) || 0.0;
    var rate = parseFloat(data.rate) || 0.0;
    data.amount = qty * rate;

    if(data.discount !='0'){
    let discount = parseFloat(data.discount) || 0.0
    let amount = parseFloat(data.amount) || 0.0
    let final = (amount * discount) / 100;
    let amountfinal = amount - final
    data.amount = amountfinal
    }

    if(data.discount =='0' || !data.discount){
      data.discount = '0'
    }

    if (data.gst18 == true) {
      data.percent = "0.18";
      data.gst = "18%"
      data.gst18 = true;
      data.gst28 = false;
      if (gstcalculationspare == "true") {
        data.spares_with_18 = (data.amount * 0.18).toFixed(2);
        data.spares_with_28 = "0"
        data.taxablevalue = (data.amount * 0.18).toFixed(2);
        data.rate_tax_value = (data.amount * 0.18).toFixed(2);
        data.rate_without_gst = data.amount.toString();
        data.payableamount = data.amount.toString();
      } else {
        data.rate_tax_value =
          (data.amount * 100 / (100 + 18)).toFixed(2);
        data.spares_with_18 =
          (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
          data.spares_with_28 = "0"  
        data.rate_without_gst =
          (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
        data.taxablevalue =
          (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
        data.payableamount = (data.amount * 100 / (100 + 18)).toFixed(2);
      }

    
    } else if (data.gst28 = true) {
      data.percent = "0.28";
      data.gst = "28%";
      data.gst18 = false;
      data.gst28 = true;
      if (gstcalculationspare == "true") {
        data.spares_with_28 = (data.amount * 0.28).toFixed(2);
        data.spares_with_18 = "0"
        data.taxablevalue = (data.amount * 0.28).toFixed(2);
        data.rate_tax_value = (data.amount * 0.28).toFixed(2);
        data.rate_without_gst = data.amount.toString();
        data.payableamount = data.amount.toString();
      } else {
        data.rate_tax_value =
          (data.amount * 100 / (100 + 28)).toFixed(2);
        data.spares_with_28 =
          (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
          data.spares_with_18 = "0"  
        data.rate_without_gst =
          (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
        data.taxablevalue =
          (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
        data.payableamount = (data.amount * 100 / (100 + 28)).toFixed(2);
      }

    }
   }

   gstfalse_labours(data){

    var qty = parseFloat(data.qty) || 0.0;
    var rate = parseFloat(data.rate) || 0.0;
    data.amount = qty * rate;
      if(data.discount != '0'){
      let discount = parseFloat(data.discount) || 0.0
      let amount = parseFloat(data.amount) || 0.0
      let final = (amount * discount) / 100
      let amountfinal = amount - final
      data.amount = amountfinal
      }

      if(data.discount =='0' || !data.discount){
        data.discount = '0'
      }
    data.gst = "18%";
    data.gst18 = false,
    data.gst28 =false,
    data.percent = "0",
    data.taxablevalue = "0",
    data.rate_tax_value = "0",
    data.rate_without_gst="0",
    data.payableamount = data.amount.toString(),
    data.labour_with_18 = "0",
    data.labour_with_28 = "0";
 
   }

   gsttrue_labours(data,gstcalculationlab){
    
    var qty = parseFloat(data.qty) || 0.0;
    var rate = parseFloat(data.rate) || 0.0;
    data.percent = "0.18";
    data.amount = qty * rate;
   
    if(data.discount != '0'){
      let discount = parseFloat(data.discount) || 0.0
    let amount = parseFloat(data.amount) || 0.0
    let final = (amount * discount) / 100
    let amountfinal = amount - final
    data.amount = amountfinal
   
    }
    if(data.discount =='0' || !data.discount){
      data.discount = '0'
    }
    

    var amount2 = parseFloat(data.amount);
    data.gst18 = true;
    data.gst28 = false;
    if (gstcalculationlab == "true") {
      data.labour_with_18 = (amount2 * 0.18).toFixed(2);
      data.labour_with_28 = "0";
      data.taxablevalue = (amount2 * 0.18).toFixed(2);
      data.rate_tax_value = (amount2 * 0.18).toFixed(2);
      data.rate_without_gst = amount2.toString();
      data.payableamount = amount2.toString();
    } else {
      data.rate_tax_value = (amount2 * 100 / (100 + 18)).toFixed(2);
      data.labour_with_18 =
        (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
        data.labour_with_28 = "0";  
      data.rate_without_gst =
        (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
      data.taxablevalue =
        (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
      data.payableamount = (amount2 * 100 / (100 + 18)).toFixed(2);
    }
  
   
   }
}



  
