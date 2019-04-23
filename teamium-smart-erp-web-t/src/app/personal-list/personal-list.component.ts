import { Component, OnInit, HostListener } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { CheckBox } from '../core/entity/checkBox';
import { DataService } from '../core/services/data.service';
import { Router } from '../../../node_modules/@angular/router';
import { Rates } from '../core/entity/Rates';
import { UserDetailsService } from '../core/services/user-details.service';

@Component({
  selector: 'app-personal-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss']
})
export class PersonalListComponent implements OnInit {
  showSavePersonnelModal: boolean = false;
  // rangeValues: number[] = [0, 0];

  minValue: number;
  maxValue: number;
  rates: Rates = new Rates();

  selectedPersonal: any;
  clickedId: any = -1;
  searchText: string;
  filterList: any = [];
  searchList: any;

  personalList: any;
  functionList: any = [];

  isfiterClicked: boolean;
  isSortByClicked: boolean;

  isFilterByFunctionClicked: boolean;
  isFilterByLocationClicked: boolean;
  isFilterBySkillClicked: boolean;
  isFilterByFreelancerClicked: boolean;
  isFilterByRateClicked: boolean;
  isFilterByBookedStatusClicked: boolean;

  functionCheckBoxList: any = [];
  skillsCheckBoxList: any = [];
  locationCheckBoxList: any = [];
  freelancerCheckBoxList: any = [];
  bookedCheckBoxList: any = [];
  rateCheckBoxList: any = [];

  selectedFunctionCheckBoxList: any = [];
  selectedSkillCheckBoxList: any = [];
  selectedLocationCheckBoxList: any = [];
  selectedFreelancerCheckBoxList: any = [];
  selectedRateCheckBoxList: any = [];
  selectedBookedCheckBoxList: any = [];

  dropdownData: any;
  sortBy: string;
  sortValue: number = -1;
  myclass: any = [];
  blockedPanel: boolean = false;
  isHumanResource: boolean = false;

  constructor(private httpService: HttpService, private router: Router, private dataService: DataService,
    private userDetailsService: UserDetailsService) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.blockedPanel = true;
    this.getPersonals();
    this.getFunctions();
    this.userDetailsService.isValidateUserRoleForModule('Human Resources', (res) => {
      this.isHumanResource = res;
    });
  }
  public createFilterDropDown() {
    this.functionCheckBoxList = new Array();
    if (!this.dropdownData.functions) {
      return;
    }
    for (let fun of this.dropdownData.functions) {
      this.functionCheckBoxList.push(new CheckBox(fun.qualifiedName, fun.id, false));
    }

    this.freelancerCheckBoxList.push(new CheckBox("Freelancer", true, false));
    // this.freelancerCheckBoxList.push(new CheckBox("Non-Freelancer", false, false));

    this.bookedCheckBoxList.push(new CheckBox("Status", true, false));
    if (this.dropdownData.locations) {
      for (let location of this.dropdownData.locations) {
        this.locationCheckBoxList.push(new CheckBox(location, location, false));
      }
    }

    // for (let model of this.dropdownData.models) {
    //   this.modelCheckBoxList.push(new CheckBox(model, model, false));
    // }
    for (let skill of this.dropdownData.skills) {
      this.skillsCheckBoxList.push(new CheckBox(skill, skill, false));
    }
    console.log(' currency : --');
    for (let currency of this.dropdownData.currencyList) {
      // console.log(currency);
      // this.skillsCheckBoxList.push(new CheckBox(skill, skill, false));
    }
    console.log('Rate : ---');
    for (let rate of this.dropdownData.rateUnitsList) {


      // console.log(rate);
      // this.skillsCheckBoxList.push(new CheckBox(skill, skill, false));
    }

    this.searchList = new Array();

    this.searchList.push('firstName');
    this.searchList.push('lastName');
    this.searchList.push('location');

    this.maxValue = this.dropdownData.maxRate;
    this.minValue = this.dropdownData.minRate;

    this.rates.minValue = this.minValue;
    this.rates.maxValue = this.maxValue;
    this.rates.rangeValues[0] = this.minValue;
    this.rates.rangeValues[1] = this.maxValue;
    console.log('this.rates.rangeValues[0] ::: ', this.rates.rangeValues[0]);
    console.log('this.rates.maxValue::: ', this.rates.maxValue);
    console.log('this.rates.minValue::: ', this.rates.minValue);

    console.log('this.dropdownData.maxRate ::: ', this.dropdownData.maxRate);
    console.log('this.maxValue ::: ', this.maxValue);

  }

  getPersonals() {
    this.httpService.callApi('getPersonals', {}).subscribe((responce) => {
      this.personalList = responce;
      this.blockedPanel = false;

    }, error => {
      console.log('Error getstatus => ', error)
    });
  }

  clickEvent(selectedPersonal: any) {
    this.selectedPersonal = selectedPersonal;
    if (this.selectedPersonal) {
      this.clickedId = selectedPersonal.id;
    } else {
      this.clickedId = -1;
    }
  }

  getFunctions() {
    this.httpService.callApi('getPersonalDropdownData', {}).subscribe((response) => {
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
  addSelectedSkillCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedSkillCheckBoxList.push(checkBox.value);
    } else {
      this.selectedSkillCheckBoxList.splice(this.selectedSkillCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedSkillCheckBoxList = JSON.parse(JSON.stringify(this.selectedSkillCheckBoxList));

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

  addSelectedFreelanceCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedFreelancerCheckBoxList.push(checkBox.value);
    } else {
      this.selectedFreelancerCheckBoxList.splice(this.selectedFreelancerCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedFreelancerCheckBoxList = JSON.parse(JSON.stringify(this.selectedFreelancerCheckBoxList));

  }

  addSelectedBookedCheckbox(checkBox: CheckBox) {
    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedBookedCheckBoxList.push(checkBox.value);
    } else {
      this.selectedBookedCheckBoxList.splice(this.selectedBookedCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedBookedCheckBoxList = JSON.parse(JSON.stringify(this.selectedBookedCheckBoxList));

  }

  addSelectedRateCheckbox(checkBox: CheckBox) {
    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedRateCheckBoxList.push(checkBox.value);
    } else {
      this.selectedRateCheckBoxList.splice(this.selectedRateCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedRateCheckBoxList = JSON.parse(JSON.stringify(this.selectedRateCheckBoxList));

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


  goToDetails(personnel: any) {
    let pathVariable: any = new Array();
    // pathVariable.push(personnel.id);
    pathVariable.push({ "staffId": personnel.id });
    this.dataService.addPathvariables(pathVariable);
    this.dataService.setSelectedPersonnel = personnel;
    this.openSubMenu();
  }

  openSubMenu() {
    this.dataService.openSubmenu();
  }


  closeModal($event) {
    this.showSavePersonnelModal = $event
    this.ngOnInit();
  }

  handleChange(rateValue: any) {
    this.rates.rangeValues = rateValue;
    this.rates = JSON.parse(JSON.stringify(this.rates));
  }

}