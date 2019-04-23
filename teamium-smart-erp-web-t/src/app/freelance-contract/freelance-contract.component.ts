import { Component, OnInit, HostListener,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { HttpService } from '../core/services/http.service';
import { getCurrencySymbol } from '@angular/common'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-freelance-contract',
  templateUrl: './freelance-contract.component.html',
  styleUrls: ['./freelance-contract.component.scss']
})
export class FreelanceContractComponent implements OnInit {
  projectId: number;
  contractData:any={}; 
  projectDetail:any={};
  getCurrencySymbol = getCurrencySymbol;
  showRightSideModal:boolean = false;
  blockedPanel:boolean=false;
  manualForm:any;
  selectedContractLine:any;
  isManualUpdateEnable:boolean=false;

  contractNotExistMessage:any='No contract is available.'
  contractNotAvailabe:any=false;

  searcharr:any=['freelanacerName'];
  searchKeyword:string='';

  @ViewChild('overTimeEl') overTimeRef: ElementRef;

  constructor(private formBuilder: FormBuilder,private router: Router,private dataService: DataService, private route: ActivatedRoute, private httpService: HttpService,private toastr: ToastrService) {
    this.projectDetail={};
   
  }
 


  ngOnInit() {

    this.manualForm=this.createManualForm();

    this.dataService.checkSubmenu(this.router);
    this.route.params.subscribe(params => this.projectId = params.id);
    if (this.projectId.toString() == "undefined" && !this.dataService.pathVariable) {
      this.router.navigate(["/teamium/project-list"]);
    }
    this.getProjectDetails();

   }

   getProjectDetails=()=>{
    let contractDataApi = this.httpService.callApi('getContractDetailsById', { pathVariable: "/" + this.projectId });
    this.blockedPanel = true;
    forkJoin([contractDataApi]).subscribe(resultList => {
      this.blockedPanel = false;
      this.projectDetail=resultList[0];
      this.contractData= this.projectDetail.contractDTO || {};

      if(this.contractData && this.contractData.contractLineDTOs && this.contractData.contractLineDTOs.length>0){
        this.contractNotAvailabe=false;
      }
      else{
        this.contractNotAvailabe=true;
      }
      
    },
    err=>{
      this.blockedPanel = false;
      this.contractNotAvailabe=true;
      console.log("err",err)
    }
  )
   }

   createManualForm=()=>{
    return this.formBuilder.group({
      overTime:[null],
      nightHours:[null],
      weHours:[null],
      holidayHours:[null],
      travelHours:[null]
    })

   }

   updateForm=()=>{
    if(this.selectedContractLine && this.selectedContractLine.hasOwnProperty('id')){
      let formObject={
        id:this.selectedContractLine.id,
        extraQuantity:parseInt(this.manualForm.get("overTime").value),
        nightQuantity:parseInt(this.manualForm.get("nightHours").value),
        travelQuantity:parseInt(this.manualForm.get("travelHours").value),
        holidayQuantity:parseInt(this.manualForm.get("holidayHours").value),
        maunalUpdateOn:true
      };
      this.blockedPanel=true;
      this.httpService.callApi('updateContractById', { body: formObject }).subscribe((response) => {
        this.blockedPanel=false;
        // set updated data to selected contract line
        try{
          if(response && response.hasOwnProperty('id')){
            this.selectedContractLine = response;
            let arr= this.contractData.contractLineDTOs.map(obj => {
                if(obj.id == response.id){
                  return (response);
                }
                else {
                  return (obj);
                }
            });
            this.contractData['contractLineDTOs']=arr;
          }
        }
        catch(err){
          console.log(err);
        } 
        
      }, error => {
        this.blockedPanel=false;      
        this.toastr.error(error.error.message);
        console.log('Error getstatus => ', error)
      });
     
    }
   } 


   updateStatus = (contractId) =>{
      //updateContractStatusById
      this.blockedPanel=true;
      this.httpService.callApi('updateContractById',{ pathVariable: "/" + contractId }).subscribe((response) => {
        this.blockedPanel=false;
        // set updated data to selected contract line
        console.log("response",response)
        // set updated data to selected contract line
        try{
          if(response && response.hasOwnProperty('id')){
            let arr= this.contractData.contractLineDTOs.map(obj => {
                if(obj.id == response.id){
                  obj.status = response.status;
                  return (obj);
                }
                else {
                  return (obj);
                }
            });
            this.contractData['contractLineDTOs']=arr;
          }
        }
        catch(err){
          console.log(err);
        } 
        
        
      }, error => {
        this.blockedPanel=false;      
        this.toastr.error(error.error.message);
        console.log('Error getstatus => ', error)
      });
   }

   toggleManualUpdate=()=>{
    try{
      this.isManualUpdateEnable=!this.isManualUpdateEnable;
      if(this.isManualUpdateEnable){
        setTimeout(()=>{ 
          this.overTimeRef.nativeElement.focus();
        }, 0);
      }
    }
    catch(err){
      console.log(err)
    }
    
   }


   showModal=(contract)=>{

    //reset form
    this.manualForm.get('overTime').setValue(null);
    this.manualForm.get('nightHours').setValue(null);
    this.manualForm.get('weHours').setValue(null);
    this.manualForm.get('holidayHours').setValue(null);
    this.manualForm.get('travelHours').setValue(null);

    //set new value

     this.selectedContractLine=contract;
     if(this.selectedContractLine && this.selectedContractLine.hasOwnProperty('maunalUpdateOn')){
      this.isManualUpdateEnable = this.selectedContractLine.maunalUpdateOn;

      try{
        if(this.isManualUpdateEnable==true){
          this.manualForm.get('overTime').setValue(this.selectedContractLine.extraQuantity);
          this.manualForm.get('nightHours').setValue(this.selectedContractLine.nightQuantity);
          this.manualForm.get('weHours').setValue(null);
          this.manualForm.get('holidayHours').setValue(this.selectedContractLine.holidayQuantity);
          this.manualForm.get('travelHours').setValue(this.selectedContractLine.travelQuantity);
        }

      }
      catch(err){
        console.log(err)
      }

     }
     else {
      this.isManualUpdateEnable =false;
     }
     this.showRightSideModal = true;
   }



   updateModalValue=()=>{
    this.manualForm.get('overTime').setValue(null);
    this.manualForm.get('nightHours').setValue(null);
    this.manualForm.get('weHours').setValue(null);
    this.manualForm.get('holidayHours').setValue(null);
    this.manualForm.get('travelHours').setValue(null);
   }

   closeModal=()=>{
    this.showRightSideModal = false;
    this.selectedContractLine = null;
   }

   


}
