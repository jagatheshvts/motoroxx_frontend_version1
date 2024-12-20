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

        // if()
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
}
