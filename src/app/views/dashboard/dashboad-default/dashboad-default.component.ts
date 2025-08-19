import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EChartsOption } from 'echarts';
import { catchError, of } from 'rxjs';
// import { echartStyles } from '../../../shared/echart-styles';

@Component({
  selector: 'app-dashboad-default',
  templateUrl: './dashboad-default.component.html',
  styleUrls: ['./dashboad-default.component.css'],
  providers: [DatePipe]
})
export class DashboadDefaultComponent implements OnInit {

  countChartBar: EChartsOption;
  salesChartPie: EChartsOption;
  salesChartBar: EChartsOption;
  selectedDate: Date = new Date();
  vehicle: any;
  estimatedvehicle: any
  estimatetotal: any
  invoicedvehicle: any
  invoicetotal: any
  loginbranchid: any
  logincompanyid: any
  salesData: any[];
  lastThreeMonthsCountData: any[];
  lastthreemonthSalesData: any[];


  constructor(private adminservice: LocalStoreService, private datePipe: DatePipe, private modalService: NgbModal) {

  }


  ngOnInit() {

    
    this.loginbranchid = localStorage.getItem("loginbranchid"),
      this.logincompanyid = localStorage.getItem("logincompanyid")
    console.log("the data inside the maonpage logindata", this.loginbranchid)
    this.initializepieCharts();
    this.initializecountBarGraph();
    this.initializeSaleData();
    this.fetchSalesData();
    this.fetchthreemonthsSalesData();
    this.fetchcountBarGraphData();
    this.todaysdata()
  }
  todaysdata() {

    const todaysdate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

    this.adminservice.getvehicle_based_on_date(todaysdate, this.loginbranchid).subscribe(data => {
      this.vehicle = data.response.length
      console.log("the data og length of the vehicle", this.vehicle)

    })

    let total_estimateamount = 0;
    this.adminservice.getestimate_based_on_date(todaysdate, this.loginbranchid).subscribe(data => {

      this.estimatedvehicle = 0

      data.response.forEach(estimatedjobcards => {

        // if(estimatedjobcards.estimate && !estimatedjobcards.invoice){
        if (estimatedjobcards.status.number == "2") {

          this.estimatedvehicle++

          total_estimateamount += parseFloat(estimatedjobcards.estimate.estimate_amount)
        }
      })
      this.estimatetotal = total_estimateamount

      console.log("the data of estimeated vehicle length", this.estimatedvehicle)
      console.log("the data of estimeated  total amount", this.estimatetotal)
    })

    let total_invoiceamount = 0;
    this.adminservice.getinvoice_based_on_date(todaysdate, this.loginbranchid).subscribe(data => {

      data.response.forEach(invoicejobcards => {

        this.invoicedvehicle = 0


        if (invoicejobcards.status.number == "7") {

          this.invoicedvehicle = data.response.length

          total_invoiceamount += parseFloat(invoicejobcards.invoice.invoice_amount)


        }
        // total_invoiceamount += parseFloat(
        //   (invoicejobcards.invoice.invoice_amount - invoicejobcards.invoice.fullspares_with_18_total - invoicejobcards.invoice.fullspares_with_28_total -
        //     invoicejobcards.invoice.fulllabours_with_18_total - invoicejobcards.invoice.fulllabours_with_28_total).toString()
        // );
      })
      this.invoicetotal = total_invoiceamount.toFixed(2)
    })

  }

  onDateChange(event: any) {
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    
    this.adminservice.getvehicle_based_on_date(formattedDate, this.loginbranchid).subscribe(data => {
      this.vehicle = data.response.length;
    });
  
    let total_estimateamount = 0;
    this.adminservice.getestimate_based_on_date(formattedDate, this.loginbranchid).subscribe(data => {
      this.estimatedvehicle = 0;
      data.response.forEach(estimatedjobcards => {
        if (estimatedjobcards.estimate && !estimatedjobcards.invoice) {
          this.estimatedvehicle++;
          total_estimateamount += parseFloat(estimatedjobcards.estimate.estimate_amount);
        }
      });
      this.estimatetotal = total_estimateamount;
    });
  
    let total_invoiceamount = 0;
    this.adminservice.getinvoice_based_on_date(formattedDate, this.loginbranchid).subscribe(data => {
      this.invoicedvehicle = 0;
      data.response.forEach(invoicejobcards => {
        if (invoicejobcards.status.number === "7") {
          this.invoicedvehicle++;
          total_invoiceamount += parseFloat(invoicejobcards.invoice.invoice_amount);
        }
      });
      this.invoicetotal = total_invoiceamount.toFixed(2);
    });
  }
  
