import { Component, OnInit, HostListener } from '@angular/core';
import { HttpService } from '../core/services/http.service'
import { CheckBox } from '../core/entity/checkBox'
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../core/services/data.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UserDetailsService } from '../core/services/user-details.service';

@Component({
  selector: 'app-equipment-package',
  templateUrl: './equipment-package.component.html',
  styleUrls: ['./equipment-package.component.scss']
})
export class EquipmentPackageComponent implements OnInit {
  equipmentDetail: any;
  equipmentId: number;
  equipmentList: any = [];
  selectedEquipmentList: any = [];
  isfiterClicked: boolean;
  isFilterByFunctionClicked: boolean;
  selectedFunctionCheckBoxList: any = [];
  selectedLocationCheckBoxList: any = [];
  isFilterByModelClicked: boolean;
  isFilterByLocationClicked: boolean;
  modelCheckBoxList: any = [];
  selectedModelCheckBoxList: any = [];
  functionList: any = [];
  dropdownData: any;
  subPackageList: any;
  isEquipmentManager: boolean = false;
  blockedPanel:any;

  constructor(private router:Router,private httpService: HttpService, private toastr: ToastrService, private dataService: DataService, private route: ActivatedRoute,private userDetailsService: UserDetailsService) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);

    this.route.params.subscribe(params => this.equipmentId = params.id);
    let pathVariable:any=new Array();
    // pathVariable.push(this.equipmentId);
    pathVariable.push({"equipmentId":this.equipmentId});
    this.dataService.addPathvariables(pathVariable);

    this.getEquipmentDetailById();
    this.userDetailsService.isValidateUserRoleForModule('Equipment Manager', (res) => {
      this.isEquipmentManager = res;
      console.log(' LoggedIn isEquipmentManager ', this.isEquipmentManager)
    });
  }
  getEquipments() {
    this.httpService.callApi('getEquipmentForPackage', { 'pathVariable': this.equipmentDetail.id }).subscribe((responce) => {
      this.equipmentList = responce;
      this.equipmentList.map(dt => {
        if (dt.model) {
          
          let isContain: boolean = false;
          this.modelCheckBoxList.forEach(element => {
            if (element.value == dt.model) {
              isContain = true;
              return;
            }
          });
         
          if (!isContain)
            this.modelCheckBoxList.push(new CheckBox(dt.model, dt.model, false));


        }
      });
    }, error => {
      console.log('Error getstatus => ', error)
    });
  }


  addSelectedModelCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedModelCheckBoxList.push(checkBox.value);
    } else {
      this.selectedModelCheckBoxList.splice(this.selectedModelCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedModelCheckBoxList = JSON.parse(JSON.stringify(this.selectedModelCheckBoxList));

  }


  addEquipmentToPackage(equipment: any) {
    this.selectedEquipmentList.push(equipment);
    this.equipmentList.splice(this.equipmentList.indexOf(equipment), 1);

    this.selectedModelCheckBoxList = JSON.parse(JSON.stringify(this.selectedModelCheckBoxList));
  }

  removeEquipmentFromPacakge(equipment: any) {
    console.log("going to remove", equipment);
    this.selectedEquipmentList.splice(this.selectedEquipmentList.indexOf(equipment), 1);
    this.equipmentList.push(equipment);

    this.selectedModelCheckBoxList = JSON.parse(JSON.stringify(this.selectedModelCheckBoxList));
  }

  getEquipmentDetailById() {
    this.blockedPanel=true;
    console.log('this.equipmentId', this.equipmentId);
    this.httpService.callApi('getEquipmentById', { pathVariable: this.equipmentId }).subscribe(reaponse => {
      this.equipmentDetail = reaponse;
      if (this.equipmentDetail.resource) {
        this.getEquipments();
        this.getEquipmentForSeletedPacakge(this.equipmentDetail.resource.id).subscribe(reaponse => {
         
          this.selectedEquipmentList = reaponse;
        }, error => {
          console.log(error);
        });
        if (this.equipmentDetail.resource.parent) {
          this.getEquipmentForSeletedPacakge(this.equipmentDetail.resource.parent.id).subscribe(reaponse => {
            console.log(this.equipmentDetail);
            this.subPackageList = reaponse.filter(dt => dt.id != this.equipmentDetail.id);
          }, error => {
            console.log(error);
          });
        }
      }
      this.blockedPanel=false;
      console.log(this.equipmentDetail);
    }, error => {
      this.blockedPanel=false;
      console.log(error);
      this.toastr.error(error.error.message, 'Equipment');
    });
  }

  getEquipmentForSeletedPacakge(resourceId: number): Observable<any> {
    return this.httpService.callApi('getEquipmentForSeletedPacakge', { pathVariable: resourceId });
  }

  savePackage() {
    let body: any = this.selectedEquipmentList.map(e => e.resource.id);
    this.httpService.callApi('savePackage', { 'body': body, 'pathVariable': this.equipmentDetail.resource.id }).subscribe((response) => {
      this.toastr.success('Successfully Saved', 'Package');
    }, (error) => {
      this.toastr.error(error.error.message, 'Package');
    });
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    console.log('targetElement.closest ',targetElement.closest('#filter-id'))
    if (!targetElement.closest('#filter-id') && this.isfiterClicked) {
      this.isfiterClicked = false;
    }
  }

}
