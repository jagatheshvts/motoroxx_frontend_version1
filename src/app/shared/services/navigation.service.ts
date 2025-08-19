import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
    id?: string;
    title?: string;
    description?: string;
    type: string;       // Possible values: link/dropDown/extLink
    name?: string;      // Used as display text for item and title for separator type
    state?: string;     // Router state
    icon?: string;      // Material icon name
    tooltip?: string;   // Tooltip text
    disabled?: boolean; // If true, item will not be appeared in sidenav.
    sub?: IChildItem[]; // Dropdown items
    badges?: IBadge[];
    active?: boolean;
}
export interface IChildItem {
    id?: string;
    parentId?: string;
    type?: string;
    name: string;       // Display text
    state?: string;     // Router state
    icon?: string;
    sub?: IChildItem[];
    active?: boolean;
}

interface IBadge {
    color: string;      // primary/accent/warn/hex color codes(#fff000)
    value: string;      // Display text
}

interface ISidebarState {
    sidenavOpen?: boolean;
    childnavOpen?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService implements OnInit {

    permission: any
    master: any
    company: any
    brandmodel: any
    supplier: any
    businessMenu: any
    jobcardpage: any
    reports: any
    transaction: any
    payment: any
    receipt: any
    expense: any
    subMenu: IMenuItem[] = [];
    creater_superadmin = localStorage.getItem('creater_superadmin');
     menu: IMenuItem[] = [];


    public sidebarState: ISidebarState = {
        sidenavOpen: true,
        childnavOpen: false
    };
    selectedItem: IMenuItem;
    public defaultMenu: IMenuItem[];
    constructor() {
        this.permission = JSON.parse(localStorage.getItem("permission"));

        this.master = this.permission.master
        this.company = this.permission.company
        this.brandmodel = this.permission.brandmodel
        this.supplier = this.permission.supplier
        this.businessMenu = this.permission.businessMenu
        this.jobcardpage = this.permission.jobcardpage
        this.reports = this.permission.reports
        this.transaction = this.permission.Transactionmenu
        this.payment = this.permission.payment
        this.receipt = this.permission.receipt
        this.expense = this.permission.expense


        this.menuItems.next(this.getDefaultMenu());

    }
    ngOnInit(): void {

    }

    private getDefaultMenu(): IMenuItem[] {
        const menu: IMenuItem[] = [
            {
                name: 'Dashboard',
                description: '',
                type: 'dropDown',
                icon: 'i-Bar-Chart',
                sub: this.creater_superadmin === 'true'
                    ? [
                        //   { icon: 'i-Home1', name: 'Home Page', state: '/dashboard/v1', type: 'link' },
                        { icon: 'i-Home1', name: 'Home Page', state: '/dashboard/cv5', type: 'link' }
                    ]
                    : [
                        { icon: 'i-Home1', name: 'Home Page', state: '/dashboard/v1', type: 'link' }
                    ]

            },
            ...(this.master ? [{
                // {   
                name: 'Master',
                description: '',
                type: 'dropDown',
                icon: 'i-Add-UserStar',
                sub: [
                    ...(this.company ? [
                        { icon: 'bi bi-building', name: 'Company', state: '/superadmin/companycreation', type: 'link' },] : []),
                    ...(this.brandmodel ? [
                        { icon: 'i-Motorcycle', name: 'Vehicle Brands', state: '/superadmin/brandmodelmaster', type: 'link' },] : []),
                    ...(this.supplier ? [
                        { icon: 'i-Business-Mens', name: 'Supplier', state: '/tables/supplier', type: 'link' },] : []),
                    ...(this.supplier ? [
                        { icon: 'i-Business-Mens', name: 'Templates', state: '/superadmin/templates', type: 'link' },] : []),
                        ...(this.supplier ? [
                            { icon: 'i-Business-Mens', name: 'Message Templates', state: '/superadmin/message-alerts-templates', type: 'link' },] : []),     
                ]
                // }
            }] : []),

            ...(this.jobcardpage ? [{
                // {
                name: 'Business',
                description: '',
                type: 'dropDown',
                icon: 'bi bi-briefcase',
                sub: [
                    { icon: 'bi bi-clipboard', name: 'jobcard', state: '/Business/jobcard', type: 'link' },
                    { icon: 'bi bi-file-text', name: 'Estimate/Invoice', state: '/Business', type: 'link' },

                ]
                // },

            }] : []),


            // {
            //     name: 'Inventory',
            //     description: '',
            //     type: 'dropDown',
            //     icon: 'bi bi-box',
            //     sub: [
            //         { icon: 'bi bi-box-seam', name: 'Product', state: '/expense/product-inventory', type: 'link' }

            //     ]
            // },
            
            ...(this.creater_superadmin !== 'true' ? [{
                name: 'Inventory',
                description: '',
                type: 'dropDown',
                icon: 'bi bi-box',
                sub: [
                    { icon: 'bi bi-box-seam', name: 'Product', state: '/expense/product-inventory', type: 'link' },
                    { icon: 'bi bi-file-earmark-spreadsheet', name: 'Inventory-Report', state: '/expense/inventory-report', type: 'link' }
                ]
            }] : []),











            ...(this.transaction ? [{
                name: 'Transaction',
                description: '',
                type: 'dropDown',
                icon: 'bi bi-wallet',
                sub: [
                    ...(this.receipt ? [
                        { icon: 'bi bi-arrow-down', name: 'Inward', state: '/transaction/receipt', type: 'link' },] : []),
                    ...(this.payment ? [
                        { icon: 'i-rupee', name: 'Payment', state: '/transaction/payments', type: 'link' },] : []),
                    ...(this.expense ? [
                        { icon: 'i-Financial', name: 'Expense', state: '/expense/expense', type: 'link' }] : []),
                ]
            }] : []),

            // ...(this.jobcardpage ? [{
            //     // {
            //     name: 'Business',
            //     description: '',
            //     type: 'dropDown',
            //     icon: 'i-Receipt-3',
            //     sub: [
            //         { icon: 'i-Receipt', name: 'jobcard', state: '/Business/jobcard', type: 'link' },
            //         { icon: 'i-Receipt', name: 'Estimate/Invoice', state: '/Business', type: 'link' },

            //     ]
            //     // },

            // }] : []),

            ...(this.reports ? [{
                // {
                name: 'Insights',
                description: '',
                type: 'dropDown',
                icon: 'i-Address-Book',
                sub: [
                    { icon: 'i-Bell', name: 'VI', state: '/uikits/VI', type: 'link' },
                    { icon: 'i-Billing', name: 'Estimate', state: '/uikits/Est', type: 'link' },
                    { icon: 'i-Receipt-3', name: 'Invoice', state: '/uikits/Inv', type: 'link' },
                    { icon: 'i-Receipt-3', name: 'Closed', state: '/uikits/Closed', type: 'link' },
                    { icon: 'i-Gear', name: 'Spare', state: '/uikits/Spare', type: 'link' },
                    // { icon: 'i-Line-Chart-2', name: 'Battery', state: '/uikits/Battery', type: 'link' },
                    { icon: 'i-Engineering', name: 'Tech', state: '/uikits/Tech', type: 'link' },
                    { icon: 'i-Engineering', name: 'All Tech', state: '/uikits/All-Tech', type: 'link' },
                    { icon: 'i-Duplicate-Window', name: 'GST', state: '/uikits/Gst', type: 'link' },
                    { icon: 'i-Speach-Bubble-3', name: 'WhatsApp Screen', state: '/uikits/Chatscreen', type: 'link' },
                    { icon: 'bi bi-file-earmark-text', name: 'HSN Report', state: '/uikits/HSN-Report', type: 'link' },
                    { icon: 'bi bi-search', name: 'HSN Search', state: '/uikits/hsn', type: 'link' },
                ]
                // },
            }] : []),


            {
                name: 'Sessions',
                description: '',
                type: 'dropDown',
                icon: 'i-Administrator',
                sub: [
                    // { icon: 'i-Add-User', name: 'Sign up', state: '/sessions/signup', type: 'link' },
                    { icon: 'i-Checked-User', name: 'Sign in', state: '/sessions/signin', type: 'link' },
                    // { icon: 'i-Find-User', name: 'Forgot', state: '/sessions/forgot', type: 'link' }
                ]
            },
        ];
        return menu;
    }



    // private getDefaultMenu(): IMenuItem[] {
    //     const menu: IMenuItem[] = [
    //         {
    //             name: 'Dashboard',
    //             description: '',
    //             type: 'dropDown',
    //             icon: 'i-Bar-Chart',
    //             sub: this.creater_superadmin === 'true'
    //                 ? [
    //                     { icon: 'i-Home1', name: 'Home Page', state: '/dashboard/cv5', type: 'link' }
    //                 ]
    //                 : [
    //                     { icon: 'i-Home1', name: 'Home Page', state: '/dashboard/v1', type: 'link' }
    //                 ]
    //         },
    //         ...(this.master ? [{
    //             name: 'Master',
    //             description: '',
    //             type: 'dropDown',
    //             icon: 'i-Add-UserStar',
    //             sub: [
    //                 ...(this.company ? [
    //                     { icon: 'bi bi-building', name: 'Company', state: '/superadmin/companycreation', type: 'link' },] : []),
    //                 ...(this.brandmodel ? [
    //                     { icon: 'i-Motorcycle', name: 'Vehicle Brands', state: '/superadmin/brandmodelmaster', type: 'link' },] : []),
    //                 ...(this.supplier ? [
    //                     { icon: 'i-Business-Mens', name: 'Supplier', state: '/tables/supplier', type: 'link' },] : []),
    //             ]
    //         }] : []),
    
    //         ...(this.jobcardpage ? [{
    //             name: 'Business',
    //             description: '',
    //             type: 'dropDown',
    //             icon: 'bi bi-briefcase',
    //             sub: [
    //                 { icon: 'bi bi-clipboard', name: 'jobcard', state: '/Business/jobcard', type: 'link' },
    //                 { icon: 'bi bi-file-text', name: 'Estimate/Invoice', state: '/Business', type: 'link' },
    //             ]
    //         }] : []),
    
    //         ...(this.creater_superadmin !== 'true' ? [{
    //             name: 'Inventory',
    //             description: '',
    //             type: 'dropDown',
    //             icon: 'bi bi-box',
    //             sub: [
    //                 { icon: 'bi bi-box-seam', name: 'Product', state: '/expense/product-inventory', type: 'link' }
    //             ]
    //         }] : []),
    
    //         ...(this.transaction ? [{
    //             name: 'Transaction',
    //             description: '',
    //             type: 'dropDown',
    //             icon: 'bi bi-wallet',
    //             sub: [
    //                 ...(this.receipt ? [
    //                     { icon: 'bi bi-arrow-down', name: 'Inward', state: '/transaction/receipt', type: 'link' },] : []),
    //                 ...(this.payment ? [
    //                     { icon: 'i-rupee', name: 'Payment', state: '/transaction/payments', type: 'link' },] : []),
    //                 ...(this.expense ? [
    //                     { icon: 'i-Financial', name: 'Expense', state: '/expense/expense', type: 'link' }] : []),
    //             ]
    //         }] : []),
    
    //         ...(this.reports ? [{
    //             name: 'Insights',
    //             description: '',
    //             type: 'dropDown',
    //             icon: 'i-Address-Book',
    //             sub: [
    //                 { icon: 'i-Bell', name: 'VI', state: '/uikits/VI', type: 'link' },
    //                 { icon: 'i-Billing', name: 'Estimate', state: '/uikits/Est', type: 'link' },
    //                 { icon: 'i-Receipt-3', name: 'Invoice', state: '/uikits/Inv', type: 'link' },
    //                 { icon: 'i-Gear', name: 'Spare', state: '/uikits/Spare', type: 'link' },
    //                 { icon: 'i-Engineering', name: 'Tech', state: '/uikits/Tech', type: 'link' },
    //                 { icon: 'i-Engineering', name: 'All Tech', state: '/uikits/All-Tech', type: 'link' },
    //                 { icon: 'i-Duplicate-Window', name: 'GST', state: '/uikits/Gst', type: 'link' },
    //                 { icon: 'i-Speach-Bubble-3', name: 'WhatsApp Screen', state: '/uikits/Chatscreen', type: 'link' },
    //             ]
    //         }] : []),
    
    //         {
    //             name: 'Sessions',
    //             description: '',
    //             type: 'dropDown',
    //             icon: 'i-Administrator',
    //             sub: [
    //                 { icon: 'i-Checked-User', name: 'Sign in', state: '/sessions/signin', type: 'link' },
    //             ]
    //         },
    //     ];
    //     return menu;
    // }
    





    menuItems = new BehaviorSubject<IMenuItem[]>([]);
    menuItems$ = this.menuItems.asObservable();
}
