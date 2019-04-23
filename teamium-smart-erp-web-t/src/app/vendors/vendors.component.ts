import { Component, OnInit, HostListener, Input } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { Router } from '../../../node_modules/@angular/router';
import { DataService } from '../core/services/data.service';
import { UserDetailsService } from '../core/services/user-details.service';
import { CheckBox } from '../core/entity/checkBox';
import { ToastrService } from '../../../node_modules/ngx-toastr';
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  @Input() componentName='Vendor';
  showSaveVendorModal: boolean;
  vendorsList: any;
  selectedVendor: any ={};
  clickedId: any = -1;
  searchText: string;

  // filterList: any = [];
  searchList: any=['name'];
  // isfiterClicked: boolean;
  // isSortByClicked: boolean;
  // isFilterByFunctionClicked: boolean;
  // isFilterByModelClicked: boolean;
  // isFilterByLocationClicked: boolean;
  // functionCheckBoxList: any = [];
  // modelCheckBoxList: any = [];
  // locationCheckBoxList: any = [];
  // functionList: any = [];
  dropdownData:any={};
  selectedDomainCheckBoxList: any = [];
  selectedCountryCheckBoxList: any = [];
  selectedCityCheckBoxList: any = [];
  // dropdownData: any;
  sortBy: string;
  sortValue: number = -1;
  // isEquipmentManager: boolean = false;
  blockedPanel:boolean=false;
  
  isfiterClicked:boolean=false;
  isFilterByFunctionClicked:boolean=false;
  isFilterByModelClicked:boolean=false;
  isFilterByLocationClicked:boolean=false;
  isSortByClicked:boolean=false;
  showDeleteModal:boolean=false;
  deleteVendorDetails:any;

  constructor(private httpService: HttpService, private router: Router, private dataService: DataService, private userDetailsService: UserDetailsService,private toastr: ToastrService) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    
    this.blockedPanel=true;

    this.getDropDownData();
    this.getVendorsList();
    // this.getFunctions();
    // this.userDetailsService.isValidateUserRoleForModule('Equipment Manager', (res) => {
    //   this.isEquipmentManager = res;
    // });

  }
  // public createFilterDropDown() {
  //   this.functionCheckBoxList = new Array();
  //   for (let fun of this.dropdownData.functions) {
  //     this.functionCheckBoxList.push(new CheckBox(fun.qualifiedName, fun.id, false));
  //   }
  //   for (let location of this.dropdownData.locations) {
  //     this.locationCheckBoxList.push(new CheckBox(location, location, false));
  //   }
  //   for (let model of this.dropdownData.models) {
  //     this.modelCheckBoxList.push(new CheckBox(model, model, false));
  //   }

  //   this.searchList = new Array();
  //   this.searchList.push('name');
  //   this.searchList.push('model');
  //   this.searchList.push('brand');
  //   this.searchList.push('qualifiedName');
  //   this.searchList.push('location');
  //   this.searchList.push('serialNumber');
  // }
 
  getDropDownData() {
    this.httpService.callApi('getVendorDropdown', {}).subscribe((response) => {
      this.dropdownData = response || {};
    }, error => {
      this.toastr.error(error.error.message, 'Vendor');
      console.log('Error getstatus => ', error)
    });
  }
 
  getVendorsList() {
    this.blockedPanel=true;
    this.httpService.callApi('getVendors', {}).subscribe((responce) => {
      this.vendorsList = responce;
      this.modifyVendorList();

      console.log("getVendorsList", this.vendorsList)
      this.blockedPanel=false;
    }, error => {
      this.blockedPanel=false;
      console.log('Error getstatus => ', error)
    });
  }

  modifyVendorList=()=>{
    try{
      let vendorsList = this.vendorsList;
      vendorsList = this.vendorsList.map(vendor=>{
        if(vendor && vendor['address']){
          vendor['country']=vendor['address']['country'];
          vendor['city']=vendor['address']['city'];
        }
        return vendor;
        
      })
      this.vendorsList = vendorsList;

      console.log("vendorsList============",vendorsList)
    }
    catch(err){
      console.log(err);
    }
    
  }

  // clickEvent(selectedEquipment: any) {
  //   this.selectedEquipment = selectedEquipment;
  //   if (this.selectedEquipment) {
  //     this.clickedId = selectedEquipment.id;
  //   } else {
  //     this.clickedId = -1;
  //   }
  // }

  goToRateCard=(obj)=>{
    try {
      let id=obj.id;
      this.router.navigate(['/teamium/rate-card/vendor/'+id]);
    }
    catch(err) {
      console.log(err)
    }
  } 

  onFilter(filterData,filterType) {

    try {

      if(filterType=='domain') {
        if(this.selectedDomainCheckBoxList.indexOf(filterData)>=0){
          this.selectedDomainCheckBoxList.splice(this.selectedDomainCheckBoxList.indexOf(filterData), 1);
        }
        else {
          this.selectedDomainCheckBoxList.push(filterData);
        }

        this.selectedDomainCheckBoxList = JSON.parse(JSON.stringify(this.selectedDomainCheckBoxList));
      }

      if(filterType=='country') {
        if(this.selectedCountryCheckBoxList.indexOf(filterData)>=0){
          this.selectedCountryCheckBoxList.splice(this.selectedCountryCheckBoxList.indexOf(filterData), 1);
        }
        else {
          this.selectedCountryCheckBoxList.push(filterData);
        }

        this.selectedCountryCheckBoxList = JSON.parse(JSON.stringify(this.selectedCountryCheckBoxList));
      }

      if(filterType=='city') {
        if(this.selectedCityCheckBoxList.indexOf(filterData)>=0){
          this.selectedCityCheckBoxList.splice(this.selectedCityCheckBoxList.indexOf(filterData), 1);
        }
        else {
          this.selectedCityCheckBoxList.push(filterData);
        }

        this.selectedCityCheckBoxList = JSON.parse(JSON.stringify(this.selectedCityCheckBoxList));
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  onClickVendor = (selectedVendor: any) =>{
    this.selectedVendor = selectedVendor || {};
    if (this.selectedVendor && this.selectedVendor.hasOwnProperty('id')) {
      this.clickedId = selectedVendor.id;
    } else {
      this.clickedId = -1;
    }
  }

  showDeleteConfirmModal(vendor){
    this.showDeleteModal=true;
    this.deleteVendorDetails=vendor.id;
  }
deleteVendor($event){
    if($event){
     this.httpService.callApi('deleteVendor', {pathVariable: '/' +this.deleteVendorDetails}).subscribe((responce) => {
       this.toastr.success("Successfully Deleted","Vendor");
       this.ngOnInit();
       this.selectedVendor=null;
       }, error => {
         this.toastr.error(error.error.message,'Vendor');
         console.log('Error getstatus => ', error)
       });
       this.showDeleteModal=false;
    } 
   }
   closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
   }

   sort(sortBy: string) {
    if (this.sortBy != sortBy) {
      this.sortValue = -1;
    }
    this.sortBy = sortBy;
    this.sortValue *= -1;
  }

  // getFunctions() {
  //   this.httpService.callApi('getEquipmentDropdownData', {}).subscribe((response) => {
  //     this.dropdownData = response;
  //     this.createFilterDropDown();
  //   }, error => {
  //     console.log('Error getstatus => ', error)
  //   });
  // }
  // doCheckbox(checkBox: CheckBox) {

  //   checkBox.checked = !checkBox.checked;
  //   if (checkBox.checked) {
  //     this.selectedFunctionCheckBoxList.push(checkBox.value);
  //   } else {
  //     this.selectedFunctionCheckBoxList.splice(this.selectedFunctionCheckBoxList.indexOf(checkBox.value), 1);

  //   }
  //   this.selectedFunctionCheckBoxList = JSON.parse(JSON.stringify(this.selectedFunctionCheckBoxList));
  // }
  // addSelectedModelCheckbox(checkBox: CheckBox) {

  //   checkBox.checked = !checkBox.checked;
  //   if (checkBox.checked) {
  //     this.selectedModelCheckBoxList.push(checkBox.value);
  //   } else {
  //     this.selectedModelCheckBoxList.splice(this.selectedModelCheckBoxList.indexOf(checkBox.value), 1);

  //   }
  //   this.selectedModelCheckBoxList = JSON.parse(JSON.stringify(this.selectedModelCheckBoxList));

  // }
  // addSelectedLocationCheckbox(checkBox: CheckBox) {

  //   checkBox.checked = !checkBox.checked;
  //   if (checkBox.checked) {
  //     this.selectedLocationCheckBoxList.push(checkBox.value);
  //   } else {
  //     this.selectedLocationCheckBoxList.splice(this.selectedLocationCheckBoxList.indexOf(checkBox.value), 1);

  //   }
  //   this.selectedLocationCheckBoxList = JSON.parse(JSON.stringify(this.selectedLocationCheckBoxList));
  // }
  // sort(sortBy: string) {
  //   if (this.sortBy != sortBy) {
  //     this.sortValue = -1;
  //   }
  //   this.sortBy = sortBy;
  //   this.sortValue *= -1;
  // }

  // @HostListener('document:click', ['$event.target'])
  // onClickedOutside(targetElement) {
  //   if (!targetElement.closest('#filter-id') && this.isfiterClicked) {
  //     this.isfiterClicked = false;
  //   }

  //   if (!targetElement.closest('#sort-id') && this.isSortByClicked) {
  //     this.isSortByClicked = false;
  //   }
  // }

  // goToDetails(equipmentId: number) {
  //   let pathVariable: any = new Array();
  //   pathVariable.push(equipmentId);
  //   this.dataService.addPathvariables(pathVariable);
  //   this.openSubMenu();
  // }

  openSubMenu() {
    this.dataService.openSubmenu();
  }
  closeModal($event) {
    this.showSaveVendorModal = $event
    this.selectedVendor = null;
    this.ngOnInit();
  }

}


