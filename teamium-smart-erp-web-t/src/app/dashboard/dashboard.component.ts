import { Component, OnInit,NgZone } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../core/services/data.service';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpService } from '../core/services/http.service';
import { Chart } from 'angular-highcharts';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { moment } from 'fullcalendar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  chart:any;
  pieChart:any;
  showDataModal:boolean=false;
  projectPieCharData:any;
  formatedProjectPieCharData:any;  
  formatedProjectPieCharDataWithStatus:any;
  actualPieCharData:any;
  formatedActualPieCharData:any;
  formatedActualPieCharDataWithStatus:any;
  projectModalData:any={};
  sheetData:any;

  // revenue data variables
  showRevenueModal:boolean=false;
  revenueData:any;
  revenueModalData:any;


  // business function data variables
  showBusinessFunctionModal:boolean=false;
  businessFunctionChart:any;
  businessFunctionChartData:any;
  businessFunctionModalData:any;


  


  // budgeting modal
  budgetingModalData:any;
  showBudgetingModal:any;

  //ActaulVsBudget
  showActualBudgetModal:any;
  actualBudgetModalData:any;
  actualData:any;
  budetingData:any;

  //EQUIPMENT 
  showResourceModal:boolean = false;
  resourceModalData:any={};
  equipmentChartData:any;
  equipmentFunctionChart:any;
  formatedFunctionChartData:any;

  //Personnel
  staffChartData:any;
  staffFunctionChart:any;
  formatedStaffChartData:any;

  blockedPanel: boolean = false;

  //Booking Conflit
  bookingConflitList:any;
  showBookingConflictModal:boolean=false;
  
  dateForm:FormGroup;
  minDate;
  maxDate;
  timePeriod;
  public defaultDate:Date=new Date();
  timeArr=[];
  constructor(private router: Router, private dataService: DataService, 
    private route: Router,private formBuilder:FormBuilder,
    private httpService: HttpService,private toastr: ToastrService,private zone: NgZone) {
  }

  

  ngOnInit() {
    this.timeArr.push(this.defaultDate)
    this.minDate=new Date()
        this.minDate.setDate(1)
        this.maxDate = new Date(this.minDate.getFullYear(),this.defaultDate.getMonth());
        this.maxDate.setDate(this.getDaysInMonth(this.defaultDate.getMonth()+1,this.minDate.getFullYear()));
        this.maxDate.setMonth(this.defaultDate.getMonth());
        this.minDate.setMonth(this.defaultDate.getMonth());
    this.dateForm=this.createDateForm();
    this.zone.runOutsideAngular(()=>{
      this.dateForm.get('month').valueChanges.subscribe(value=>{
        console.log(value);
        if(value=='selectMonth'){
          let now=new Date();
          this.timeArr=[];
          this.timeArr.push(now);
          this.dateForm.get('from').setValue(null);
          this.dateForm.get('to').setValue(null);
          this.minDate=null;
          this.maxDate=null;
          return;
        }  
        this.zone.run(() => {
          this.defaultDate.setMonth(value-1);
          this.timeArr.push(this.defaultDate);
      });
        this.minDate=new Date()
        this.minDate.setDate(1)
        this.maxDate = new Date(this.minDate.getFullYear(),value-1);
        this.maxDate.setDate(this.getDaysInMonth(value,this.minDate.getFullYear()));
        this.maxDate.setMonth(value-1);
        this.minDate.setMonth(value-1);
        this.dateForm.get('from').setValue(this.minDate);
        this.dateForm.get('to').setValue(this.maxDate);
      })
    })
   
    this.dataService.checkSubmenu(this.router);
    if (this.dataService.isUserFirstTimeLogIn()) {
      this.httpService.callApi('changestatus', {}).subscribe(responce => {
      }, error => {
      });
    }
    this.getApiData();
    this.compareFromAndToDate();
    this.openBusinessFunctionModal();
  }
 getDaysInMonth(month,year) {
   return new Date(year, month, 0).getDate();
  };
  createDateForm() : FormGroup{
    return this.formBuilder.group({
      month:[this.defaultDate.getMonth()+1],
      from:[new Date(this.defaultDate.getFullYear(),this.defaultDate.getMonth(),1)],
      to:[new Date(this.defaultDate.getFullYear(),this.defaultDate.getMonth(),this.getDaysInMonth(this.defaultDate.getMonth()+1,this.defaultDate.getFullYear()))]
    })
  }
  compareFromAndToDate(){
    let from=new Date();
    let to=new Date();
    this.dateForm.get('from').valueChanges.subscribe(value=>{
      if(value!=null)
        from=value;
      if(from){
        if(from.getFullYear()==to.getFullYear() && from.getMonth()==to.getFullYear())
        if(from.getDate()>to.getDate() || from.getFullYear()>to.getFullYear() || from.getMonth()>to.getMonth())
          this.toastr.warning("'To' should be greater",'Dashboard');
      }
      
    }) 
    this.dateForm.get('to').valueChanges.subscribe(value=>{
      if(value!=null)
        to=value;
      if(to){
        if(to.getFullYear()==from.getFullYear() && to.getMonth()==from.getMonth())
        if(to.getDate()<from.getDate() || to.getFullYear()<from.getFullYear() || to.getMonth()<from.getMonth())
        this.toastr.warning("'To' should be greater",'Dashboard');
      }
      
    })
   
  }
  applyDate(){
    this.timePeriod=new HttpParams()
    .set('start',moment(this.dateForm.get("from").value).tz("Asia/Calcutta").format("YYYY-MM-DD"))
    .set('end',moment(this.dateForm.get("to").value).tz("Asia/Calcutta").format("YYYY-MM-DD"));
    let staffFunction = "?functionType=StaffFunction";
    let equipmentFunction = "?functionType=EquipmentFunction";
    let projectPieCharDataApi = this.httpService.callApi('getProjectVolumeCharData', {params:this.timePeriod});
    let projectRevenueDataApi = this.httpService.callApi('getProjectRevenueData',{params:this.timePeriod});
    let dashboadActualComparison = this.httpService.callApi('dashboadActualComparison',{params:this.timePeriod});
    let actualDataApi = this.httpService.callApi('dashboadActualDataApi',{params:this.timePeriod});
    let budgetingDataApi = this.httpService.callApi('dashboadBudgetDataApi',{params:this.timePeriod});
    let businessFunctionChartDataApi =  this.httpService.callApi('getBusinessFunctionCharData',{params:this.timePeriod});
    let equipmentChartDataApi =  this.httpService.callApi('getFunctionUses',{pathVariable:equipmentFunction,params:this.timePeriod});
    let personnelChartDataApi =  this.httpService.callApi('getFunctionUses',{pathVariable:staffFunction,params:this.timePeriod});
    let bookingConflictDataApi = this.httpService.callApi('getBookingConflictData',{params:this.timePeriod});

    this.blockedPanel = true;
    forkJoin([projectPieCharDataApi, projectRevenueDataApi, dashboadActualComparison, actualDataApi, budgetingDataApi,businessFunctionChartDataApi, equipmentChartDataApi, personnelChartDataApi,bookingConflictDataApi]).subscribe(resultList => {
      this.blockedPanel = false;
      this.projectPieCharData = resultList[0] || {};      
      this.revenueData =  resultList[1] || {};
      this.actualPieCharData = resultList[2] || {};
      this.actualData = resultList[3] || {};
      this.budetingData = resultList[4] || {};
      this.businessFunctionChartData = resultList[5] || {};
      this.equipmentChartData = resultList[6] || {};
      this.staffChartData = resultList[7] || {};
      this.bookingConflitList = resultList[8] || {};
      this.createProjectChart();
      this.createActualOrBudgetChart();
      this.createBusinessFunctionChart();
      this.createEquipmentFunctionChart();
      this.createStaffFunctionChart();
    }, (errorList) => {
      this.blockedPanel = false;
      console.log('Error[0] ', errorList[0]);
    });

  }
  reset(){
    this.dateForm.get('month').setValue(null);
    let now=new Date();
          this.timeArr=[];
          this.timeArr.push(now);
          this.dateForm.get('month').setValue(now.getMonth()+1)
          this.dateForm.get('from').setValue(new Date(now.getFullYear(),now.getMonth(),1));
          this.dateForm.get('to').setValue(new Date(now.getFullYear(),now.getMonth(),this.getDaysInMonth(now.getMonth()+1,now.getFullYear())));
    this.getApiData();
  }
  getApiData=()=>{    
    let staffFunction = "?functionType=StaffFunction";
    let equipmentFunction = "?functionType=EquipmentFunction";
    let projectPieCharDataApi = this.httpService.callApi('getProjectVolumeCharData', {});
    let projectRevenueDataApi = this.httpService.callApi('getProjectRevenueData',{});
    let dashboadActualComparison = this.httpService.callApi('dashboadActualComparison',{});
    let actualDataApi = this.httpService.callApi('dashboadActualDataApi',{});
    let budgetingDataApi = this.httpService.callApi('dashboadBudgetDataApi',{});
    let businessFunctionChartDataApi =  this.httpService.callApi('getBusinessFunctionCharData',{});
    let equipmentChartDataApi =  this.httpService.callApi('getFunctionUses',{pathVariable:equipmentFunction});
    let personnelChartDataApi =  this.httpService.callApi('getFunctionUses',{pathVariable:staffFunction});
    let bookingConflictDataApi = this.httpService.callApi('getBookingConflictData',{});

    this.blockedPanel = true;
    forkJoin([projectPieCharDataApi, projectRevenueDataApi, dashboadActualComparison, actualDataApi, budgetingDataApi,businessFunctionChartDataApi, equipmentChartDataApi, personnelChartDataApi,bookingConflictDataApi]).subscribe(resultList => {
      this.blockedPanel = false;
      this.projectPieCharData = resultList[0] || {};      
      this.revenueData =  resultList[1] || {};
      this.actualPieCharData = resultList[2] || {};
      this.actualData = resultList[3] || {};
      this.budetingData = resultList[4] || {};
      this.businessFunctionChartData = resultList[5] || {};
      this.equipmentChartData = resultList[6] || {};
      this.staffChartData = resultList[7] || {};
      this.bookingConflitList = resultList[8] || {};
      this.createProjectChart();
      this.createActualOrBudgetChart();
      this.createBusinessFunctionChart();
      this.createEquipmentFunctionChart();
      this.createStaffFunctionChart();
    }, (errorList) => {
      this.blockedPanel = false;
      console.log('Error[0] ', errorList[0]);
    });
  }

  createProjectChart=()=>{
    try{
      this.formatedProjectPieCharData=[];
      this.formatedProjectPieCharDataWithStatus={};
      let colorMap={
        'To Do':'#00a4d7',
        'In Progress':'#f6c100',
        'Done':'#6ebb47'
      }
      this.projectPieCharData.forEach(project => {
        let obj={
          name: project.status,
          y: project.count,
          color:colorMap[project.status]
        }
        this.formatedProjectPieCharData.push(obj)
        this.formatedProjectPieCharDataWithStatus[project.status]=obj;
      });
      
      let data = this.formatedProjectPieCharData.filter(function(d) {return d['y'] > 0})
      // this.formatedProjectPieCharData= this.formatedProjectPieCharData.filter(function(d) {return d['y'] > 0})
      this.chart = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
      },
      title: {
          text: null,
          align: 'center',
          verticalAlign: 'middle',
          y: 40
      },
      tooltip: {
        formatter: function() {
          return this.point.name +'<br/><h1>'+ this.point.y +'</h1>';
      },
          // pointFormat: '<h1>{point.y}</h1>',
          style: {
            fontSize:"15px"
          },
      },
      plotOptions: {
        series: {
          states: {
              hover: {
                  enabled: false
              }
          }
        },
          pie: {
              dataLabels: {
                  enabled: false,
                  distance: -50,
                  style: {
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize:"15px",
                      textOutline: '0'
                  }
              },
              startAngle: 0,
              endAngle: 360,
              center: ['50%', '50%'],
              size: '110%',
              events: {
                click:(evt:any)=>{
                  this.showModal(evt.point.name)
                },
              },
          },
          
          
      },
      credits: {
        enabled: false
      },
      series: [{
          type: 'pie',
          innerSize: '50%',
          data: data
      }]
      });
    }
    catch(err){
      console.log(err);
    }
  
  //   [
            
  //     {
  //       name: 'To Do',
  //       y: 50,
  //       color:'#00a4d7'
        
  //     },
  //     {
  //       name: 'In Progress',
  //       y: 25,
  //       color:'#f6c100'
  //     },
  //     {
  //       name: 'Done',
  //       y: 25,
  //       color:'#6ebb47'
  //     }
      
  // ]
  }


  createBusinessFunctionChart=()=>{

    let categories = Object.keys(this.businessFunctionChartData) || [];
    let dataArray=[];
    for(let key in this.businessFunctionChartData){
      let obj={
        name:key,
        y:this.businessFunctionChartData[key]
      }
      dataArray.push(obj);
    }
    this.businessFunctionChart=new Chart({
      chart: {
          type: 'column'
      },
      title: {
        text: ''
      },

      xAxis: {
        allowDecimals: false,
        title: {
          text: 'Function',
          y:-12,
          x:-40
          
      },
      
          categories: categories //['Production/Camera', 'Production/Camera', 'Production/Camera', 'Production/Camera', 'Production/Camera']
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: 'Day',
              
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.point.name + '</b><br/>' + this.point.y 
          }
      },
      plotOptions: {
        column: {
            showInLegend: false
        }
      },
      
      series: [{
        name:"abc",
        data:dataArray||[]
      }],
      credits: {
        enabled: false
      }
    })
  }

  createStaffFunctionChart=()=>{
    this.formatedStaffChartData={};

    let widgetData={
      "Freelance": this.staffChartData["totalExternalUsesCount"],
      "Internal Staff": this.staffChartData["totalInternalUsesCount"],
      "Headcount": this.staffChartData['totalInventoryCount']
    };

    let percentData={
      "Freelance": this.staffChartData["totalExternalUsesCountPercent"],
      "Internal Staff": this.staffChartData["totalInternalUsesCountPercent"],
      "Headcount": this.staffChartData['totalInventoryCount']
    };

    console.log(percentData)
    console.log(widgetData)

    let categories = Object.keys(widgetData) || [];

    let colorMap = {
      "Freelance":"#99e7fe",
      "Internal Staff":"#4eb0f9",
      "Headcount":"#5ebecc"
    }
    
    let dataArray=[];
    for(let key in widgetData){
      let obj={
        name:key,
        y:widgetData[key],
        color:colorMap[key]
      }
      dataArray.push(obj);
    }
    for(let key in percentData){
      let obj={
        name:key,
        y:percentData[key],
        color:colorMap[key]
      }
      this.formatedStaffChartData[key] = obj;
    }
      
    console.log(this.formatedStaffChartData)
    this.staffFunctionChart=new Chart({
      chart: {
          type: 'column'
      },
      title: {
        text: ''
      },

      xAxis: {
        labels:{enabled:false}
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: 'Day'
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.point.name + '</b><br/>' + this.point.y 
          }
      },
      plotOptions: {
        column: {
            showInLegend: false
        }
      },
      
      series: [{
        name:"abc",
        data:dataArray||[]
      }],
      credits: {
        enabled: false
      }
    })
  }

  createEquipmentFunctionChart=()=>{
    this.formatedFunctionChartData={};
    let widgetData={
      "External Use": this.equipmentChartData["totalExternalUsesCount"],
      "Internal Use": this.equipmentChartData["totalInternalUsesCount"],
      "Internal Inventory": this.equipmentChartData['totalInventoryCount']
    }; 
    
    let percentData={
      "External Use": this.equipmentChartData["totalExternalUsesCountPercent"],
      "Internal Use": this.equipmentChartData["totalInternalUsesCountPercent"],
      "Internal Inventory": this.equipmentChartData['totalInventoryCount']
    }; 

    let categories = Object.keys(widgetData) || []

    let colorMap = {
      "External Use":"#55dae1",
      "Internal Use":"#7b72e9",
      "Internal Inventory":"#8fc56d"
    }
    
    let dataArray=[];
    for(let key in widgetData){
        let obj={
          name:key,
          y:widgetData[key],
          color:colorMap[key]
        }
        dataArray.push(obj); 

    }

    for(let key in percentData){
      let obj={
        name:key,
        y:percentData[key],
        color:colorMap[key]
      }
      this.formatedFunctionChartData[key] = obj;  

    }
    this.equipmentFunctionChart=new Chart({
      chart: {
          type: 'column'
      },
      title: {
        text: ''
      },

      xAxis: {
          labels:{enabled:false}
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: 'Day'
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.point.name + '</b><br/>' + this.point.y 
          }
      },
      plotOptions: {
        column: {
            showInLegend: false
        }
      },
      
      series: [{
        name:"abc",
        data:dataArray||[]
      }],
      credits: {
        enabled: false
      }
    })
        
  }



  showModal(status){
    try{      
      let statusMap={
        'To Do':'to do',
        'In Progress':'in progress', 
        'Done':'done',
      }
      let pathVariable="?status="+statusMap[status];   
      this.blockedPanel = true;
      this.httpService.callApi('getProjectVolumeSpreadsheetData', {pathVariable:pathVariable}).subscribe((response) => {
        this.blockedPanel = false;
        this.projectModalData=response;
        this.sheetData=response.spreadsheetFile;
        this.showDataModal=true;
      }, error => {
        this.blockedPanel=false;      
        this.toastr.error(error.error.message, 'Projects');
      })
    }
    catch(err){
      console.log(err)
    }
  }

  downloadSheet=()=>{
    try{
      let sheetData=this.sheetData;
      let bin = atob(sheetData);
      let ab = this.s2ab(bin); 
      let blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      let objectURL = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = `Project-Volume-${this.projectModalData.status}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(objectURL);
    }
    catch(err){
      console.log(err);
    }
    
  }

  s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  getDataByStatus=(status)=>{
    if(this.formatedProjectPieCharData){
      for(let project of this.formatedProjectPieCharData){
        if(project.name==status){
          return project;
        }
      }
    }
    else{
      return null;
    }
  } 
  
  getFormateddate=(date)=>{
    try{
      if(date){
        return moment(date).format('DD/MM/YYYY')
      }
      else{
        return '';
      }
    }
    catch(err){
      console.log(err)
      return '';
    }
  }

  openRevenueModal = () =>{
    this.blockedPanel=true;
    let projectRevenueDataApi = this.httpService.callApi('getProjectRevenueSpreadsheetData',{}).subscribe((response)=>{
      this.blockedPanel=false;
      this.revenueModalData=response;
      this.showRevenueModal = true;
    },(error)=>{
      this.blockedPanel=false;
      // this.showRevenueModal = true;
      this.toastr.error(error.error.message, 'Revenue');
      console.log('Error getstatus => ', error);
    })    
  }

  openBusinessFunctionModal=()=>{
    this.blockedPanel=true;
    this.httpService.callApi('getBusinessFunctionSpreadsheetData',{}).subscribe((response)=>{
      this.blockedPanel=false;
      this.businessFunctionModalData=response;
    },(error)=>{
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Business function');
      console.log('Error getstatus => ', error);
    }) 
  }

  openActualOrBudgetModal = (status) =>{
    let statusMap={
      'On Budget':'on budget',
      'Lower':'lower', 
      'Exceed':'exceed',
    }
    let pathVariable="?actualComparison="+statusMap[status];
    this.blockedPanel=true;
    let projectRevenueDataApi = this.httpService.callApi('getActualVolumnSpreadsheetData',{pathVariable:pathVariable}).subscribe((response)=>{
      this.blockedPanel=false;
      this.actualBudgetModalData=response;
      this.actualBudgetModalData['resource'] = "actualComparison";
      this.showActualBudgetModal = true;
    },(error)=>{
      this.blockedPanel=false;
      // this.showRevenueModal = true;
      this.toastr.error(error.error.message, 'Revenue');
      console.log('Error getstatus => ', error);
    })    
  }

  openActualModalData(){
    this.blockedPanel=true;
    let projectRevenueDataApi = this.httpService.callApi('getProjectActualSpreadsheetData',{}).subscribe((response)=>{
      this.blockedPanel=false;
      this.actualBudgetModalData=response;
      this.actualBudgetModalData['resource'] = "actual";
      this.showActualBudgetModal = true;
    },(error)=>{
      this.blockedPanel=false;
      // this.showRevenueModal = true;
      this.toastr.error(error.error.message, 'Dashboard');
      console.log('Error getstatus => ', error);
    })   
  }

  openBudgetingModalData() {
    this.blockedPanel=true;
    let projectRevenueDataApi = this.httpService.callApi('getProjectBudgetSpreadsheetData',{}).subscribe((response)=>{
      this.blockedPanel=false;
      this.budgetingModalData=response;
      this.showBudgetingModal = true;
    },(error)=>{
      this.blockedPanel=false;
      // this.showRevenueModal = true;
      this.toastr.error(error.error.message, 'Dashboard');
      console.log('Error getstatus => ', error);
    })  
  }

  openResourceModal(resourceName){
    let pathVariable, resource;    
    this.blockedPanel = true; 
    if(resourceName === 'equipment'){
      pathVariable = '?functionType=EquipmentFunction';
      resource = 'Equipment'
    }
    if(resourceName === 'personnel'){
      pathVariable = '?functionType=StaffFunction';
      resource = 'Personnel'
    }
    
    this.httpService.callApi('getFunctionSpreadsheetData',{pathVariable:pathVariable}).subscribe(response => {
      this.blockedPanel = false;        
      this.resourceModalData=response;
      this.resourceModalData['resourceName'] = resourceName;
      this.sheetData=response.spreadsheetFile;
      this.showResourceModal = true;
    }, error => {
      this.blockedPanel=false;      
      this.toastr.error(error.error.message, resource);
    });
    

  }

  createActualOrBudgetChart=()=>{
    try{
      this.formatedActualPieCharData=[];
      this.formatedActualPieCharDataWithStatus={};
      let colorMap={
        'On Budget':'#6ebb47',
        'Lower':'#00a4d7',
        'Exceed':'#FC7256'
      }
      this.actualPieCharData.forEach(actual => {
        let obj={
          name: actual.actualComparison,
          y: actual.count,
          color:colorMap[actual.actualComparison]
        }
        this.formatedActualPieCharData.push(obj);
        
        this.formatedActualPieCharDataWithStatus[actual.actualComparison]=obj;
        // console.log(this.formatedActualPieCharDataWithStatus);
      });
      // console.log("formatedProjectPieCharDataWithStatus", this.formatedActualPieCharDataWithStatus);
      let data = this.formatedActualPieCharData.filter(function(d) {return d['y'] > 0})
    //   // this.formatedProjectPieCharData= this.formatedProjectPieCharData.filter(function(d) {return d['y'] > 0})
      this.pieChart = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
      },
      title: {
          text: null,
          align: 'center',
          verticalAlign: 'middle',
          y: 40
      },
      tooltip: {
        formatter: function() {
          return this.point.name +'<br/><h1>'+ this.point.y +'</h1>';
      },
          // pointFormat: '<h1>{point.y}</h1>',
          style: {
            fontSize:"15px"
          },
      },
      plotOptions: {
        series: {
          states: {
              hover: {
                  enabled: false
              }
          }
        },
          pie: {
              dataLabels: {
                  enabled: false,
                  distance: -50,
                  style: {
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize:"15px",
                      textOutline: '0'
                  }
              },
              startAngle: 0,
              endAngle: 360,
              center: ['50%', '50%'],
              size: '110%',
              events: {
                click:(evt:any)=>{
                  this.openActualOrBudgetModal(evt.point.name)
                },
              },
          },
          
          
      },
      credits: {
        enabled: false
      },
      series: [{
          type: 'pie',
          innerSize: '50%',
          data: data
      }]
      });
    }
    catch(err){
      console.log(err);
    }
  
  //   [
            
  //     {
  //       name: 'To Do',
  //       y: 50,
  //       color:'#00a4d7'
        
  //     },
  //     {
  //       name: 'In Progress',
  //       y: 25,
  //       color:'#f6c100'
  //     },
  //     {
  //       name: 'Done',
  //       y: 25,
  //       color:'#6ebb47'
  //     }
      
  // ]
  }
  hideRevenueModal = ($event) => {
    this.showRevenueModal = false;
  }
  
  hideActualBudgetModal = ($event) => {
    this.showActualBudgetModal = false;
  }

  hideBusinessFunctionModal= ($event) => {
    this.showBusinessFunctionModal = false;
  }
  hideBudgetingModal = ($event) => {
    this.showBudgetingModal = false;
  }

  hideResourceModal =($event) =>{
    this.showResourceModal = false;
  }
  hideBookingConflictModal($event){
    this.showBookingConflictModal=$event;
  }
}
