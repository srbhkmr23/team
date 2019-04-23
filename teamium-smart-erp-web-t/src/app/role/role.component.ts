import { Component, OnInit, HostListener, Input } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { Router } from '../../../node_modules/@angular/router';
import { DataService } from '../core/services/data.service';
import { UserDetailsService } from '../core/services/user-details.service';
import { CheckBox } from '../core/entity/checkBox';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @Input() componentName='Client';
  clickedId: any = -1;
  blockedPanel:boolean=false;
  clientList: any;
  showSaveClientModal:boolean
  selectedClient: any;
  clientForm: FormGroup;
  searchList: any=['name'];
  dropdownData:any={};
  selectedDomainCheckBoxList: any = [];
  selectedCountryCheckBoxList: any = [];
  selectedCityCheckBoxList: any = [];
  sortBy: string;
  sortValue: number = -1;

  searchText:string="";
  isfiterClicked:boolean=false;
  isFilterByFunctionClicked:boolean=false;
  isFilterByModelClicked:boolean=false;
  isFilterByLocationClicked:boolean=false;
  isSortByClicked:boolean=false;
  selectedEquipment:any;
  showDeleteModal:boolean=false;
  clientDetail:any;
  
  constructor( private formBuilder: FormBuilder,private httpService: HttpService, private router: Router, private dataService: DataService, private userDetailsService: UserDetailsService,private toastr: ToastrService) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.blockedPanel=true;
    // this.getEquipments();
    this.getclients();
    this.getDropDownData();

  }

  getDropDownData() {
    this.httpService.callApi('getClientDropdown', {}).subscribe((response) => {
      this.dropdownData = response || {};
    }, error => {
      this.toastr.error(error.error.message, 'Client');
      console.log('Error getstatus => ', error)
    });
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

  sort(sortBy: string) {

    // alert() 
    if (this.sortBy != sortBy) {
      this.sortValue = -1;
    }
    this.sortBy = sortBy;
    this.sortValue *= -1;
  }
  
  
  getclients() {
    this.httpService.callApi('getClients', {}).subscribe((response) => {
      this.clientList = response;
      this.modifyClientList();
      this.blockedPanel=false;
    }, error => {
      this.blockedPanel=false;
      console.log('Error getstatus => ', error)
    });
  }


  modifyClientList=()=>{
    try{
      let clientList = this.clientList;
      clientList = this.clientList.map(client=>{
        if(client && client['address']){
          client['country']=client['address']['country'];
          client['city']=client['address']['city'];
        }
        return client;
        
      })
      this.clientList = clientList;
    }
    catch(err){
      console.log(err);
    }
    
  }

  goToRateCard=(obj)=>{
    try {
      let id=obj.id;
      this.router.navigate(['/teamium/rate-card/client/'+id]);
    }
    catch(err) {
      console.log(err)
    }
  }

  clickEvent(selectedClient: any) {
    this.selectedClient = selectedClient;
    if (this.selectedClient) {
      this.clickedId = selectedClient.id;
    } else {
      this.clickedId = -1;
    }
  }

  openModal() {
    this.showSaveClientModal=true;
    //this.clientForm=this.generateFunctionForm();
  }
  editClientModal(){
    this.showSaveClientModal=false;
    this.selectedClient=null;
    this.ngOnInit();
  }
  addClientModal(){
    this.showSaveClientModal=true;
    this.selectedClient=null;
  }
  closeClientModal(){
    this.selectedClient=null;
  }
  showDeleteConfirmModal(client){
    this.showDeleteModal=true;
    this.clientDetail=client.id;
  }
  deleteClient($event){
   if($event){
    this.httpService.callApi('deleteClient', {pathVariable: '/' +this.clientDetail}).subscribe((responce) => {
      this.toastr.success("Successfully Deleted","Client");
      this.ngOnInit();
      this.selectedClient=null;
      }, error => {
        this.toastr.error(error.error.message,"Client");
        console.log('Error getstatus => ', error)
      });
      this.showDeleteModal=false;
   } 
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }

  redirectToProject(id){
    ///teamium/project-budgeting/8
    let url="/teamium/project-budgeting/"+id;
    this.router.navigate([url]);
  }

}
