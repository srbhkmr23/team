import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BootstrapOptions } from '../../../node_modules/@angular/core/src/application_ref';

@Component({
  selector: 'app-create-personnel',
  templateUrl: './create-personnel.component.html',
  styleUrls: ['./create-personnel.component.scss']
})
export class CreatePersonnelComponent implements OnInit {
  @Input() componentName='Personnel';
  @Input() personnelDetail: any;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  personnelForm: FormGroup;
  items: FormArray;
  functions: any = [];
  selectedStep: number = 1;
  dropdownData: any = [];
  functoinsWithRating: any = [];
  showModal: boolean = false;
  attachments: any = [];
  milestones: any = [];
  unassignedResourceFunctionIds: any = [];
  functionKeywords: any = [];
  invalidPhotoFormatError: string = null;
  invalidAttachmentFormatError: string = null;
  removedAttachments: any = [];
  allowedExtensionsForPhoto = ['jpg', 'jpeg', 'png'];
  allowedExtensionsForAttachment = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'pdf'];
  resource = {
    "functions": []


  };
  isAvailableOnMarketPlace: boolean;
  pictureUrl: string;
  modalHeading = "Add Personnel";
  isFormDataChanged: boolean;
  profilePictureName: string;
  equipmentNameError: string;
  serialNumberError: string;
  emails: any = [];
  telephones: any = [];
  skills: any = [];
  languages: any = [];
  groupList: any = [];
  assignedRoles: any = [];
  documents: any = [];
  addedAttachmentFileName: string;
  fileTarget: any;
  groups: any = [];
  provideLoginError: string = null;
  startTime: Date;
  endTime: Date;
  isValidPeronnnel: boolean = false;
  canGoToNext: boolean = true;
  telephoneError: string;
  isInvalidLogin: boolean;
  freelance: string;
  rateCard: any = {};
  currencyList: any = [];
  basisList: any = [];
  RateCardRow: any = {};
  rateCardChecked: any = {};
  value: any = {};
  basis: any = {};
  addCurrency: any = {}
  showLine: boolean = false;
  rateIndex: any;
  showAdd: boolean = false;
  rateObj: any = [];
  functionObj: any = [];
  isFreelance: any = true;
  addedPictureNameMessage : string;
  removePhoto : boolean = false;
  event:any;
  currentBasisList=[];
  currentCurrencyList=[];
  errorMessage:boolean=false;
  showDeleteModal:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private commonUtilService: CommonUtilService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {

    this.getPersonnelDropdownData();
    this.getDropdown();

    if (this.personnelDetail) {
      this.modalHeading = "Edit Personnel"
      this.createFormGroupForEdit((form) => {
        this.personnelForm = form;
        this.pictureUrl = this.personnelDetail.photo != null ? this.personnelDetail.photo.url : '';

        this.attachments = this.personnelDetail.attachments;
        if (this.personnelDetail.skills) {
          this.skills = this.personnelDetail.skills;
        }
        this.functoinsWithRating = this.personnelDetail.resource.functions.map(data => {
          return { 'function': data.function, 'rating': data.rating }
        });
        this.languages = this.personnelDetail.languages;
        let controls = <FormArray>this.personnelForm.get('functions').get('rateCard');

        for (var i = 0; i < this.personnelDetail.resource.functions.length; i++) {
          let functionInfo = this.personnelDetail.resource.functions[i];
          this.rateObj = [];
          for (var j = 0; j < functionInfo.rates.length; j++) {

            let rate = functionInfo.rates[j];

            let arr = this.formBuilder.group({
              price: [rate.value],
              basis: [rate.basis],
              currency: [rate.currency]
            })
            this.rateObj.push(arr);
          }
          controls.push(this.formBuilder.array(this.rateObj));
        }
        this.resource = this.personnelDetail.resource;

        if (this.personnelDetail && this.personnelDetail.hasOwnProperty('groupDTOs')) {
          this.groupList = this.personnelDetail.groupDTOs || [];
        }

        if (this.personnelDetail.userSettingDTO) {
          this.emails = this.personnelDetail.userSettingDTO && this.personnelDetail.userSettingDTO.emails ? this.personnelDetail.userSettingDTO.emails : [];
          this.telephones = this.personnelDetail.userSettingDTO && this.personnelDetail.userSettingDTO.telephones ? this.personnelDetail.userSettingDTO.telephones : [];
        }
        if (this.personnelDetail.role && this.personnelDetail.role.length > 0) {
          this.assignedRoles = this.personnelDetail.role;
        }
        if (this.personnelDetail.documents) {
          this.documents = this.personnelDetail.documents;
        }
        if (this.personnelDetail.resource && this.personnelDetail.resource.staffGroupDTOs) {
          this.groups = this.personnelDetail.resource.staffGroupDTOs.map(group => group.name);
        }
        this.freelance = this.personnelDetail.contractSettingDTO && this.personnelDetail.contractSettingDTO.contractType == 'Freelance' ? 'Yes' : 'No';
        this.isFreelance = this.personnelDetail ? this.personnelDetail.freelance : true;
        //this.validateNextButton();
        this.validateSaveButton();



      });

    } else {
      this.personnelForm = this.createFormGroup();

    }

    this.personnelForm.get('attachment').get('feedByUrl').valueChanges.subscribe(

      (feedByUrl) => {

        if (feedByUrl == '1') {
          this.personnelForm.get('attachment').get('url').enable();
          this.personnelForm.get('attachment').get('url').setValidators(Validators.compose([Validators.required, Validators.pattern('(https://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?|(http://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]));

          this.personnelForm.get('attachment').get('avatar').disable();
          this.personnelForm.get('attachment').get('avatar').clearValidators();
        } else {
          this.personnelForm.get('attachment').get('url').disable();
          this.personnelForm.get('attachment').get('url').clearValidators();

          this.personnelForm.get('attachment').get('avatar').enable();
          this.personnelForm.get('attachment').get('avatar').setValidators(Validators.required);
        }
        this.personnelForm.get('attachment').get('url').updateValueAndValidity();
        this.personnelForm.get('attachment').get('avatar').updateValueAndValidity();
      });

    this.personnelForm.get('others').get('login').valueChanges.subscribe((value) => {
      this.isInvalidLogin = this.personnelForm.get('others').get('login') && this.personnelForm.get('others').get('login').value.length <= 6 && this.personnelForm.get('others').get('login').value.length > 0;

    });

    this.personnelForm.get('others').get('password').valueChanges.subscribe((value) => {

      this.personnelForm.get('others').get('confirmPassword').reset();

    });

    this.personnelForm.valueChanges.subscribe((value) => {
      //this.validateNextButton();
      this.validateSaveButton();
    });

    this.personnelForm.get('personnelInfo').get('telephone').valueChanges.subscribe((value) => {
      this.telephoneError = null;
      if (!value) {
        return;
      }
      if (value.split("-").length == 2) {
        if (!value.split("-")[0].match("^([+])?([0]{1,2})?([1-9]{1})$")) {
          this.telephoneError = "Please enter a valid telephone.";
          return;
        }
        if (value.split("-")[0].match("^([+])?[0]{1,7}$")) {
          this.telephoneError = "Please enter a valid telephone.";
          return;
        }
        if (!value.match("^([+])?([0-9]{1,7}[-])?[1-9]{1,1}[0-9]{5,9}$")) {
          this.telephoneError = "Please enter a valid telephone.";
          return;
        }
        if (value.split("-")[0].length > 8 || value.split("-")[1].length < 6
          || value.split("-")[1].length > 10 || value.length > 17 || value.length < 10) {
          this.telephoneError = "Please enter a valid telephone.";
          return;
        }
      } else if (value.split("-").length >= 2) {
        this.telephoneError = "hello 4.";
      } else if (!value.match("^([+])?(([0]{1,2})?([1-9]{1})([0-9]{5,11}))$")) {
        this.telephoneError = "Please enter a valid telephone.";
      }

    });


  }

  // Get all dropdown details
  getDropdown() {
    // /rate/dropdown
    this.httpService.callApi('getAllDropdown', {}).subscribe((response => {
      this.currencyList = response.currencyList || [];
      this.basisList = response.basis || [];
    }), (error) => {
      this.toastr.error(error.error.message, 'Personnel');

    })
  }

  setSelectedStep(stepNumber: number) {
    this.selectedStep = stepNumber;
  }

  rateCardShow(rate, index) {
    if (this.rateCard[index]) {
      this.rateCard[index] = false;
    }
    else {
      this.rateCard[index] = true;
    }

    if (this.resource.functions[index].rates === undefined) {
      this.resource.functions[index]['rates'] = [];
    }
  }



  checkedPrimaryOption(ratecard, index) {
    if (ratecard.rateSelected) {
      ratecard.rateSelected = false;
    }
    else {
      ratecard.rateSelected = true;
    }
    this.resource.functions[index] = { ...this.resource.functions[index], rateSelected: this.rateCardChecked[index] }
  }

  getPrice(evt, functionIndex, rateIndex) {
    this.resource.functions[functionIndex].rates[rateIndex] = { ...this.resource.functions[functionIndex].rates[rateIndex], 'value': parseInt(this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.price.value) }
  }

  getBasis(functionIndex, rateIndex) {
    this.errorMessage=false;
    let data;
    this.resource.functions[functionIndex].rates[rateIndex] = { ...this.resource.functions[functionIndex].rates[rateIndex], 'basis': this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.basis.value }
    let obj={
      rateIndex,
      value:this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.basis.value,
      currency:this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.currency.value
    };
    if(this.currentBasisList.length<1)
    this.currentBasisList.push(obj);
    else{
      this.currentBasisList.forEach(element=>{
        if(element.value==obj.value && element.currency==obj.currency){
            this.errorMessage=true;
          }
       
      })
    }
    if(this.errorMessage){
      this.toastr.warning('Combination of Basis and Currency should be unique','Personnel');
    }
    if(this.errorMessage==false){
      let status=false;
      this.currentBasisList.forEach(element=>{
        if(element.rateIndex==rateIndex){
          status=true;
          element.value=obj.value;
          element.currency=obj.currency;
        }
       
      })
      if(status==false)
          this.currentBasisList.push(obj);
    }
  }

  getCurrency(functionIndex, rateIndex) {
    this.errorMessage=false;
    let obj;
    this.resource.functions[functionIndex].rates[rateIndex] = { ...this.resource.functions[functionIndex].rates[rateIndex], 'currency': this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.currency.value }
    if(this.currentBasisList.length==1)
    this.currentBasisList.forEach(data=>{
      if(data.rateIndex==rateIndex){
        data['currency']=this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.currency.value;
      }
    })
    obj={

      value:this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.basis.value,
      currency:this.personnelForm.get('functions').get('rateCard')['controls'][functionIndex].controls[rateIndex].controls.currency.value
    }
    if(this.currentBasisList.length>1)
    this.currentBasisList.forEach(data=>{
      if(data.value==obj.value && data.currency==obj.currency)
      this.errorMessage=true;
    })
    if(this.errorMessage)
      this.toastr.warning('Combination of Basis and Currency should be unique','Personnel');
    if(this.errorMessage==false){
      this.currentBasisList.forEach(data=>{
        if(data.rateIndex==rateIndex){
          data.value=obj.value;
          data.currency=obj.currency
        }
      })
    }

  }

  deleteRateCard(rateData, functionIndex, index) {
    rateData.controls[0].removeAt(index)
    this.resource.functions[functionIndex].rates.splice(index, 1)
  }

  /*-  To create from for new personnel. */
  createFormGroup(): FormGroup {
    let editMode: boolean = this.personnelDetail;
    return this.formBuilder.group({
      personnelInfo: this.formBuilder.group({

        firstName: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-ZÀ-ŸØ-öø-ÿ]{1,30}$')])],
        lastName: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-ZÀ-ŸØ-öø-ÿ]{1,30}$')])],
        jobTitle: [null],
        freelance: [false],
        employeeCode: [null, Validators.required],
        address: [null],
        city: [null],
        country: [null],
        state: [null],
        zipcode: [null],
        telephone: [null],
        email: [null, Validators.pattern("^[a-zA-Z0-9]+(\\.[a-zA-Z0-9]{1,})*(\\.[a-zA-Z0-9]{1,})*@[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*(\\.[a-zA-Z0-9]{2,})$")],
        marketplace: [false],
        available: [true],
        avatar: [null],
      }),

      functions: this.formBuilder.group({
        selectedFunction: [null, Validators.required],
        selectedRating: [null],
        selectedSkill: [null, Validators.required],
        selectedSkillRating: [null],
        selectedLanguage: [null, Validators.required],
        rateCard: this.formBuilder.array([])

      }),

      details: this.formBuilder.group({
        bankAddress: [],
        beneficiaire: [],
        birthCountry: [null],
        birthPlace: [],
        birthProvince: [null],
        birthState: [null],
        dateOfBirth: [null],
        documents: [null],
        gender: ['Male'],
        healthInsuranceName: [null],
        marriedName: [null],
        nationality: [null],
        numBic: [null],
        numCardPress: [null],
        routingAndAccounting: [null],
        socSecNumber: [null], talentReg: [null],
        contractType: ['Freelance'],
        labourAggrement: [null],
        workingTimePercent: [null],
        hiringDate: [new Date()],
        startTime: [new Date()],
        endTime: [new Date()]

      }),


      attachment: this.formBuilder.group({
        attachmentType: [null, Validators.required],
        feedByUrl: '',
        avatar: [null, Validators.required],
        url: [{ value: null, disabled: true }]
      }),

      others: this.formBuilder.group({
        documentType: [null, Validators.required],
        documentNumber: [null, Validators.required],
        expirationDate: [null, Validators.required],
        group: [null, Validators.required],
        login: [null],
        password: [null],
        confirmPassword: [null, Validators.compose([Validators.required, this.validateAreEqual.bind(this)])],
        selectedRole: [null, Validators.required],
        comment: [null]

      })

    });
  }

  createItem(index): any {
    if (this.items.controls[index]) {
      let arr = this.items.controls[index] as FormArray;
      arr.push(this.createChild())
      return null;
    }
    else {
      return this.formBuilder.array([this.createChild()])
    }
  }

  createChild() {
    return this.formBuilder.group({
      price: [null],
      basis: [null],
      currency: [null]
    });
  }

  addRateRow(data, index) {
    this.addItem(index);
  }

  addItem(index): void {

    this.items = this.personnelForm.get("functions").get('rateCard') as FormArray;


    if (this.items.controls[index]) {
      this.createItem(index)
    }
    else {
      this.items.push(this.createItem(index));
    }

  }

  /*-  To create from for edit */
  createFormGroupForEdit(cb) {
    let editMode: boolean = this.personnelDetail;
    let fg: FormGroup = this.formBuilder.group({
      personnelInfo: this.formBuilder.group({

        firstName: [this.personnelDetail.firstName, Validators.compose([Validators.required, Validators.pattern('^[a-zA-ZÀ-ŸØ-öø-ÿ]{1,30}$')])],
        lastName: [this.personnelDetail.lastName, Validators.compose([Validators.required, Validators.pattern('^[a-zA-ZÀ-ŸØ-öø-ÿ]{1,30}$')])],
        jobTitle: [this.personnelDetail.jobTitle],
        freelance: [this.personnelDetail.freelance],
        employeeCode: [this.personnelDetail.employeeCode, Validators.required],
        address: [this.personnelDetail.address.line1],
        city: [this.personnelDetail.address.city],
        country: [this.personnelDetail.address.country],
        state: [this.personnelDetail.address.state],
        zipcode: [this.personnelDetail.address.zipcode],
        telephone: [null],
        email: [null, Validators.pattern("^[a-zA-Z0-9]+(\\.[a-zA-Z0-9]{1,})*(\\.[a-zA-Z0-9]{1,})*@[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*(\\.[a-zA-Z0-9]{2,})$")],
        marketplace: [this.personnelDetail.marketplace],
        available: [this.personnelDetail.available],
        avatar: [null, Validators.required],
      }),

      functions: this.formBuilder.group({
        selectedFunction: [null, Validators.required],
        selectedRating: [null],
        selectedSkill: [null, Validators.required],
        selectedSkillRating: [null],
        selectedLanguage: [null, Validators.required],
        rateCard: this.formBuilder.array([])
        // this.formBuilder.array([]),
        // this.formBuilder.array([]),
        //this.formBuilder.array([])])

      }),
      details: this.formBuilder.group({
        bankAddress: [this.personnelDetail.staffMemberIdentityDTO.bankAddress],
        beneficiaire: [this.personnelDetail.staffMemberIdentityDTO.beneficiaire],
        birthCountry: [this.personnelDetail.staffMemberIdentityDTO.birthCountry],
        birthPlace: [this.personnelDetail.staffMemberIdentityDTO.birthPlace],
        birthProvince: [this.personnelDetail.staffMemberIdentityDTO.birthProvince],
        birthState: [this.personnelDetail.staffMemberIdentityDTO.birthState],
        dateOfBirth: [this.personnelDetail.staffMemberIdentityDTO.dateOfBirth ? new Date(this.personnelDetail.staffMemberIdentityDTO.dateOfBirth) : null],
        //documents: [this.personnelDetail.staffMemberIdentityDTO.bankAddress],
        gender: [this.personnelDetail.staffMemberIdentityDTO.gender ? this.personnelDetail.staffMemberIdentityDTO.gender : 'Male'],
        healthInsuranceName: [this.personnelDetail.staffMemberIdentityDTO.healthInsuranceName],
        marriedName: [this.personnelDetail.staffMemberIdentityDTO.marriedName],
        nationality: [this.personnelDetail.staffMemberIdentityDTO.nationality],
        numBic: [this.personnelDetail.staffMemberIdentityDTO.numBic],
        numCardPress: [this.personnelDetail.staffMemberIdentityDTO.numCardPress],
        routingAndAccounting: [this.personnelDetail.staffMemberIdentityDTO.routingAndAccounting],
        socSecNumber: [this.personnelDetail.staffMemberIdentityDTO.socSecNumber],
        talentReg: [this.personnelDetail.staffMemberIdentityDTO.talentReg],
        contractType: [this.personnelDetail.contractSettingDTO ? this.personnelDetail.contractSettingDTO.contractType : 'Freelance'],
        labourAggrement: [this.personnelDetail.labourRuleId ? this.personnelDetail.labourRuleId : null],
        hiringDate: [this.personnelDetail.hiringDate ? new Date(this.personnelDetail.hiringDate) : new Date()],
        workingTimePercent: [this.personnelDetail.workPercentage ? this.personnelDetail.workPercentage : 0],
        startTime: [this.personnelDetail.contractSettingDTO && this.personnelDetail.contractSettingDTO.dayStart ? this.getContractDates(this.personnelDetail.contractSettingDTO.dayStart) : new Date()],
        endTime: [this.personnelDetail.contractSettingDTO && this.personnelDetail.contractSettingDTO.dayEnd ? this.getContractDates(this.personnelDetail.contractSettingDTO.dayEnd) : new Date()]



      }),

      attachment: this.formBuilder.group({
        attachmentType: [null, Validators.required],
        feedByUrl: '',
        avatar: [null, Validators.required],
        url: [{ value: null, disabled: true }]
      }),

      others: this.formBuilder.group({
        documentType: [null, Validators.required],
        documentNumber: [null, Validators.required],
        expirationDate: [null, Validators.required],
        group: [null, Validators.required],

        login: [this.personnelDetail.userSettingDTO.login, Validators.required],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.compose([Validators.required, this.validateAreEqual.bind(this)])],
        selectedRole: [null, Validators.required],
        comment: [this.personnelDetail.comments]

      })

    });
    cb(fg);
  }


  /*-  To create dropdown data*/
  getPersonnelDropdownData() {
    this.httpService.callApi('getPersonnelDropdownData', {}).subscribe((response) => {
      this.dropdownData = response;
      if (this.personnelDetail) {

        let isContain: boolean = false;
        if (this.dropdownData.functions) {
          this.dropdownData.functions = this.dropdownData.functions.filter(dt => {
            let contains: boolean = true;
            this.personnelDetail.resource.functions.forEach(element => {
              if (dt.id == element.function.id) {
                contains = false;
                return contains;
              }
            })
            return contains;
          });
        }
        else {
          this.dropdownData.functions = []
        }

        if (this.dropdownData.languages) {
          this.dropdownData.languages = this.dropdownData.languages.filter(language => {
            let contains: boolean = true;
            this.personnelDetail.languages.forEach(l => {
              if (l == language) {
                contains = false;

              }
              return contains;
            });
            return contains;
          });
        } else {
          this.dropdownData.languages = [];
        }

        if (this.personnelDetail.skills) {
          this.dropdownData.skills = this.dropdownData.skills.filter(skill => {
            let contains: boolean = true;
            this.personnelDetail.skills.forEach(s => {
              if (s.domain == skill) {
                contains = false;
              }
              return contains;
            });
            return contains;
          });
        }

        if (this.personnelDetail.documents) {
          if (this.dropdownData.documentTypes) {
            this.dropdownData.documentTypes = this.dropdownData.documentTypes.filter(documentName => {
              let contains: boolean = true;
              this.personnelDetail.documents.forEach(d => {
                if (d.documentName == documentName) {
                  contains = false;
                }
                return contains;
              });
              return contains;
            });
          }
        }

        if (this.personnelDetail.role) {
          this.dropdownData.roles = this.dropdownData.roles.filter(roleName => {
            let contains: boolean = true;
            this.personnelDetail.role.forEach(r => {
              if (r.roleName == roleName) {
                contains = false;
              }
              return contains;
            });
            return contains;
          });
        }

      }
    }, error => {
      console.log('Error getstatus => ', error)
    });
  }

  initFunction(functionId: number, rating: number) {
    return this.formBuilder.group({
      id: functionId,
      rating: rating,
    });
  }
  private validateAreEqual(fieldControl: FormControl) {
    return (typeof this.personnelForm != 'undefined' && this.personnelForm.get('others').get('confirmPassword').value === this.personnelForm.get('others').get('password').value) ? null : {
      NotEqual: true
    };
  }

  /*-  To add function*/
  addFunction() {
    let selectedFunction = this.personnelForm.get('functions').get('selectedFunction').value;
    let selectedRating = this.personnelForm.get('functions').get('selectedRating').value;
    if (this.resource.functions.length == 0) {
      this.resource.functions.push({ "primaryFunction": true, "function": selectedFunction, "rating": selectedRating });
    }
    else {
      this.resource.functions.push({ "primaryFunction": false, "function": selectedFunction, "rating": selectedRating });
    }

    let controls = <FormArray>this.personnelForm.get('functions').get('rateCard');

    controls.push(this.formBuilder.array([]))
    this.dropdownData.functions.splice(this.dropdownData.functions.indexOf(selectedFunction), 1);
    this.personnelForm.get('functions').get('selectedRating').reset();
    this.personnelForm.get('functions').get('selectedFunction').reset();
  }

  /*-  To remove function*/
  removeFunction(fun: any) {
    this.resource.functions.splice(this.resource.functions.indexOf(fun), 1);
    this.validateSaveButton();
    this.dropdownData.functions.push(fun.function);
  }
  /*-  To handle event on FileChange for attachments*/
  onFileChange(event) {
    this.fileTarget = event.target || event.srcElement;
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();

      if (this.isInArray(this.allowedExtensionsForAttachment, fileExtension) && file.size < 2097152) {
        this.invalidAttachmentFormatError = null;
        this.personnelForm.get('attachment').get('avatar').setValue(file);
        this.addedAttachmentFileName = "Successfully added File:" + file.name;
      } else if (file.size > 2097152) {
        this.addedAttachmentFileName = null;
        this.personnelForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "File size should not be greater than 2MB."
      }
      else {
        this.addedAttachmentFileName = null;
        this.personnelForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "Only jpg, jpeg, png or pdf  format allowed!!"
      }


    }
  }

  /*-  To handle event on  ProfilePictureChange*/
  onProfilePictureChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();


      if (this.isInArray(this.allowedExtensionsForPhoto, fileExtension) && file.size < 2097152) {
        this.profilePictureName = file.name;
        this.addedPictureNameMessage = "Successfully added File:" + file.name;
        this.invalidPhotoFormatError = null;
        this.personnelForm.get('personnelInfo').get('avatar').setValue(file);
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
          let target: any = event.target; //<-- This (any) will tell compiler to shut up!
          this.pictureUrl = target.result;
        }
      }
      else if (file.size > 2097152) {
        this.profilePictureName = null;
        this.addedPictureNameMessage = null;
        this.personnelForm.get('personnelInfo').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "File size should not be greater than 2MB."
      } else {
        this.profilePictureName = null;
        this.addedPictureNameMessage = null;
        this.personnelForm.get('personnelInfo').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "Only jpeg, jpg or png format allowed!!"
      }

    }
  }

  /*--To change primary function--*/
  changePrimary(obj: any, changeFor: string) {
    switch (changeFor) {
      case 'Rate':
        {
          this.resource.functions.forEach(fun => {
            if (obj.function.id != fun.function.id) {
              fun.rateSelected = false;
            }
            obj.rateSelected = true;
          });
          break;

        }
      case 'Function':
        {
          this.resource.functions.forEach(fun => {
            if (obj.function.id != fun.function.id) {
              fun.primaryFunction = false;
            }
            obj.primaryFunction = true;
          });
          break;

        }
      case 'Telephone':
        {
          this.telephones.forEach(tel => {
            if (obj.id) {
              if (obj.id != tel.id) {
                tel.primaryTelephone = false;
              }
            } else {
              if (obj.telephone != tel.telephone) {
                tel.primaryTelephone = false;
              }
            }

            obj.primaryTelephone = true;
          });
          break;
        }
      case 'Email':
        {
          this.emails.forEach(e => {
            if (obj.id) {
              if (obj.id != e.id) {
                e.primaryEmail = false;
              }
            } else {
              if (obj.email != e.email) {
                e.primaryEmail = false;
              }
            }
            obj.primaryEmail = true;
          });
          break;
        }


    }
  }



  // /*-  To remove molestone*/
  // removeMilestone(milestone: any) {
  //   this.milestones.splice(this.milestones.indexOf(milestone), 1);
  //   this.dropdownData.milestones.push(milestone.type);
  // }

  // /*-  To set features on changes*/
  // setfeatureDescription(event: any, feature: any) {
  //   feature.description = event.target.value;
  // }


  /*-  To create JSON for saving equipment.*/
  getJSONForSavePersonnel(): any {
    let id = null;
    let version = null;
    if (this.personnelDetail) {
      id = this.personnelDetail.id;
      version = this.personnelDetail.version;
    }



    let equipmentData = {
      "id": id,
      "version": version,
      "firstName": this.personnelForm.get('personnelInfo').get('firstName').value,
      "lastName": this.personnelForm.get('personnelInfo').get('lastName').value,
      "employeeCode": this.personnelForm.get('personnelInfo').get('employeeCode').value,
      "freelance": this.personnelForm.get('details').get('contractType').value === 'Freelance' ? true : false,
      "role": this.assignedRoles,
      "marketplace": this.personnelForm.get('personnelInfo').get('marketplace').value,
      "available": this.personnelForm.get('personnelInfo').get('available').value,
      "languages": this.languages,
      "documents": this.documents,
      "jobTitle": this.personnelForm.get('personnelInfo').get('jobTitle').value,
      "groupName": this.groups,
      "comments": this.personnelForm.get('others').get('comment').value,
      "removePhoto": this.removePhoto,

      "address": {
        "id": this.personnelDetail && this.personnelDetail.address ? this.personnelDetail.address.id : null,
        "line1": this.personnelForm.get('personnelInfo').get('address').value,
        "zipcode": this.personnelForm.get('personnelInfo').get('zipcode').value,
        "city": this.personnelForm.get('personnelInfo').get('city').value,
        "state": this.personnelForm.get('personnelInfo').get('state').value,
        "country": this.personnelForm.get('personnelInfo').get('country').value
      },
      "skills": this.skills,
      "staffMemberIdentityDTO": {
        "gender": this.personnelForm.get('details').get('gender').value,
        "dateOfBirth": this.personnelForm.get('details').get('dateOfBirth').value,
        "birthPlace": this.personnelForm.get('details').get('birthPlace').value,
        "birthState": this.personnelForm.get('details').get('birthState').value,
        "birthCountry": this.personnelForm.get('details').get('birthCountry').value,
        "socSecNumber": this.personnelForm.get('details').get('socSecNumber').value,

        "healthInsuranceName": this.personnelForm.get('details').get('healthInsuranceName').value,
        "talentReg": this.personnelForm.get('details').get('talentReg').value,
        "routingAndAccounting": this.personnelForm.get('details').get('routingAndAccounting').value,
        "numBic": this.personnelForm.get('details').get('numBic').value,
        "bankAddress": this.personnelForm.get('details').get('bankAddress').value,
        "beneficiaire": this.personnelForm.get('details').get('beneficiaire').value,
        "nationality": this.personnelForm.get('details').get('nationality').value,
        "marriedName": this.personnelForm.get('details').get('marriedName').value,
        "birthProvince": this.personnelForm.get('details').get('birthProvince').value,
        "numCardPress": this.personnelForm.get('details').get('numCardPress').value
      },
      "resource": this.resource,
      "userSettingDTO": {
        "emails": this.emails,
        "telephones": this.telephones,
        "login": this.personnelForm.get('others').get('login').value,
        "password": this.personnelForm.get('others').get('password').value,
        "confirmPassword": this.personnelForm.get('others').get('confirmPassword').value,
      },
      "contractSettingDTO": {
        "contractType": this.personnelForm.get('details').get('contractType').value,
        "convention": this.personnelForm.get('details').get('labourAggrement').value,

        "dayStart": this.personnelForm.get('details').get('startTime').value,
        "dayEnd": this.personnelForm.get('details').get('endTime').value,
      },
      "hiringDate": this.personnelForm.get('details').get('hiringDate').value,
      "workPercentage": this.personnelForm.get('details').get('workingTimePercent').value,
      "labourRuleId": parseInt(this.personnelForm.get('details').get('labourAggrement').value)
    }
    return equipmentData;

  }

  /*-  To save equipment*/
  savePersonnel() {

    let body = this.getJSONForSavePersonnel();
    this.httpService.callApi('savePersonnel', { body: body }).subscribe((response) => {
      this.uploadPicture(response.id);
    }, error => {
      this.toastr.error(error.error.message, 'Personnel');
      console.log('Error getstatus => ', error)
    });
  }

  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  /*-  To upload picture*/
  uploadPicture(personnelId: number) {
    if (this.personnelForm.get('personnelInfo').get('avatar').value) {
      let body = new FormData();
      body.append('discriminator', 'person');
      body.append('fileContent', this.personnelForm.get('personnelInfo').get('avatar').value);
      this.httpService.callApi("uploadPicture", { body: body, pathVariable: personnelId }).subscribe((respone) => {
        this.saveAttachment(personnelId, 0);
      }, (error) => {
        console.log('error ', error)
      });
    } else {
      this.saveAttachment(personnelId, 0);
    }
  }


  /*-  To upload attachments*/
  saveAttachment(personnelId: number, index: number): string {
    if (index >= this.attachments.length) {
      if (this.removedAttachments.length > 0) {
        this.deleteAttcahments();
      } else {
        this.closeModalEvent.emit(false);
        this.toastr.success('Successfully Saved', 'Personnel');
      }

      return;
    }
    let element = this.attachments[index];
    if (!element.id) {
      let body = new FormData();
      body.append(element.feedByUrl == 'true' ? 'url' : 'fileContent', element.avatar);
      body.append('attachmentType', element.type);
      body.append('isFeedByUrl', element.feedByUrl);
      body.append('discriminator', 'person');
      this.httpService.callApi("uploadAttachment", { body: body, pathVariable: personnelId }).subscribe((respone) => {

        this.saveAttachment(personnelId, ++index);
      }, (error) => {

        this.toastr.error(error.error.message, 'Personnel');
        console.log('error ', error)
      });
    } else {

      this.saveAttachment(personnelId, ++index);
    }
  }

  deleteAttcahments() {
    let pathVariable: string = '/' + this.personnelDetail.id + '/person';
    this.httpService.callApi("deleteAttachments", { pathVariable: pathVariable, body: this.removedAttachments }).subscribe((responce) => {
      this.toastr.success('Successfully Saved', 'Personnel');
      this.closeModalEvent.emit(false);
    }, (error) => {

    });
  }

  /*-To send an event to list and edit parent components on close modal. -*/
  sendCloseEventToEditOrListComponent() {
    if (!this.isValidPeronnnel) {
      if (confirm("Incomplete form! Do you want to close it ?")) {
        this.closeModalEvent.emit(false);
      }
    }
    else {
      if (confirm("Do you want to save the changes ?")) {
        this.savePersonnel();

      } else {
        this.closeModalEvent.emit(false);
      }
    }
  }



  /*-To delete personnel-*/
  deletePersonnel($event) {
    if ($event) {
      this.httpService.callApi("deletePersonnel", { pathVariable: this.personnelDetail.id }).subscribe((response) => {
        this.toastr.success('Successfully Deleted', 'Personnel');
        this.router.navigate(['/teamium/staff-list']);
      }, (error) => {
        this.toastr.error('Error while deletion' + error.error.message, 'Personnel');
        console.log(error.error);
      });

    }
  }
  /*To close delete Modal*/
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  /*-To Add different values for Email,Telephone,Function,Skill,Language,Attachment,Role,Group,Document-*/
  addContents(addTo: string) {
    switch (addTo) {
      case 'Email':
        {
          if (this.emails.length == 0) {
            this.emails.push({ "email": this.personnelForm.get('personnelInfo').get('email').value, "primaryEmail": true });
          } else {
            this.emails.push({ "email": this.personnelForm.get('personnelInfo').get('email').value, "primaryEmail": false });
          }

          this.personnelForm.get('personnelInfo').get('email').reset();
          break;
        }
      case 'Telephone':
        {
          if (this.telephones.length == 0) {
            this.telephones.push({ "telephone": this.personnelForm.get('personnelInfo').get('telephone').value, "primaryTelephone": true });
          }
          else {
            this.telephones.push({ "telephone": this.personnelForm.get('personnelInfo').get('telephone').value, "primaryTelephone": false });
          }

          this.personnelForm.get('personnelInfo').get('telephone').reset();
          break;
        }
      case 'Function':
        {

          this.addFunction();
          break;
        }
      case 'Skill':
        {
          let selectedSkill = this.personnelForm.get('functions').get('selectedSkill').value
          this.skills.push({ "domain": selectedSkill, "rating": this.personnelForm.get('functions').get('selectedSkillRating').value });
          this.dropdownData.skills.splice(this.dropdownData.skills.indexOf(selectedSkill), 1);
          this.personnelForm.get('functions').reset();
          break;
        }
      case 'Language':
        {
          let selectedLanguage = this.personnelForm.get('functions').get('selectedLanguage').value;
          this.languages.push(selectedLanguage);
          this.dropdownData.languages.splice(this.dropdownData.languages.indexOf(selectedLanguage), 1);
          this.personnelForm.get('functions').reset();
          break;
        }
      case 'Attachment':
        {
          let fileExtention = '';
          if (!this.personnelForm.get('attachment').get('feedByUrl').value) {
            fileExtention = this.personnelForm.get('attachment').get('avatar').value.name.split('.').pop().toLowerCase();
          }
          this.attachments.push({ 'type': this.personnelForm.get('attachment').get('attachmentType').value, 'extension': fileExtention, 'feedByUrl': this.personnelForm.get('attachment').get('feedByUrl').value ? 'true' : 'false', 'avatar': this.personnelForm.get('attachment').get(this.personnelForm.get('attachment').get('feedByUrl').value ? 'url' : 'avatar').value })
          this.personnelForm.get('attachment').reset();
          this.fileTarget.value = "";
          this.addedAttachmentFileName = null;
          break;
        }
      case 'Role':
        {
          let selectedRole = this.personnelForm.get('others').get('selectedRole').value;
          this.assignedRoles.push({ "roleName": selectedRole });
          this.dropdownData.roles.splice(this.dropdownData.roles.indexOf(selectedRole), 1)

          this.personnelForm.get('others').get('selectedRole').reset();
          break;
        }
      case 'Group':
        {
          let selectedGroup = this.personnelForm.get('others').get('group').value;
          this.groups.push(selectedGroup);
          this.personnelForm.get('others').get('group').reset();
          this.dropdownData.groups.splice(this.dropdownData.groups.indexOf(selectedGroup), 1)


          break;
        }
      case 'Document':
        {
          let documentType = this.personnelForm.get('others').get('documentType').value;
          let expirationDate = this.personnelForm.get('others').get('expirationDate').value
          this.documents.push({
            "type": documentType,
            "number": this.personnelForm.get('others').get('documentNumber').value,
            "expirationDate": expirationDate
          });
          this.dropdownData.documentTypes.splice(this.dropdownData.documentTypes.indexOf(documentType), 1);
          this.personnelForm.get('others').get('documentType').reset();
          this.personnelForm.get('others').get('documentNumber').reset();
          this.personnelForm.get('others').get('expirationDate').reset();
          break;
        }
    }

  }

  removeContents(obj: any, removeFrom: String) {
    switch (removeFrom) {
      case 'Email':
        {
          this.emails.splice(this.emails.indexOf(obj), 1);
          if (this.emails.length < 1) {
            this.isValidPeronnnel = false;
          }
          break;
        }
      case 'Telephone':
        {
          this.telephones.splice(this.telephones.indexOf(obj), 1);
          if (this.telephones.length < 1) {
            this.isValidPeronnnel = false;
          }
          break;
        }
      case 'Function':
        {
          this.removeFunction(obj);

          break;
        }
      case 'Skill':
        {
          this.skills.splice(this.skills.indexOf(obj), 1);
          this.dropdownData.skills.push(obj.domain);
          break;
        }
      case 'Language':
        {
          this.languages.splice(this.languages.indexOf(obj), 1);
          this.dropdownData.languages.push(obj);
          break;
        }
      case 'Document':
        {
          this.documents.splice(this.documents.indexOf(obj), 1);
          this.dropdownData.documentTypes.push(obj.type);
          break;
        }
      case 'Role':
        {
          this.assignedRoles.splice(this.assignedRoles.indexOf(obj), 1);
          this.dropdownData.roles.push(obj.roleName);
          break;
        }
      case 'Attachment':
        {
          if (obj.id) {
            this.removedAttachments.push(obj.id);
          }

          this.attachments.splice(this.attachments.indexOf(obj), 1);
          break;
        }
      case 'Group':
        {

          this.groups.splice(this.groups.indexOf(obj), 1);
          this.dropdownData.groups.push(obj);
          break;
        }
    }

  }

  getAttachmentImage(attachment) {
    let imageUrl = '';
    if (attachment.feedByUrl.toString() == 'true') {
      imageUrl = '../../assets/img/url.png';
    } else if (attachment.extension == 'pdf') {
      imageUrl = '../../assets/img/pdf_logo.jpg';
    } else {
      imageUrl = '../../assets/img/image_icon.png';
    }
    return imageUrl;
  }

  clearSpace(form, fieldName) {
    form.get(fieldName).setValue(form.get(fieldName).value.trim());
  }

  /*To validate personnel */
  validateSaveButton() {

    this.isValidPeronnnel = this.personnelForm.get('personnelInfo').get('firstName').valid && this.personnelForm.get('personnelInfo').get('lastName').valid && this.personnelForm.get('personnelInfo').get('employeeCode').value && this.emails.length > 0 && this.telephones.length > 0 && this.resource.functions.length > 0;
    if (this.personnelForm.get('others').get('login').value && this.personnelForm.get('others').get('password').value) {
      if (this.personnelForm.get('others').get('password').value != this.personnelForm.get('others').get('confirmPassword').value) {

        this.isValidPeronnnel = false;
      }
    }
    if (this.assignedRoles.length > 0 && !this.personnelForm.get('others').get('login').value) {
      this.isValidPeronnnel = false;
    }

  }

  /*To disable next button */
  // validateNextButton() {

  //   if (this.selectedStep == 1) {
  //     this.canGoToNext = this.personnelForm.get('personnelInfo').get('firstName').valid && this.personnelForm.get('personnelInfo').get('lastName').valid && this.personnelForm.get('personnelInfo').get('employeeCode').valid && this.emails.length > 0 && this.telephones.length > 0;
  //   }
  //   if (this.selectedStep == 2) {
  //     this.canGoToNext = this.resource.functions.length > 0;
  //   }
  // }
  getContractDates(obj: any): Date {
    let time = obj.split(":");
    let mydate = new Date();
    mydate.setHours(time[0]);
    mydate.setMinutes(time[1]);
    return mydate;
  }

  onlyNumber = (evt, value) => {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    value = value + evt.key;
    if (parseInt(value) > 100) {
      return false;
    }
    return true;
  }

  removePicture() {
    this.personnelForm.get('personnelInfo').get('avatar').setValue(null);
    this.pictureUrl = null;
    this.profilePictureName = 'No file chosen';
    this.addedPictureNameMessage = null;
    this.removePhoto=true;
  }

}
