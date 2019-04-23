import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from "rxjs/observable/forkJoin";
import { DataService } from '../core/services/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  @ViewChild('fileInput1')
  fileInputVariable1: ElementRef;

  @ViewChild('fileInput2')
  fileInputVariable2: ElementRef;

  @ViewChild('fileInput3')
  fileInputVariable3: ElementRef;

  @ViewChild('fileInput4')
  fileInputVariable4: ElementRef;

  equipementFile: any;
  invalidEquipementFormatError: string = null;

  staffFile: any;
  invalidStaffFormatError: string = null;

  clientFile: any;
  invalidClientFormatError: string = null;

  vendorFile: any;
  invalidVendorFormatError: string = null;


  logoName: any;
  allowedExtensionsForFile: any = ['xls', 'xlsx'];

  // variables for labour rules
  labourAgreementExpand: boolean = false;
  showAgreementModal: boolean = false;
  labourRuleList: any = [];
  staffList: any = [];
  selectedLabourRule: any;

  // variables for company
  companyExpand: boolean = false;
  showCompanyModal: boolean = false;
  companyList: any = [];
  selectedCompany: any;

  // variables for Signature
  showSignatureModal: boolean = false;
  selectedSignature: any;
  signatureList: any;
  signatureExpand: boolean = false;

  //variable for format
  formatExpand: boolean = false;
  showFormatModal: boolean = false;
  showOrderModal: boolean = false;
  formatList: any = [];
  selectedFormat: any;
  selectedOrder: any;

  //variable for personnel skill
  personnelSkillExpand: boolean = false;
  showPersonnelSkillModal: boolean = false;
  personnelSkillList: any = [];
  selectedPersonnelSkill: any;

  //variable for category
  categoryExpand: boolean = false;
  showCategoryModal: boolean = false;
  categoryList: any = [];
  selectedCategory: any;

  //variable for project milestone
  projectMilestoneExpand: boolean = false;
  showProjectMilestoneModal: boolean = false;
  projectMilestoneList: any = [];
  selectedProjectMilestone: any;

  //variable for equipment milestone
  equipmentMilestoneExpand: boolean = false;
  showEquipmentMilestoneModal: boolean = false;
  equipmentMilestoneList: any = [];
  selectedEquipmentMilestone: any;

  //variable for personnel document
  personnelDocumentExpand: boolean = false;
  showPersonnelDocumentModal: boolean = false;
  personnelDocumentList: any = [];
  selectedPersonnelDocument: any;

  //Variables for channel
  showSelectedChannel: boolean = false;
  selectedChannel: any;
  channelList: any = [];
  channelExpand: boolean = false;


  //Variables for Days Off
  daysOffList: any = [];
  showDaysOff: boolean = false;
  selectedDaysOff: any;
  daysOffExpand: boolean

  //Variables for templates
  templateList: any = [];
  showTemplate: boolean = false;
  selectedTemplate: any;
  templateExpand: boolean = false;

  selectedColor: any = "#fff";
  showColorModal: boolean;
  bookingOrderForms: any;
  blockedPanel: boolean = false;
  orderformExpand: boolean = false;

  //Variables for Keyword
  keywordList: any = [];
  showKeywordModal: boolean = false;
  selectedKeyword: any;
  keywordExpand: boolean = false;

  //Variable for Currency
  currencyExpand: boolean = false;
  currencyList: any = [];
  searchText: string = "";
  showCurrencyModal = false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService, private router: Router, private dataService: DataService) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.getLabourData();
    this.getAllSignatureData();
    this.getAllChannelsData();
    this.getAllDaysOffData();
    this.getBookingOrderFormData();
    this.getAllTemplate();
    this.getKeywordData();
    this.getCurrencyData();
  }

  addcolor(color) {
    this.selectedColor = "#fff";
    this.showColorModal = true;
  }

  getLabourData = () => {
    let rulesDataAPI = this.httpService.callApi('getLabourRule', {});
    let staffDataAPI = this.httpService.callApi('getAvailablePersonals', {});
    let companyDataAPI = this.httpService.callApi('getCompany', {});
    let formatDataAPI = this.httpService.callApi('getFormat', {});
    let personnelSkillDataAPI = this.httpService.callApi('getPersonnelSkill', {});
    let categoryDataAPI = this.httpService.callApi('getCategory', {});
    let projectMilestoneDataAPI = this.httpService.callApi('getProjectMilestone', {});
    let equipmentMilestoneDataAPI = this.httpService.callApi('getEquipmentMilestone', {});
    let personnelDocumentDataAPI = this.httpService.callApi('getPersonnelDocument', {});



    this.blockedPanel = true;
    forkJoin([rulesDataAPI, staffDataAPI, companyDataAPI, formatDataAPI, categoryDataAPI, projectMilestoneDataAPI, equipmentMilestoneDataAPI, personnelDocumentDataAPI, personnelSkillDataAPI]).subscribe(resultList => {
      this.blockedPanel = false;
      this.labourRuleList = resultList[0] || [];
      this.staffList = resultList[1] || [];
      this.companyList = resultList[2] || [];
      this.formatList = resultList[3] || [];
      this.categoryList = resultList[4] || [];
      this.projectMilestoneList = resultList[5] || [];
      this.equipmentMilestoneList = resultList[6] || [];
      this.personnelDocumentList = resultList[7] || [];
      this.personnelSkillList = resultList[8] || [];
    }, (errorList) => {
      this.blockedPanel = false;
      console.log('Error[0] ', errorList[0]);
      console.log('Error[0] ', errorList[1]);
    });
  }



  getAllLabourRule = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getLabourRule', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.labourRuleList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'rules');
      console.log('Error getstatus => ', error)
    });
  }

  getAllCompany = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getCompany', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.companyList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Company');
      console.log('Error getstatus => ', error)
    });
  }

  getAllFormat = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getFormat', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.formatList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Format');
      console.log('Error getstatus => ', error)
    });
  }

  getAllPersonnelSkill = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getPersonnelSkill', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.personnelSkillList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Personnel Skill');
      console.log('Error getstatus => ', error)
    });
  }

  getAllCategory = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getCategory', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.categoryList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Category');
      console.log('Error getstatus => ', error)
    });
  }

  getAllProjectMilestone = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getProjectMilestone', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.projectMilestoneList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Project milestone');
      console.log('Error getstatus => ', error)
    });
  }

  getAllEquipmentMilestone = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getEquipmentMilestone', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.equipmentMilestoneList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Equipment milestone');
      console.log('Error getstatus => ', error)
    });
  }

  getAllPersonnelDocument = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getPersonnelDocument', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.personnelDocumentList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Personnel Document');
      console.log('Error getstatus => ', error)
    });
  }



  getAllSignatureData = () => {
    this.blockedPanel = true;
    this.httpService.callApi('getSignatureData', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.signatureList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Company');
      console.log('Error getstatus => ', error)
    });
  }

  onAddLabourRule = () => {
    this.selectedLabourRule = {};
    this.showLabourAgreementModal()
  }

  onEditLabourRule = (selectedRule) => {
    this.selectedLabourRule = selectedRule;
    // this.setLabourRuleFormData();
    this.showLabourAgreementModal()
  }

  showLabourAgreementModal = () => {
    this.showAgreementModal = true;
  }
  hideLabourAgreementModal = () => {
    this.showAgreementModal = false;
    this.getAllLabourRule()
  }

  onShowCompany = (company) => {
    if (company) {
      this.selectedCompany = company;
    }
    else {
      this.selectedCompany = {};
    }
    this.showCompanyModal = true;
  }

  onShowSignature = (company) => {
    if (company) {
      this.selectedSignature = company;
    }
    else {
      this.selectedSignature = {};
    }
    this.showSignatureModal = true;
  }

  hideCompanyModal = ($event) => {
    this.showCompanyModal = false;
    this.getAllCompany();
  }


  hideSignatureModal = ($event) => {
    this.showSignatureModal = false;
    this.getAllSignatureData();
  }


  /////////////// format
  onShowFormat = (format) => {
    if (format) {
      this.selectedFormat = format;
    }
    else {
      this.selectedFormat = {};
    }
    this.showFormatModal = true;
  }

  hideFormatModal = ($event) => {
    this.showFormatModal = false;
    this.getAllFormat();
  }

  onShowPersonnelSkill = (personnelSkill) => {
    if (personnelSkill) {
      this.selectedPersonnelSkill = personnelSkill;
    }
    else {
      this.selectedPersonnelSkill = {};
    }
    this.showPersonnelSkillModal = true;
  }

  hidePersonnelSkillModal = ($event) => {
    this.showPersonnelSkillModal = false;
    this.getAllPersonnelSkill();
  }

  onShowOrder = (order) => {
    if (order) {
      this.selectedOrder = order;
    }
    else {
      this.selectedOrder = {};
    }
    this.showOrderModal = true;
  }

  hideOrderModal = ($event) => {
    this.showOrderModal = false;
    this.getBookingOrderFormData();
  }

  // For keywords
  onShowKeyword = (keyword) => {
    if (keyword) {
      this.selectedKeyword = keyword;
    }
    else {
      this.selectedKeyword = {};
    }
    this.showKeywordModal = true;
  }

  hideKeywordModal = ($event) => {
    this.showKeywordModal = false;
    this.getKeywordData();
  }

  /////////////// category
  onShowCategory = (category) => {
    if (category) {
      this.selectedCategory = category;
    }
    else {
      this.selectedCategory = {};
    }
    this.showCategoryModal = true;
  }
  hideCategoryModal = ($event) => {
    this.showCategoryModal = false;
    this.getAllCategory();
  }

  /////////////// project mile stone
  onShowProjectMilestone = (projectMilestone) => {
    if (projectMilestone) {
      this.selectedProjectMilestone = projectMilestone;
    }
    else {
      this.selectedProjectMilestone = {};
    }
    this.showProjectMilestoneModal = true;
  }
  hideProjectMilestoneModal = ($event) => {
    this.showProjectMilestoneModal = false;
    this.getAllProjectMilestone();
  }

  /////////////// equipment mile stone
  onShowEquipmentMilestone = (equipmentMilestone) => {
    if (equipmentMilestone) {
      this.selectedEquipmentMilestone = equipmentMilestone;
    }
    else {
      this.selectedEquipmentMilestone = {};
    }
    this.showEquipmentMilestoneModal = true;
  }
  hideEquipmentMilestoneModal = ($event) => {
    this.showEquipmentMilestoneModal = false;
    this.getAllEquipmentMilestone();
  }

  /////////////// personnel-document
  onShowPersonnelDocument = (personnelDocument) => {
    if (personnelDocument) {
      this.selectedPersonnelDocument = personnelDocument;
    }
    else {
      this.selectedPersonnelDocument = {};
    }
    this.showPersonnelDocumentModal = true;
  }

  hidePersonnelDocumentModal = ($event) => {
    this.showPersonnelDocumentModal = false;
    this.getAllPersonnelDocument();
  }

  closeModal($event) {
    this.hideLabourAgreementModal();
  }

  onShowChannelModal = (channel) => {
    if (channel) {
      this.selectedChannel = channel;
    }
    else {
      this.selectedChannel = {};
    }
    this.showSelectedChannel = true;
  }

  hideChannelModal() {
    this.showSelectedChannel = false;
    this.getAllChannelsData();
  }

  hideTemplateModal() {
    this.showTemplate = false;
    this.getAllTemplate();
  }

  getAllTemplate() {
    this.blockedPanel = true;
    this.httpService.callApi('getEditionTemplates', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.templateList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Template');
      console.log('Error getstatus => ', error)
    });
  }

  onShowTemplate = (template) => {
    if (template) {
      this.selectedTemplate = template;
    }
    else {
      this.selectedTemplate = {};
    }

    this.showTemplate = true;
  }

  getAllChannelsData() {
    this.blockedPanel = true;
    this.httpService.callApi('getAllChannels', {}).subscribe((response) => {
      this.blockedPanel = false;
      this.channelList = response || [];
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Channels');
      console.log('Error getstatus => ', error)
    });
  }

  addDaysOff = (daysOff) => {
    if (daysOff) {
      this.selectedDaysOff = daysOff;
    }
    else {
      this.selectedDaysOff = {};
    }
    this.showDaysOff = true;
  }
  restoreDayOff = (daysOff) => {
    this.blockedPanel = true;
    if (daysOff) {
      daysOff.active = true;
      this.httpService.callApi('saveOrUpdateLeaveType', { body: daysOff }).subscribe((reponse) => {
        this.getAllDaysOffData();
      }, (error) => {

      });
    }
  }

  hideDaysOffModal = ($event) => {
    this.showDaysOff = false;
    this.getAllDaysOffData();
  }

  getAllDaysOffData() {
    this.blockedPanel = true;
    this.httpService.callApi('getAllLeaveType', {}).subscribe((reponse) => {
      this.daysOffList = reponse;
      this.blockedPanel = false;
    }, (error) => {

    });
  }
  getBookingOrderFormData() {
    this.httpService.callApi('getBookingOrderFormList', {}).subscribe((reponse) => {
      this.bookingOrderForms = reponse;
      this.blockedPanel = false;
    }, (error) => {

    });

  }

  getKeywordData() {
    this.httpService.callApi('getKeywordList', {}).subscribe((reponse) => {
      this.keywordList = reponse;
      this.blockedPanel = false;
    }, (error) => {
      this.toastr.error(error.error.message, 'Keyword');
    });

  }

  // upload files

  uploadFile(type) {
    let file = null;
    let url;
    switch (type) {
      case "Equipement":
        file = this.equipementFile;
        url = "uploadEquipementSheet";
        break;
      case "Personnel":
        file = this.staffFile;
        url = "uploadStaffSheet";
        break;
      case "Client":
        file = this.clientFile;
        url = "uploadClientSheet";
        break;
      case "Vendor":
        file = this.vendorFile;
        url = "uploadVendorSheet";
    }

    try {
      if (file != undefined && file != null) {
        let body = new FormData();
        body.append('spreadsheetFile', file);
        this.blockedPanel = true;
        this.httpService.callApi(url, { body: body }).subscribe((response) => {
          this.blockedPanel = false;
          if (response.containsError == true) {
            this.toastr.error(response.message, '');
          }
          else {
            this.toastr.success(response.message, '');
          }

        }, (error) => {
          this.blockedPanel = false;
          console.log('error ', error)
          this.toastr.error(error.error.message, '');
        });
      }
      else {
        alert("file not found")
      }
    }
    catch (err) {
      console.log('error ', err)
    }
  }



  onFileChange(event, type) {
    try {
      if (event.target.files.length > 0) {
        let file = event.target.files[0];
        let fileExtension = file.name.split('.').pop().toLowerCase();
        if (this.isInArray(this.allowedExtensionsForFile, fileExtension)) {
          this.logoName = "Successfully added File:" + file.name;
          this.setFile(type, file)
        }
        // else if (file.size > 2097152) {
        //   this.setErrorMessage(type,"File size should not be greater than 2MB.")
        //} 
        else {
          this.setErrorMessage(type, "Only xls or xlsx format allowed!!")
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  setErrorMessage = (type, message) => {
    switch (type) {
      case "Equipement":
        this.equipementFile = null;
        this.invalidEquipementFormatError = message;
        break;
      case "Personnel":
        this.staffFile = null;
        this.invalidStaffFormatError = message;
        break;
      case "Client":
        this.clientFile = null;
        this.invalidClientFormatError = message;
        break;
      case "Vendor":
        this.vendorFile = null;
        this.invalidVendorFormatError = message;
    }
  }

  setFile = (type, file) => {
    switch (type) {
      case "Equipement":
        this.equipementFile = file;
        this.invalidEquipementFormatError = null;
        break;
      case "Personnel":
        this.staffFile = file;
        this.invalidStaffFormatError = null;
        break;
      case "Client":
        this.clientFile = file;
        this.invalidClientFormatError = null;
        break;
      case "Vendor":
        this.vendorFile = file;
        this.invalidVendorFormatError = null;
    }

    // user message here
    let r = confirm("Be sure to have proper function naming prior importing");
    if (r == true) {
      this.uploadFile(type)
    } else {
      this.resetFile(type)
      return;
    }
  }

  resetFile = (type) => {
    switch (type) {
      case "Equipement":
        this.fileInputVariable1.nativeElement.value = null;
        this.equipementFile = null;
        this.invalidEquipementFormatError = null;
        break;
      case "Personnel":
        this.fileInputVariable2.nativeElement.value = null;
        this.staffFile = null;
        this.invalidStaffFormatError = null;
        break;
      case "Client":
        this.fileInputVariable3.nativeElement.value = null;
        this.clientFile = null;
        this.invalidClientFormatError = null;
        break;
      case "Vendor":
        this.fileInputVariable4.nativeElement.value = null;
        this.vendorFile = null;
        this.invalidVendorFormatError = null;
    }
  }


  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  getCurrencyData() {
    this.httpService.callApi('getActiveCurrencyList', {pathVariable: '/' + true}).subscribe((reponse) => {
      this.currencyList = reponse;
    }, (error) => {
      this.toastr.error(error.error.message, 'Currency');
    });
  }

  expandCurrencyList() {
    this.currencyExpand = !this.currencyExpand;
    if (this.currencyExpand) {
      this.getCurrencyData();
    }
  }

  hideCurrencyModal(){
    this.showCurrencyModal = false;
    this.getCurrencyData();
  }

}
