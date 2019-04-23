import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from '../../../node_modules/ngx-toastr';
import { TreeNode } from '../../../node_modules/primeng/components/common/api';

import { FormGroup, FormBuilder, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { HttpService } from '../core/services/http.service';
import { error } from '@angular/compiler/src/util';
import { CheckBox } from '../core/entity/checkBox';

@Component({
  selector: 'app-rate-card',
  templateUrl: './rate-card.component.html',
  styleUrls: ['./rate-card.component.scss']
})
export class RateCardComponent implements OnInit {
  rateCardId : any;
  extraId : any;
  extraVersion : any;
  name  : any;
  price : any;
  cost  : any;
  delete     : boolean;
  details    : any;
  unitPrice  : any;
  unitCost   : any;
  selectedId : any;
  minimumQuantity : any;
  minimumPrice  : any;
  showSideModal : any;
  rateCardData  : any; 
  rateDetail    : any;
  rateCardForm  : any;
  defaultQuality : any;  
  selectedIndex   : any;
  searchText: string;
  searchList: any;
  blockedPanel: boolean = false;
  detailList :any =[];
  functionList : any = [];
  currencyList : any = [];
  basisList : any = [];
  companyList : any = [];
  clientList : any = [];
  vendorList : any = [];
  rateDetails : any = [];
  selectedCompany : any;
  sortBy: string;
  sortValue: number = -1;
  rateName : any;
  selectedCurrency : any;
  selectedBasis : any;
  selectedType : any;
  selectedFunction : any;
  function : any;
  clientData : any;
  rateCardFilter : any;
  isfiterClicked : boolean;
  isSortByClicked : boolean;
  isFilterByCompanyClicked : boolean;
  isFilterByClientClicked : boolean;
  isFilterByVendorClicked : boolean;
  isFilterByCardClicked : boolean;
  isFilterByFunctionClicked : boolean;
  isFilterByBasisClicked : boolean;
  selectedFunctionCheckBoxList: any = [];
  functionCheckBoxList: any = [];
  dropdownData : any;
  companyCheckBoxList: any=[];
  basisCheckBoxList: any = [];
  clientCheckBoxList: any = [];
  vendorCheckBoxList: any = [];
  typeCheckBoxList: any = [];
  filterDisabled : any;

  selectedCompanyCheckBoxList : any= [];
  selectedClientCheckBoxList : any = [];
  selectedBasisCheckBoxList: any = [];
  selectedVendorCheckBoxList: any = [];
  selectedNameCheckBoxList: any = [];
  selectedTypeCheckBoxList: any = [];

  isEquipmentManager:any;

  constructor(private activeRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private httpService: HttpService, private toastr: ToastrService) { 

    this.rateCardForm = this.createFormGroup();
  }

  //initialize details
  ngOnInit() {


    const routeParams = this.activeRoute.snapshot.params;

    // do something with the parameters
 
    let path =this.activeRoute.snapshot.url.length>1? this.activeRoute.snapshot.url[1] : undefined;
    let id = this.activeRoute.snapshot.params;

    this.showSideModal = null;
    this.dataService.checkSubmenu(this.router);   
   
    this.getRateCard();
    this.getDropdown();
  }

  // Get all dropdown details
  getDropdown(){    
    // /rate/dropdown
    this.httpService.callApi('getAllDropdown', {}).subscribe((response => {
      response['rateType']=['Vendor', 'Client', 'Standard'];
      this.dropdownData = response;
      this.createFilterDropDown();
      this.currencyList = response.currencyList;
      this.companyList = response.companies;
      this.basisList = response.basis;
      this.functionList = response.functions;  

    }), (error) => {
        this.delete = false;
        this.toastr.error(error.error.message, 'Function');

    })
  }

  getClientData(){
    if(this.rateCardForm.get('basicInfo').get('rateType').value === 'Client'){
      this.rateCardForm.get('basicInfo').get('clientOrVendorName').enable();
      this.clientList = this.dropdownData.clients;
    }
    else if(this.rateCardForm.get('basicInfo').get('rateType').value === 'Vendor'){
      this.rateCardForm.get('basicInfo').get('clientOrVendorName').enable();
      this.clientList = this.dropdownData.suppliers;
    }
    else{
      this.clientList = [];
      this.rateCardForm.get('basicInfo').get('clientOrVendorName').disable();      
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#filter-id') && this.isfiterClicked) {
      this.isfiterClicked = false;
    }

    if (!targetElement.closest('#sort-id') && this.isSortByClicked) {
      this.isSortByClicked = false;
    }
  }

  // sorting data
  sort(sortBy: string) {
    if (this.sortBy != sortBy) {
      this.sortValue = -1;
    }
    this.sortBy = sortBy;
    this.sortValue *= -1;
  }


  // checking for validation 
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      basicInfo: this.formBuilder.group({
        company : [null],
        rateName : [null],        
        function : [null],
        rateType : [null],
        clientOrVendorName : [],       
      }),
      rateCardInfo: this.formBuilder.group({
        currency : [null],
        basis : [null],
        qtyPerDefault : [null],
      }),
      unitRateInfo: this.formBuilder.group({
        unitPrice : [null],
        unitCost : [null],
      }),
      minimumRateInfo: this.formBuilder.group({
        minimumPrice : [null],
        minimumQuantity : [null],
      }),
      ledgerInfo: this.formBuilder.group({
        title : [null],
        code : [null],
      }),
      detailList: this.formBuilder.array([]),
      extraInfo:this.formBuilder.group({
        extraId : [null],
        extraVersion : [null],
        name: [null],
        price: [null],
        cost : [null]
      })
    })
  }

  doCheckbox(checkBox: CheckBox, filterType) {
    if(filterType == 'company'){
      checkBox.checked = !checkBox.checked;
      if (checkBox.checked) {
        this.selectedCompanyCheckBoxList.push(checkBox.value);
      } else {
        this.selectedCompanyCheckBoxList.splice(this.selectedCompanyCheckBoxList.indexOf(checkBox.value), 1);

      }
      this.selectedCompanyCheckBoxList = JSON.parse(JSON.stringify(this.selectedCompanyCheckBoxList));
    }

    if(filterType == 'client'){
      checkBox.checked = !checkBox.checked;
      if (checkBox.checked) {
        this.selectedClientCheckBoxList.push(checkBox.value);
      } else {
        this.selectedClientCheckBoxList.splice(this.selectedClientCheckBoxList.indexOf(checkBox.value), 1);

      }
      this.selectedClientCheckBoxList = JSON.parse(JSON.stringify(this.selectedClientCheckBoxList));
    }

    if(filterType === 'vendor'){
      checkBox.checked = !checkBox.checked;
      if (checkBox.checked) {
        this.selectedVendorCheckBoxList.push(checkBox.value);
      } else {
        this.selectedVendorCheckBoxList.splice(this.selectedVendorCheckBoxList.indexOf(checkBox.value), 1);

      }
      this.selectedVendorCheckBoxList = JSON.parse(JSON.stringify(this.selectedVendorCheckBoxList));
    }

    if(filterType === 'type'){
      checkBox.checked = !checkBox.checked;
      if (checkBox.checked) {
        this.selectedTypeCheckBoxList.push(checkBox.value);
      } else {
        this.selectedTypeCheckBoxList.splice(this.selectedTypeCheckBoxList.indexOf(checkBox.value), 1);

      }
      
      this.selectedTypeCheckBoxList = JSON.parse(JSON.stringify(this.selectedTypeCheckBoxList));
    }

    if(filterType == "function"){
      checkBox.checked = !checkBox.checked;
      if (checkBox.checked) {
        this.selectedFunctionCheckBoxList.push(checkBox.value);
      } else {
        this.selectedFunctionCheckBoxList.splice(this.selectedFunctionCheckBoxList.indexOf(checkBox.value), 1);

      }
      this.selectedFunctionCheckBoxList = JSON.parse(JSON.stringify(this.selectedFunctionCheckBoxList));
    }

    if(filterType === 'basis'){
      checkBox.checked = !checkBox.checked;
      if (checkBox.checked) {
        this.selectedBasisCheckBoxList.push(checkBox.value);
      } else {
        this.selectedBasisCheckBoxList.splice(this.selectedBasisCheckBoxList.indexOf(checkBox.value), 1);

      }
      this.selectedBasisCheckBoxList = JSON.parse(JSON.stringify(this.selectedBasisCheckBoxList));
    }
    
  }

  public createFilterDropDown() {
    this.functionCheckBoxList = new Array();
    for (let company of this.dropdownData.companies) {
      this.companyCheckBoxList.push(new CheckBox(company.name, company.name, false));
    }

    for (let client of this.dropdownData.clients) {      
      this.clientCheckBoxList.push(new CheckBox(client.name, client.id, false));
    }

    for (let vendor of this.dropdownData.suppliers) {      
      this.vendorCheckBoxList.push(new CheckBox(vendor.name, vendor.id, false));
    }

    for (let fun of this.dropdownData.functions) {
      this.functionCheckBoxList.push(new CheckBox(fun.qualifiedName, fun.id, false));
    }
    
    for (let type of this.dropdownData.rateType) {      
      this.typeCheckBoxList.push(new CheckBox(type, type, false));
    }
    
    for (let basis of this.dropdownData.basis) {      
      this.basisCheckBoxList.push(new CheckBox(basis, basis, false));
    }

    this.searchList = new Array();
    this.searchList.push('company');
    this.searchList.push('client');
    this.searchList.push('vendor');
    this.searchList.push('cardName');
    this.searchList.push('qualifiedName');
  }

  //on adding extra details
  onAdd=()=>{
    let obj={
      "extraId" : this.rateCardForm.get('extraInfo').get('id').value,
      "extraVersion" : this.rateCardForm.get('extraInfo').get('version').value,
      "label" : this.rateCardForm.get('extraInfo').get('name').value,
      "price" : this.rateCardForm.get('extraInfo').get('price').value,
      "cost" : this.rateCardForm.get('extraInfo').get('cost').value
    };

    this.detailList.push(obj);

    this.rateCardForm.get('extraInfo').get('id').setValue('undefined');
    this.rateCardForm.get('extraInfo').get('version').setValue('undefined');
    this.rateCardForm.get('extraInfo').get('name').setValue('');
    this.rateCardForm.get('extraInfo').get('price').setValue('');
    this.rateCardForm.get('extraInfo').get('cost').setValue('');
  }


  // remove extra details
  removeDetail(i){
    this.detailList.splice(i,1);
  }

  // get rate card details
  getRateCard(){
    this.blockedPanel = true;
    this.httpService.callApi('rate', {}).subscribe(response => {
      this.blockedPanel = false;
      this.rateCardData = response; 
      
      try{
        let path =this.activeRoute.snapshot.url.length>1? this.activeRoute.snapshot.url[1].path : undefined;
        let id = this.activeRoute.snapshot.params.id;
        if(path!=undefined) {
          this.filterRateCard(path,id);
          this.filterDisabled = true;
        }     
      }
      catch(err) {
        console.log(err)
      }     

    },
    error=>{
      this.blockedPanel = false;
    });
  }

  filterRateCard=(path,id)=>{
  
    id= parseInt(id);
    
    let type='';

    if(path == "client") {
      type = "Client";
    }

    if(path == "vendor") {
      type = "Vendor";
    }
    if(path == "standard"){
      type = "Standard";
    }

    let rateCardData =this.rateCardData;
    let temp = [];

    if(type != 'Standard'){
      temp =  rateCardData.filter(rateCard=>{
        if(rateCard.type == type && rateCard.company.id == id){
          return true;
        }
      })
    }
    else {
      temp =  rateCardData.filter(rateCard=>{
        if(rateCard.type == type){
          return true;
        }
      })
    }   

    this.rateCardData = temp;
  }

  // Adding and updtaing card details
  editRateCard(rateId){

    let label;
    let obj, rateObj = {};
    this.detailList={
      "id" : this.rateCardForm.get('extraInfo').get('extraId').value,
      "version" : this.rateCardForm.get('extraInfo').get('extraVersion').value,
      "label" : this.rateCardForm.get('extraInfo').get('name').value,
      "price" : this.rateCardForm.get('extraInfo').get('price').value,
      "cost" : this.rateCardForm.get('extraInfo').get('cost').value
    };

    var selectedNode = this.rateCardForm;    
    // // adding rate card details
    if(rateId === null){  
          obj = {
            "extraId":null,
            "extraVersion":null,
            "id":null,
            "archived": false,
            "version": null
          }
    // updating rate card details
    }else{
      //editRateCardById
        obj = {
        "id":this.rateDetails.id,
        "archived": this.rateDetails.archived,
        "version": this.rateDetails.version
      }
    }
    if(selectedNode.get('basicInfo').get('rateName').value === ''){
      label = ''
    }else{
      label = selectedNode.get('basicInfo').get('rateName').value
    }

    if(selectedNode.get('basicInfo').get('company').value !== 'undefined'){
      if(selectedNode.get('basicInfo').get('function').value !== 'undefined'){
        if(selectedNode.get('basicInfo').get('rateType').value !== 'undefined'){
          rateObj = {
            "functionId": this.function['id'],       
            "functionDetails": this.function,
            "entity":{"id":selectedNode.get('basicInfo').get('company').value}, 
            "label":label,
            "basis" : selectedNode.get('rateCardInfo').get('basis').value,           
            "quantitySale": selectedNode.get('rateCardInfo').get('qtyPerDefault').value || '',
            "unitPrice": selectedNode.get('unitRateInfo').get('unitPrice').value || null,
            "unitCost": selectedNode.get('unitRateInfo').get('unitCost').value || null,
            "baseMin": selectedNode.get('minimumRateInfo').get('minimumQuantity').value || null,
            "floorUnitPrice": selectedNode.get('minimumRateInfo').get('minimumPrice').value || null,
            "extra": this.detailList || [],    
            "title":selectedNode.get('ledgerInfo').get('title').value || null,
            "code":selectedNode.get('ledgerInfo').get('code').value || null,
            "currency":selectedNode.get('rateCardInfo').get('currency').value,       
            ...obj
          }
          if(selectedNode.get('basicInfo').get('rateType').value !== 'Standard'){
            rateObj = {
              ...rateObj,
              "type": selectedNode.get('basicInfo').get('rateType').value,
            "company":{"id":selectedNode.get('basicInfo').get('clientOrVendorName').value}
            }
          }        
          if(selectedNode.get('basicInfo').get('clientOrVendorName').value === 'undefined' && selectedNode.get('basicInfo').get('rateType') .value !== 'Standard'){ 
            this.toastr.error("Please select client/vendor.", 'Rate Card');            
          }
          else{
            this.httpService.callApi('addRate', { body: rateObj }).subscribe((response => {
              if(obj['id'] !== null){
                this.toastr.success("Successfully Saved","Rate Card");
              }
              else{
                this.toastr.success("Successfully Saved","Rate Card");
              }
              this.getRateCard(); 
              this.showSideModal = null;           
              return false;
          
            }), (error) => {
                this.toastr.error(error.error.message, 'Rate Card');  
            })
            
          }
        }
        else{
          this.toastr.error("Please enter rate type.", 'Rate Card');
        }
              
      }
      else{
        this.toastr.error("Please enter function.", 'Rate Card');
      }
    }else{
      this.toastr.error("Please enter company.", 'Rate Card');
    }
      
    
  }

  getFunction(){
    var selectedNode = this.rateCardForm;
    for(var i = 0; i<this.functionList.length; i++){
      if(selectedNode.get('basicInfo').get('function').value === this.functionList[i].qualifiedName){
        this.function = this.functionList[i];
      }      
    }
  }

  getClient(){
    var selectedNode = this.rateCardForm;
  }

  // Showing details for rate card on giving id
  showDetails(rateId, rateData){
    this.httpService.callApi('getActiveCurrencyList', {pathVariable : '/' + true}).subscribe((response => {
      this.currencyList = response;
    }), (error) => {
    });

    this.rateCardId = rateId;
    this.function = rateData.functionDetails;
    this.rateDetails = rateData;
    var selectedNode = this.rateCardForm;
    if(rateId !== null){
      this.httpService.callApi('rateById', { pathVariable: rateId }).subscribe(response => {
        if(response.entity){
          selectedNode.get('basicInfo').get('company').setValue(response.entity.id);          
        }
        else{
          selectedNode.get('basicInfo').get('company').setValue('undefined');
        }
        selectedNode.get('basicInfo').get('company').disable();

        selectedNode.get('basicInfo').get('rateName').setValue(response.label);
        if(response.functionDetails){
          selectedNode.get('basicInfo').get('function').setValue(response.functionDetails.qualifiedName);
        }
        else{
          selectedNode.get('basicInfo').get('function').setValue('undefined');
        }
        selectedNode.get('basicInfo').get('function').disable();
        
        selectedNode.get('basicInfo').get('rateType').setValue(response.type);
        selectedNode.get('basicInfo').get('rateType').disable();
        this.getClientData();
        if(response.company){
          selectedNode.get('basicInfo').get('clientOrVendorName').setValue(response.company.id);
        }
        else{
          selectedNode.get('basicInfo').get('clientOrVendorName').setValue('undefined');
        }
        selectedNode.get('basicInfo').get('clientOrVendorName').disable();

        selectedNode.get('rateCardInfo').get('currency').setValue(response.currency);
        selectedNode.get('rateCardInfo').get('basis').setValue(response.basis);
        selectedNode.get('rateCardInfo').get('qtyPerDefault').setValue(response.quantitySale);
        selectedNode.get('unitRateInfo').get('unitPrice').setValue(response.unitPrice);
        selectedNode.get('unitRateInfo').get('unitCost').setValue(response.unitCost);
        selectedNode.get('minimumRateInfo').get('minimumPrice').setValue(response.floorUnitPrice);
        selectedNode.get('minimumRateInfo').get('minimumQuantity').setValue(response.baseMin);
        selectedNode.get('ledgerInfo').get('code').setValue(response.code);
        selectedNode.get('ledgerInfo').get('title').setValue(response.title);
        if(response.extra){
          selectedNode.get('extraInfo').get('extraId').setValue(response.extra.id);
          selectedNode.get('extraInfo').get('extraVersion').setValue(response.extra.version);
          selectedNode.get('extraInfo').get('name').setValue(response.extra.label);
          selectedNode.get('extraInfo').get('price').setValue(response.extra.price);
          selectedNode.get('extraInfo').get('cost').setValue(response.extra.cost);
        }
        else{
          selectedNode.get('extraInfo').get('id').setValue('undefined');
          selectedNode.get('extraInfo').get('version').setValue('undefined');
          selectedNode.get('extraInfo').get('name').setValue('');
          selectedNode.get('extraInfo').get('price').setValue('');
          selectedNode.get('extraInfo').get('cost').setValue('');
        }
      });
    }
    else {
      selectedNode.get('basicInfo').get('company').enable();
      selectedNode.get('basicInfo').get('function').enable();
      selectedNode.get('basicInfo').get('rateType').enable();
      selectedNode.get('basicInfo').get('clientOrVendorName').enable();

      selectedNode.get('basicInfo').get('company').setValue('undefined');
        selectedNode.get('basicInfo').get('rateName').setValue('');
        selectedNode.get('basicInfo').get('function').setValue('undefined');
        selectedNode.get('basicInfo').get('rateType').setValue('undefined');
        selectedNode.get('basicInfo').get('clientOrVendorName').setValue('undefined');
        selectedNode.get('rateCardInfo').get('currency').setValue(null);
        selectedNode.get('rateCardInfo').get('basis').setValue('undefined');
        selectedNode.get('rateCardInfo').get('qtyPerDefault').setValue(1);
        selectedNode.get('unitRateInfo').get('unitPrice').setValue('');
        selectedNode.get('unitRateInfo').get('unitCost').setValue('');
        selectedNode.get('minimumRateInfo').get('minimumPrice').setValue('');
        selectedNode.get('minimumRateInfo').get('minimumQuantity').setValue('');
        selectedNode.get('extraInfo').get('id').setValue('undefined');
        selectedNode.get('extraInfo').get('version').setValue('undefined');
        selectedNode.get('extraInfo').get('name').setValue('');
        selectedNode.get('extraInfo').get('price').setValue('');
        selectedNode.get('extraInfo').get('cost').setValue('');
        selectedNode.get('ledgerInfo').get('code').setValue('');
        selectedNode.get('ledgerInfo').get('title').setValue('');
    }    
  }

  // deleting card details on giving id
  deleteRateCard(selectedId){
    console.log(this.selectedIndex, selectedId);
    for(let i=0 ;i<this.rateCardData.length; i++){
      if(this.rateCardData[i].id === selectedId){
        this.delete = false;
        this.httpService.callApi('deleteRateById', { pathVariable: this.selectedId }).subscribe((response => {
          this.toastr.success("Successfully Deleted","Rate Card"); 
          this.rateCardData.splice(i,1);
          this.getRateCard();
        }), (error) => {
            this.delete = false;
            this.toastr.error(error.error.message, 'Rate Card');

        })
      }
    }
    
  } 

}