  fetchSalesData() {
    const currentDate = new Date().toISOString().split('T')[0];
    this.adminservice.averageData_lastTwoMonths(currentDate, this.loginbranchid).pipe(catchError(
      error => {
        console.log("error fetching data", error);
        return of([]);
      }
    )).subscribe(salesData => {
      this.salesData = salesData;
      this.updateCharts();
      console.log("sales average 2 months Data>>>>>>>>>>>>>>>>>>>>>>", salesData)
    })

  }
  updateCharts() {

    const totalData = this.totalData(this.salesData);
    const averageData = this.calculateAverageData(this.salesData, totalData);
    this.salesChartPie = {
      ...this.salesChartPie, // Retain existing options
      series: [{
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: averageData.map(row => ({
          value: row[1],
          name: row[0]
        })),
      }]
    };
  }
  initializepieCharts() {
    this.salesChartPie = {
      color: ['#4551cc', '#6f7aff'],
      tooltip: {
        trigger: 'item',  // Show tooltip when hovering over an item
        formatter: function (params: any) {
          // 'params' contains information about the hovered data point
          const value = parseFloat(params.value).toFixed(2);  // Round value to 2 decimals
          const percentage = parseFloat(params.percent).toFixed(2);  // Round percentage to 2 decimals
          return `${params.seriesName} <br/>${params.name}: ${value} (${percentage}%)`;
        }
      },
      series: [{
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: [],// Will be populated with real data
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'  // Highlight effect when hovering over a pie slice
          }
        }
      }]
    };
  }

  fetchcountBarGraphData() {
    const currentDate = new Date().toISOString().split('T')[0];
    this.adminservice.vehicleData_lastThreeMonths(currentDate, this.loginbranchid).pipe(catchError(error => {
      console.log("error occured", error);
      return of([]);
    })).subscribe(lastThreemonthData => {
      this.lastThreeMonthsCountData = lastThreemonthData;
      this.updatecountBarCharts();
      console.log("Vehicle 3 months Data>>>>>>>>>>>>>>>>>>>>>>", lastThreemonthData)
    })
  }
  updatecountBarCharts() {
    const threemonthdata = this.totalCountData(this.lastThreeMonthsCountData);
    this.countChartBar = {
      ...this.countChartBar, // Retain existing options
      xAxis: [{
        type: 'category',
        data: threemonthdata.map(row => row[0]),
      }],
      series: [{
        name: 'Vehicle count',
        data: threemonthdata.map(row => row[1]),
        type: 'bar',
        color: '#9b9eff'
      }]
    };
  }
  initializecountBarGraph() {
    this.countChartBar = {
      legend: {
        data: ['Vehicle Count']
      },
      xAxis: [{
        type: 'category',
        data: [],
      }],
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        },
        name: 'Count',
        nameLocation: 'middle',
        nameGap: 25
      }],
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const value = params[0].value;
          return `${value.toLocaleString('en-IN')}`;
        }
      },
      series: [{
        name: 'Vehicle Count',
        data: [],
        type: 'bar',
        color: '#bcbbdd'
      }]
    };
  }



  totalData(salesData: any): { [key: string]: number } {
    const monthlyEntries: { [key: string]: number } = {};
    salesData.forEach((report: any) => {
      const date = new Date(report.createddate);
      const monthYear = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
      if (!monthlyEntries[monthYear]) {
        monthlyEntries[monthYear] = 0;
      }
      monthlyEntries[monthYear]++;
    });
    return monthlyEntries;
  }

  calculateAverageData(salesData: any[], totalData: { [key: string]: number }): [string, number][] {
    const monthlyTotals: { [key: string]: number } = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    salesData.forEach((sale: any) => {
      const date = new Date(sale.createddate);
      const monthYear = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
      const invoiceAmount = parseFloat(sale.invoice?.invoice_amount ?? '0');
      const estimateAmount = parseFloat(sale.estimate?.estimate_amount ?? '0');
      const totalAmount = invoiceAmount || estimateAmount;

      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = 0;
      }

      monthlyTotals[monthYear] += totalAmount;
    });

    const formattedData: [string, number][] = [];

    const sortedMonthYears = Object.keys(monthlyTotals).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearA - yearB || monthA - monthB;
    });

    sortedMonthYears.forEach(monthYear => {
      const [year, month] = monthYear.split('-').map(Number);
      const monthName = this.getMonthName(month);

      if (this.isMonthCompleted(monthYear, currentYear, currentMonth)) {
        const averageAmount = monthlyTotals[monthYear] / (totalData[monthYear] || 1);
        formattedData.push([`${monthName} ${year}`, averageAmount]);
      }
    });

    return formattedData;
  }
  isMonthCompleted(monthYear: string, currentYear: number, currentMonth: number): boolean {
    const [year, month] = monthYear.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const currentDay = new Date().getDate();
    return year < currentYear || (year === currentYear && month < currentMonth) || (year === currentYear && month === currentMonth && currentDay === lastDayOfMonth);
  }

  totalCountData(salesData: any): [string, number][] {
    const monthlyTotals: { [key: string]: number } = {};

    salesData.forEach((report: any) => {
      const date = new Date(report.createddate);
      const monthYear = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;

      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = 0;
      }
      monthlyTotals[monthYear]++;
    });

    const formattedData: [string, number][] = [];
    const currentMonthYear = `${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}`;

    const sortedMonthYears = Object.keys(monthlyTotals).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearA - yearB || monthA - monthB;
    });

    sortedMonthYears.forEach(monthYear => {
      const [year, month] = monthYear.split('-').map(Number);
      const monthName = this.getMonthName(month);
      formattedData.push([`${monthName} ${year}`, monthlyTotals[monthYear]]);
    });
    console.log("this is formatted data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", formattedData);
    return formattedData;
  }

  isMonthCompletedVehicleCount(monthYear: string): boolean {
    const [year, month] = monthYear.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const currentDay = new Date().getDate();

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return year < currentYear || (year === currentYear && month < currentMonth) || (year === currentYear && month === currentMonth && currentDay >= lastDayOfMonth);
  }
  getMonthName(monthNumber: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthNumber - 1] || 'Unknown';
  }

  fetchthreemonthsSalesData() {
    const currentDate = new Date().toISOString().split('T')[0];
    this.adminservice.last_threeMonths_data(currentDate, this.loginbranchid).pipe(catchError(error => {
      console.log("error occured on fetching data", error);
      return of([]);
    })).subscribe(threemonthSalesData => {
      this.lastthreemonthSalesData = threemonthSalesData;
      this.updatesaleBarChart();
      console.log("total 3 months sales  data", threemonthSalesData)
    })
  }
  updatesaleBarChart() {
    const threemonthsalesData = this.formatSalesData(this.lastthreemonthSalesData);
    console.log(threemonthsalesData, ">>>>>>>>>>>>>>>>>>>>>>>>")
    this.salesChartBar = {
      ...this.salesChartBar,
      xAxis: [{
        type: 'category',
        data: threemonthsalesData.map(row => row[0]), // Month labels
        axisLabel: {
            interval: 0,
            rotate: 45,
        }
    }],
    series: [{
      name: 'Sales',
      data: threemonthsalesData.map(row => row[1]), // Sales data
      type: 'line',
      smooth: true,  
      lineStyle: {
          color: '#5864ff'
      },
      areaStyle: {
        color: 'rgba(88, 100, 255, 0.2)'  
      }
  }]
  
    }
  }
  initializeSaleData() {
    this.salesChartBar = {
      legend: {
        data: ['last 3 months sale']
      },
      xAxis: [{
        type: 'category',
        data: [],
      }],
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      }],
      tooltip: {  
        trigger: 'axis',
        formatter: function (params: any) {
          const value = params[0].value;
          return `${value.toLocaleString('en-IN')}`;
        }
      },
      // series: [{
      //   name: 'last 3 months sale',
      //   data: [],
      //   type: 'bar',
      //   color: '#bcbbdd',
      //   barCategoryGap: '10%'
      // }]
    }
  }

  formatSalesData(salesData: any): [string, number][] {
    const monthlyTotals: { [key: string]: number } = {};

    salesData.forEach((sale: any) => {
      const date = new Date(sale.createddate);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

      const invoiceAmount = parseFloat(sale.invoice?.invoice_amount) || 0;
      // console.log("this is invoice amount>>>>>>>>.", invoiceAmount, date);
      const estimateAmount = parseFloat(sale.estimate?.estimate_amount) || 0;
      // console.log("this is estimate amount>>>>>>>>.", estimateAmount, date);
      const totalAmount = invoiceAmount === 0 ? estimateAmount : invoiceAmount;
      // console.log("this is total amount>>>>>>>>.", totalAmount, date);


      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = 0;
      }
      monthlyTotals[monthYear] += totalAmount;
    });

    const formattedData: [string, number][] = [];
    const currentMonthYear = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

    // Sort monthYear keys in chronological order
    const sortedMonthYears = Object.keys(monthlyTotals).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearA - yearB || monthA - monthB;
    });

    sortedMonthYears.forEach(monthYear => {
      if (monthYear !== currentMonthYear || this.isMonthsaleCompleted(monthYear)) {
        const [year, month] = monthYear.split('-').map(Number);
        const monthName = this.getMonthName(month);
        formattedData.push([`${monthName} ${year}`, monthlyTotals[monthYear]]);
      }
    });

    return formattedData;
  }
  isMonthsaleCompleted(monthYear: string): boolean {
    const [year, month] = monthYear.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const currentDay = new Date().getDate();

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return year < currentYear || (year === currentYear && month < currentMonth);
  }


}

