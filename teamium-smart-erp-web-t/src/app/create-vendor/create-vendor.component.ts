import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { forkJoin } from "rxjs/observable/forkJoin";
import { element } from 'protractor';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.scss']
})
export class CreateVendorComponent implements OnInit {
 
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Input() selectedVendor: any;
  selectedStep: number = 1;
  vendorForm: FormGroup;

  dropdownData: any = [];
  dropdownDataAPI: any;
  extraDropdownDataAPI: any = [];
 
  contactList: any = [];
  selectedContact:any='';

  shwoRateCard: boolean = false;
  blockedPanel: boolean = false;
  isBillingAddressSame:boolean = false;
  channel: any = [];
  channelFormat: any=[];
  selectedChannels:any;
  accoutingCodeList:any=[];

  prifixList:any=["Mr.","Ms.","Miss."];
  allowedExtensionsForPhoto = ['jpg', 'jpeg'];

  pictureUrl: string;
  logoName: String;
  invalidPhotoFormatError: string = null;
  file:any=null;

  

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private commonUtilService: CommonUtilService, private toastr: ToastrService, private router: Router) {
    this.vendorForm = this.createFormGroup();
   }


  ngOnInit() {

    this.dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    this.extraDropdownDataAPI = this.httpService.callApi('getPersonalDropdownData', {});
    this.blockedPanel=true;
    this.getDropDownData();

    console.log("selectedClient======>",this.selectedVendor)
  
    if(this.selectedVendor && this.selectedVendor.hasOwnProperty('id')) {
      this.setFormData();
    }
    else{
      this.addNewContact()
    }

    this.vendorForm.get("rateCard").get("showRate").valueChanges.subscribe((value) => {
      this.shwoRateCard = value;
    })


    this.blockedPanel=false;
  }

  

  getDropDownData() {
    this.httpService.callApi('getVendorDropdown', {}).subscribe((response) => {
      this.dropdownData = response;

      try{
        let existingAccountingCode = [];

        if(this.selectedVendor && this.selectedVendor.accoutingCode){
          this.selectedVendor.accoutingCode.forEach(element => {
            existingAccountingCode.push(element.type)
          });
    
          let filteredAccountingCode = [];
          filteredAccountingCode = this.dropdownData.accountingCodes.filter(element=>{
            if(existingAccountingCode.indexOf(element)==-1){
              return element;
            }
          })
    
          console.log("filteredAccountingCode",filteredAccountingCode)
          console.log("this.dropdownData.accountingCode",this.dropdownData.accountingCode)
          this.dropdownData.accountingCodes = filteredAccountingCode || [];
        }
      }
      catch(err){
        console.log(err)
      }

      



    }, error => {
      this.toastr.error(error.error.message, 'Vendor');
      console.log('Error getstatus => ', error)
    });
  }
 

  closeVendorEditModal() {
    if(confirm("Are you sure to close and save?")) {
      this.saveVendor()
      // this.closeModalEvent.emit(false);
    } else {
      this.closeModalEvent.emit(false);
    }
  }




  setSelectedStep(stepNumber: number) {
    this.selectedStep = stepNumber;
  }
 

  sendCloseEventToEditOrListComponent() {
    if (confirm("Are you sure to close and save?")) {
      this.closeModalEvent.emit(false);

    } else {
      this.closeModalEvent.emit(false);
    }
  }

  /*-  To create from for new equipment. */
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      contact: this.formBuilder.group({
        companyName: [null],
        accountNumber: [null],
        domain: [null]
      }),
      address: this.formBuilder.group({
        address: [null],
        city: [null],
        zip: [null],
        country: [null],
        telephone: [null],
        web: [null],
        stateTaxId: [null],
        taxNumber: [null],

        bAddress: [null],
        bCity: [null],
        bZip: [null],
        bCountry: [null]
      }),

      rateCard:this.formBuilder.group({
        label: [null],
        currency: [null],
        unitPrice: [null],
        basis: [null],
        quantitySale: [null],
        unitCost: [null],
        baseMin: [null],
        floorUnitPrice: [null],
        showRate: [null]
      }),
      other: this.formBuilder.group({
        language: [null],
        currency: [null],
        accountNumber: [null],
        tax: [null],
        reconcileId:[null],
        description:[null],
        selectedChannel: [null],
        selectedChannelFormat: [null, Validators.required],
        code: [null, Validators.required],
        value: [null, Validators.required]
      }),
      itCredentials:this.formBuilder.group({
        selectedGroup:[null],
        loginId:[null],
        password:[null],
        confirmPasswprd:[null],
        selectedContract:[null]
      })
    }); 
  }


  setFormData = () => {
        
    try{
      // set contact data
      let selectedVendor=this.selectedVendor || {};
      this.vendorForm.get('contact').get('companyName').setValue(selectedVendor.name);
      this.vendorForm.get('contact').get('accountNumber').setValue(selectedVendor.accountNumber);
      this.vendorForm.get('contact').get('domain').setValue(selectedVendor.domain);
      this.contactList = selectedVendor.contacts || [];

      // set address data
      let addressObj = selectedVendor.address || {};
      this.vendorForm.get('address').get('address').setValue(addressObj.line1);
      this.vendorForm.get('address').get('city').setValue(addressObj.city);
      this.vendorForm.get('address').get('zip').setValue(addressObj.zipcode);
      this.vendorForm.get('address').get('country').setValue(addressObj.country);

      
      this.vendorForm.get('address').get('telephone').setValue(selectedVendor.number);
      this.vendorForm.get('address').get('web').setValue(selectedVendor.website);
      this.vendorForm.get('address').get('stateTaxId').setValue(selectedVendor.companyNumber);
      this.vendorForm.get('address').get('taxNumber').setValue(selectedVendor.vatNumber);

      // setting billing address 

      this.isBillingAddressSame = selectedVendor.sameBillingAddress || false;

      let billingAddress = selectedVendor.billingAddress || {};
      this.vendorForm.get('address').get('bAddress').setValue(billingAddress.line1);
      this.vendorForm.get('address').get('bCity').setValue(billingAddress.city);
      this.vendorForm.get('address').get('bZip').setValue(billingAddress.zipcode);
      this.vendorForm.get('address').get('bCountry').setValue(billingAddress.country);


      // set other data
      this.vendorForm.get('other').get('language').setValue(selectedVendor.language);
      this.vendorForm.get('other').get('currency').setValue(selectedVendor.currency); 
      this.vendorForm.get('other').get('description').setValue(selectedVendor.comments); 
      this.accoutingCodeList = selectedVendor.accoutingCode || [];
      this.pictureUrl = this.selectedVendor.logo != null ? this.selectedVendor.logo.url : '';

    }
    catch(err){
      console.log(err)
    }
  }

  saveVendor() {
    let body = this.getJSONToSaveVendor();
    this.httpService.callApi('saveVendor', { body: body }).subscribe((response) => {
      this.uploadPicture(response.id, () => {
        this.toastr.success("Successfully Saved", 'Vendor');
        this.closeModalEvent.emit(false);
      });
    }, error => {
      this.toastr.error(error.error.message, 'Vendor');
      console.log('Error getstatus => ', error)
    });
  }

  uploadPicture(vendorId: number, cb) {
    try{
      if (this.file!=undefined &&  this.file != null) {
        let body = new FormData();
        body.append('discriminator', 'company');
        body.append('fileContent', this.file);
        this.httpService.callApi("uploadPicture", { body: body, pathVariable: vendorId }).subscribe((respone) => {
          cb();
        }, (error) => {
          console.log('error ', error)
          cb();
        });
      }
      else{
        cb();
      }
    }
    catch(err){
      console.log('error ', err)
      cb();
    }
    
  }


  getJSONToSaveVendor(): any {
    try {    
      let formValue = this.vendorForm.getRawValue();
      console.log("formValue",formValue)
      let id = null;
      let version = null;
      if (this.selectedVendor && this.selectedVendor.hasOwnProperty('id')) {
        id = this.selectedVendor.id;
        version = this.selectedVendor.version;
      }
      let numbers = new Map();
      let vendorForm = this.vendorForm; 
      let allContacts=vendorForm.get('contact').value;
      // if(allContacts.length>0 && this.selectedMainContact==undefined)
      //   this.selectedMainContact=0;
      // let mainContactData=allContacts[this.selectedMainContact];
      // allContacts.splice(this.selectedMainContact, 1); 

      let vendorData = {
        "id": id,
        "version": version,
        "name": vendorForm.get('contact').get('companyName').value,
        "accountNumber": vendorForm.get('contact').get('accountNumber').value,
        "domain":vendorForm.get('contact').get('domain').value,
        "profile":"",
        "type":"",
        "address": {
          "line1": vendorForm.get('address').get('address').value,
          "city": vendorForm.get('address').get('city').value,
          "country": vendorForm.get('address').get('country').value || null,
          "zipcode": vendorForm.get('address').get('zip').value

        },

        "number": vendorForm.get('address').get('telephone').value,
        "website": vendorForm.get('address').get('web').value,
        "companyNumber": vendorForm.get('address').get('stateTaxId').value,
        "vatNumber": vendorForm.get('address').get('taxNumber').value,
        // "company": this.selectedCustomer,
        "language": vendorForm.get('other').get('language').value,
        "currency": vendorForm.get('other').get('currency').value,
        // "taxNumber": this.budgetingForm.get('other').get('taxNumber').value,
        "tax": vendorForm.get('other').get('tax').value,
        "reconcileId": vendorForm.get('other').get('reconcileId').value,
        "comments": vendorForm.get('other').get('description').value,
        "channels":"",//Array.from(this.selectedChannels.values()),
        "accoutingCode":this.accoutingCodeList || [],
        "mainContact": null//mainContactData,
      }

      this.contactList.forEach(contact => {
        if(contact && contact.isNewCreated) {
          delete contact['isNewCreated']; 
          delete contact['id']; 
        }

      });
      vendorData["contacts"] = this.contactList;
      let mainContactObj = this.selectedContact;
      vendorData["mainContact"] = mainContactObj || null;
      vendorData["billingAddress"] = this.getBillingAddress() || null;      
      return vendorData;
    }
    catch(err) {
      console.log("cought error",err)
    }
  }

  getBillingAddress=()=>{
    try{
      let billingAddress = {};
      let vendorForm = this.vendorForm; 
      if(this.isBillingAddressSame) {
        billingAddress= {
          "line1": vendorForm.get('address').get('address').value,
          "city": vendorForm.get('address').get('city').value,
          "country": vendorForm.get('address').get('country').value,
          "zipcode": vendorForm.get('address').get('zip').value
        }
      }
      else {
        billingAddress= {
          "line1": vendorForm.get('address').get('bAddress').value,
          "city": vendorForm.get('address').get('bCity').value,
          "country": vendorForm.get('address').get('bCountry').value,
          "zipcode": vendorForm.get('address').get('bZip').value
        }
      }
      return billingAddress;
    }
    catch(err){
      console.log(err)
    }
  }

  showForm=()=> {
    console.log(this.vendorForm)
    console.log(this.contactList)
  }

  addNewContact = () => {
    var randomNumber = Math.floor(Math.random() * 255);
    let newContact = {id:randomNumber,isNewCreated:true,numbers:{},courtesy:{}};
    if(this.contactList.length == 0){
      newContact['main']=true;
    }
    else {
      newContact['main']=false;
    }
    this.contactList.push(newContact);
  }

  onContactChange = (contactObject,key,newValue) =>{
    contactObject[key]=newValue || '';
  }

  

  onContactNumbersChange = (contactObject,key,newValue)=> {
    contactObject['numbers'][key]=newValue || '';
  }

  onSelectPrefix(contactObject,newValue) {
    try{
      if(contactObject['courtesy']){
        contactObject['courtesy']['key']= newValue || '';
        contactObject['courtesy']['label']= newValue || '';
      }
      else {
        contactObject['courtesy'] = {};
        contactObject['courtesy']['key']= newValue || '';
        contactObject['courtesy']['label']= newValue || '';
      }
    }
    catch(err){
      console.log(err)
    }
  }

  removeContent= (contactObject) => {
    if(this.contactList.length==1){
      this.toastr.warning('Atleast one contact is required');      
      return
    }
    let index=this.contactList.indexOf(contactObject);
    if(index>=0){
      this.contactList.splice(index,1)
    }

  }

  onSelectContact = (selectedContact) =>{
    this.contactList.forEach(contact=>{
      if(selectedContact.id != contact.id)
        contact.main = false;
    })
    if(selectedContact.main == true) {
      selectedContact.main=false
    }
    else{
      selectedContact.main=true
    }
    this.selectedContact = selectedContact;
    console.log(this.contactList)
  }


  addAccounting() {
    let formValue = this.vendorForm.getRawValue();
    let accountingCode = formValue.other.code;
    let accountingValue = formValue.other.value;
    this.addAccountData(accountingCode, accountingValue);
  }

  addAccountData(accountingCode, accountingValue) {
    try{    
      let isExist = false;
      this.accoutingCodeList.forEach(element => {
        if(element.type==accountingCode){
          isExist=true;
        }
      });

      if(isExist == false){
        this.accoutingCodeList.push({
          type: accountingCode,
          value: accountingValue
        })


        let index =  this.dropdownData.accountingCodes.indexOf(accountingCode);
        this.dropdownData.accountingCodes.splice(index,1)
        this.vendorForm.get("other").get("code").reset();
        this.vendorForm.get("other").get("value").reset();
      }
    }
    catch(err){
      console.log(err)
    }
  }
 
  removeAccounting(accounting: any) {
    try{
      this.accoutingCodeList.splice(this.accoutingCodeList.indexOf(accounting), 1);
      this.dropdownData.accountingCodes.push(accounting.type);
    }
    catch(err){
      console.log(err)
    }
    
  }

  onLogoPictureChange(event) {
    try{
      if (event.target.files.length > 0) {
        let file = event.target.files[0];
        let fileExtension = file.name.split('.').pop().toLowerCase();
  
        if (this.isInArray(this.allowedExtensionsForPhoto, fileExtension) && file.size < 2097152) {
          this.logoName = "Successfully added File:" + file.name;
          this.file = file;
          this.invalidPhotoFormatError = null;
          // console.log(this.vendorForm.get('address').get('avatar').value);
          // this.vendorForm.get('contact').get('avatar').setValue(file);
          var reader = new FileReader();

          reader.readAsDataURL(event.target.files[0]); // read file as data url

          reader.onload = (event) => { // called once readAsDataURL is completed
            let target: any = event.target; //<-- This (any) will tell compiler to shut up!
            this.pictureUrl = target.result;
          }
        }
        else if (file.size > 2097152) {
          this.logoName = null;
          this.file =null;
          // this.budgetingForm.get('address').get('avatar').setValue(null);
          this.invalidPhotoFormatError = "File size should not be greater than 2MB."
        } else {
          this.logoName = null;
          this.file =null;
          // this.budgetingForm.get('address').get('avatar').setValue(null);
          this.invalidPhotoFormatError = "Only jpeg or jpg format allowed!!"
        }
      }
    }
    catch(err){
      console.log(err)
    }
  }


  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  getValues(){
    return Array.from(this.selectedChannels.entries());
  }

  removeChannel(ch){
    this.selectedChannels.delete(ch);
  }

  addChannel(){
    let channel = this.vendorForm.get('rateCard').get('selectedChannel').value;
    let format = this.vendorForm.get('rateCard').get('selectedChannelFormat').value;
    this.selectedChannels.set(channel.id,channel);
  }
  
}
