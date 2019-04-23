import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../core/services/http.service';
import { CheckBox } from '../core/entity/checkBox';
import { DataService } from '../core/services/data.service';
import { UserDetailsService } from '../core/services/user-details.service';


@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss']
})
export class EquipmentListComponent implements OnInit {
  showSaveEquipmentModal: boolean;
  equipmentList: any;
  selectedEquipment: any;
  clickedId: any = -1;
  searchText: string;
  filterList: any = [];
  searchList: any;
  isfiterClicked: boolean;
  isSortByClicked: boolean;
  isFilterByFunctionClicked: boolean;
  isFilterByModelClicked: boolean;
  isFilterByLocationClicked: boolean;
  functionCheckBoxList: any = [];
  modelCheckBoxList: any = [];
  locationCheckBoxList: any = [];
  functionList: any = [];
  selectedFunctionCheckBoxList: any = [];
  selectedModelCheckBoxList: any = [];
  selectedLocationCheckBoxList: any = [];
  dropdownData: any;
  sortBy: string;
  sortValue: number = -1;
  isEquipmentManager: boolean = false;
  blockedPanel: boolean = false;

  constructor(private httpService: HttpService, private router: Router, private dataService: DataService, private userDetailsService: UserDetailsService) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.blockedPanel = true;
    this.getEquipments();
    this.getFunctions();
    this.userDetailsService.isValidateUserRoleForModule('Equipment Manager', (res) => {
      this.isEquipmentManager = res;
    });

  }
  public createFilterDropDown() {
    this.functionCheckBoxList = new Array();
    for (let fun of this.dropdownData.functions) {
      this.functionCheckBoxList.push(new CheckBox(fun.qualifiedName, fun.id, false));
    }
    for (let location of this.dropdownData.locations) {
      this.locationCheckBoxList.push(new CheckBox(location, location, false));
    }
    for (let model of this.dropdownData.models) {
      this.modelCheckBoxList.push(new CheckBox(model, model, false));
    }

    this.searchList = new Array();
    this.searchList.push('name');
    this.searchList.push('model');
    this.searchList.push('brand');
    this.searchList.push('qualifiedName');
    this.searchList.push('location');
    this.searchList.push('serialNumber');
  }

  getEquipments() {
    this.httpService.callApi('getEquipments', {}).subscribe((responce) => {
      this.equipmentList = responce;
      this.blockedPanel = false;
    }, error => {
      this.blockedPanel = false;
      console.log('Error getstatus => ', error)
    });
  }

  clickEvent(selectedEquipment: any) {
    this.selectedEquipment = selectedEquipment;
    if (this.selectedEquipment) {
      this.clickedId = selectedEquipment.id;
    } else {
      this.clickedId = -1;
    }
  }

  getFunctions() {
    this.httpService.callApi('getEquipmentDropdownData', {}).subscribe((response) => {
      this.dropdownData = response;
      this.createFilterDropDown();
    }, error => {
      console.log('Error getstatus => ', error)
    });
  }
  doCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedFunctionCheckBoxList.push(checkBox.value);
    } else {
      this.selectedFunctionCheckBoxList.splice(this.selectedFunctionCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedFunctionCheckBoxList = JSON.parse(JSON.stringify(this.selectedFunctionCheckBoxList));
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
  addSelectedLocationCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedLocationCheckBoxList.push(checkBox.value);
    } else {
      this.selectedLocationCheckBoxList.splice(this.selectedLocationCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedLocationCheckBoxList = JSON.parse(JSON.stringify(this.selectedLocationCheckBoxList));
  }
  sort(sortBy: string) {
    if (this.sortBy != sortBy) {
      this.sortValue = -1;
    }
    this.sortBy = sortBy;
    this.sortValue *= -1;
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

  goToDetails(equipmentId: number) {
    let pathVariable: any = new Array();
    pathVariable.push({"equipmentId":equipmentId});
    // pathVariable.push(equipmentId);
    this.dataService.addPathvariables(pathVariable);
    this.openSubMenu();
  }

  openSubMenu() {
    this.dataService.openSubmenu();
  }
  closeModal($event) {
    this.showSaveEquipmentModal = $event
    this.ngOnInit();
  }

}
