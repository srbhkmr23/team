import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { Router } from '../../../node_modules/@angular/router';
import { forkJoin } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
 
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Input() projectDetail: any;
  @Input() selectedClient: any;
  selectedStep: number = 1;
  budgetingForm: FormGroup;
  hasContacts: boolean = false;
  accountDropdownData: any;
  shwoRateCard: boolean = false;
  selectedMainContact: number = 0;
  productions: any = ['Agency', 'Director', 'Editor', 'Producer'];
  interests = ['Lead','Client'];
  dropdownData: any = [];
  dropdownDataAPI: any;
  extraDropdownData: any = [];
  extraDropdownDataAPI: any = [];
  channel: any = [];
  channelFormat: any = [];
  selectedChannels: any;
  milestones: any = [];
  selectedCustomer: any;
  contacts: any = [];
  attachments: any = [];
  removedAttachments: any = [];
  managedByAPI: any;
  addedAttachmentFileName: string;
  allowedExtensionsForAttachment = ['jpg', 'png', 'pdf'];
  invalidAttachmentFormatError: string;
  modalHeading = "Create Budget";
  contactDropDown: any = [];
  accoutingCode: any = [];
  blockedPanel: boolean = false;
  pictureUrl: string;
  allowedExtensionsForPhoto = ['jpg', 'jpeg'];
  logoName: String;
  invalidPhotoFormatError: string = null;
  isBillingAddressSame:boolean = false;
  contactList: any = [];
  selectedContact:any='';

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private commonUtilService: CommonUtilService, private toastr: ToastrService, private router: Router) { }


  ngOnInit() {
    this.selectedChannels = new Map();

    this.loadData();

    this.budgetingForm = this.createClientFormGroup();

    this.budgetingForm.get("rateCard").get("showRate").valueChanges.subscribe((value) => {
      this.shwoRateCard = value;
    })

    if (this.selectedClient) {
      this.pictureUrl = this.selectedClient.logo != null ? this.selectedClient.logo.url : '';
      if (this.selectedClient.rateCard.length > 0) {
        this.shwoRateCard = true;
        this.budgetingForm.get("rateCard").get("showRate").setValue(true);
      }
      let contactArray = this.budgetingForm.get('contacts') as FormArray;
      this.accoutingCode = this.selectedClient.accoutingCode;
      this.loadSavedChannels();
      // if(this.selectedClient["mainContact"]){
      //   contactArray.push(this.copyContacts(this.selectedClient["mainContact"]));
      //   // this.selectedMainContact=0;
      //   this.hasContacts=true;
      // }
      if (this.selectedClient["contacts"] && this.selectedClient["contacts"].length > 0) {



        // for (let c of this.selectedClient["contacts"],) {
        //   contactArray.push(this.copyContacts(c));
        //   this.hasContacts=true;
        // }
        for (let _i = 0; _i < this.selectedClient["contacts"].length; _i++) {
          let con = this.selectedClient["contacts"][_i];
          contactArray.push(this.copyContacts(con, _i));
          this.hasContacts = true;
        }


        // this.selectedClient["contacts"].forEach(function (value, index) {
        //   contactArray.push(this.copyContacts(value,index));
        //   this.hasContacts=true;
        // });

      }

    }
    if (!this.hasContacts) {
      let contactArray = this.budgetingForm.get('contacts') as FormArray;
      contactArray.push(this.createContacts());

    }
  }

  setSelectedStep(stepNumber: number) {
    this.selectedStep = stepNumber;
  }
  /*-To send an event to list and edit parent components on close modal. -*/
  closeClientEditModal() {
    if (confirm("Are you sure to close and save?")) {
      let body = this.getJSONToSaveClient();
      // console.log(body);
      this.saveClient();
      // this.closeModalEvent.emit(false);
    } else {
      this.closeModalEvent.emit(false);
    }

  }

  /*-  To save client*/
  saveClient() {
    let body = this.getJSONToSaveClient();
    // console.log(body);
    this.httpService.callApi('saveClient', { body: body }).subscribe((response) => {
      this.uploadPicture(response.id, () => {
        this.closeModalEvent.emit(false);
        this.toastr.success("Successfully Saved", 'Client');
      });
    }, error => {
      this.toastr.error(error.error.message, 'Client');
      console.log('Error getstatus => ', error)
    });
  }

  loadData() {
    this.httpService.callApi('getClientDropdown', {}).subscribe((response) => {
      this.dropdownData = response;
      this.productions = response.domain || []

      try{
        let existingAccountingCode = [];

        if(this.selectedClient && this.selectedClient.accoutingCode){
          this.selectedClient.accoutingCode.forEach(element => {
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
      this.toastr.error(error.error.message, 'Client');
      console.log('Error getstatus => ', error)
    });
  }
  loadSavedChannels() {
    for (let chan of this.selectedClient.channels) {
      this.selectedChannels.set(chan.id, chan);
    }
  }






  getContactDropdown() {
    this.dropdownData.clients.forEach(client => {
      if (client.id == this.selectedCustomer) {
        this.contactDropDown = client.contacts;
      }

    });
  }
 
  /*-  To create from for new equipment. */
  createClientFormGroup(): FormGroup {
    if (this.selectedClient) {
      this.isBillingAddressSame = this.selectedClient.sameBillingAddress || false;

      // console.log(' this.selectedClient => ', this.selectedClient)
      this.contactList = this.selectedClient.contacts || [];
      return this.formBuilder.group({
        basicInfo: this.formBuilder.group({
          contacts: [null],
          companyName: [this.selectedClient.name],
          production: [this.selectedClient.type],
          interest: [this.selectedClient.profile],
          mainContact: [this.selectedClient.mainContact]
        }),
        contacts: this.formBuilder.array([]),
        address: this.formBuilder.group({
          line1: [this.selectedClient.address ? this.selectedClient.address.line1 : null],
          city: [this.selectedClient.address ? this.selectedClient.address.city : null],
          zip: [this.selectedClient.address ? this.selectedClient.address.zipcode : null],
          country: [this.selectedClient.address ? this.selectedClient.address.country : null],
          telephone: [this.selectedClient.number],
          web: [this.selectedClient.website],
          taxId: [this.selectedClient.companyNumber],
          taxNumber: [this.selectedClient.vatNumber],
          avatar: [null],
          bAddress: [this.selectedClient.billingAddress?this.selectedClient.billingAddress.line1:null],
          bCity: [this.selectedClient.billingAddress?this.selectedClient.billingAddress.city:null],
          bZip: [this.selectedClient.billingAddress?this.selectedClient.billingAddress.zipcode:null],
          bCountry: [this.selectedClient.billingAddress?this.selectedClient.billingAddress.country:null]
          // billingCheck: [this.selectedClient.billingAddress],
          // billingAddress: this.formBuilder.group({
          //   line1: [this.selectedClient.billingAddress ? this.selectedClient.billingAddress.line1 : null],
          //   city: [this.selectedClient.billingAddress ? this.selectedClient.billingAddress.city : null],
          //   zipcode: [this.selectedClient.billingAddress ? this.selectedClient.billingAddress.zipcode : null],
          //   country: [this.selectedClient.billingAddress ? this.selectedClient.billingAddress.country : null],
          // })
        }),

        rateCard: this.formBuilder.group({
          label: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].label : null],
          currency: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].currency : null],
          unitPrice: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].unitPrice : null],
          basis: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].basis : null],
          quantitySale: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].quantitySale : null],
          unitCost: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].unitCost : null],
          baseMin: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].baseMin : null],
          floorUnitPrice: [this.selectedClient.rateCard.length > 0 ? this.selectedClient.rateCard[0].floorUnitPrice : null],
          showRate: [null]
        }),

        others: this.formBuilder.group({
          language: [this.selectedClient.language],
          currency: [this.selectedClient.currency],
          accountNumber: [this.selectedClient.accountNumber],
          taxNumber: [this.selectedClient.vatNumber],
          tax: [this.selectedClient.tax],
          reconcileId: [null],
          selectedChannel: [null],
          selectedChannelFormat: [null, Validators.required],
          description: [this.selectedClient.comments],

          code: [null, Validators.required],
          value: [null, Validators.required],

        }),

      });

       // setting billing address 
      
       
    }

    this.addNewContact();

    return this.formBuilder.group({


      contacts: this.formBuilder.array([]),
      basicInfo: this.formBuilder.group({
        // selectedContact: [null],
        companyName: [null],
        production: [null],
        interest: [null],

      }),
      address: this.formBuilder.group({
        line1: [null],
        city: [null],
        zip: [null],
        country: [null],
        telephone: [null],
        web: [null],
        taxId: [null],
        taxNumber: [null],

        bAddress: [null],
        bCity: [null],
        bZip: [null],
        bCountry: [null],
        avatar: [null],

        // billingCheck: [false],
        // billingAddress: this.formBuilder.group({
        //   line1: [null],
        //   city: [null],
        //   zipcode: [null],
        //   country: [null],
        // })
      }),
      rateCard: this.formBuilder.group({
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

      others: this.formBuilder.group({
        language: [null],
        currency: [null],
        accountNumber: [null],
        taxNumber: [null],
        tax: [null],
        reconcileId: [null],
        selectedChannel: [null],
        selectedChannelFormat: [null, Validators.required],
        description: [null],

        code: [null, Validators.required],
        value: [null, Validators.required],

      })

    });
  }


  /**
   * To get JSON to save Client
   */
  getJSONToSaveClient(): any {
    let formValue = this.budgetingForm.getRawValue();

    let id = null;
    let rateCardData = [];
    if (this.shwoRateCard) {
      rateCardData = [formValue.rateCard]
    }

    let version = null;
    if (this.selectedClient) {
      id = this.selectedClient.id;
      version = this.selectedClient.version;
    }
    let numbers = new Map();
    Array.from(this.selectedChannels.values());
    let allContacts = this.budgetingForm.get('contacts').value;
    // if (this.selectedMainContact)
      // allContacts[this.selectedMainContact]["main"] = true;
    // if(allContacts.length>0 && this.selectedMainContact==undefined)
    //   this.selectedMainContact=0;
    // allContacts[this.selectedMainContact].mainContact=true;
    // let mainContactData=allContacts[this.selectedMainContact];
    // allContacts.splice(this.selectedMainContact, 1); 
    let rawValue = this.budgetingForm.getRawValue();
    let address = rawValue.address;
    let billingAddress = address.billingAddress;

    // console.log(this.budgetingForm.get('address').get('billingCheck').value);
    // if (this.budgetingForm.get('address').get('billingCheck').value) {
    //   billingAddress = address;
    //   console.log("billing address");
    //   console.log(billingAddress);
    // }

    // console.log(address);
    // let isBillingAddressAvailable = false;
    let isAddressAvailable = false;

    if (address.line1 || address.city || address.country || address.zip) {
      isAddressAvailable = true;
      address.zipcode = address.zip;
    }

    // if (billingAddress.line1 || billingAddress.city || billingAddress.country || billingAddress.zipcode) {
    //   isBillingAddressAvailable = true;
    //   // address.zipcode=address.zip;
    // }


    let clientData = {
      "id": id,
      "version": version,
      "name": formValue.basicInfo.companyName,
      "profile": formValue.basicInfo.interest,
      "type": formValue.basicInfo.production,
      "address": {
        "line1": this.budgetingForm.get('address').get('line1').value,
        "city": this.budgetingForm.get('address').get('city').value,
        "country": this.budgetingForm.get('address').get('country').value || null,
        "zipcode": this.budgetingForm.get('address').get('zip').value
      },
      "billingAddress": billingAddress,
      "number": this.budgetingForm.get('address').get('telephone').value,
      "website": this.budgetingForm.get('address').get('web').value,
      "companyNumber": this.budgetingForm.get('address').get('taxId').value,
      "vatNumber": this.budgetingForm.get('address').get('taxNumber').value,
      // "company": this.selectedCustomer,
      "language": this.budgetingForm.get('others').get('language').value,
      "currency": this.budgetingForm.get('others').get('currency').value,
      "accountNumber": this.budgetingForm.get('others').get('accountNumber').value,
      // "taxNumber": this.budgetingForm.get('others').get('taxNumber').value,
      "tax": this.budgetingForm.get('others').get('tax').value,
      "reconcileId": this.budgetingForm.get('others').get('reconcileId').value,
      "comments": this.budgetingForm.get('others').get('description').value,
      "channels": Array.from(this.selectedChannels.values()),
      "accoutingCode": this.accoutingCode,

      "rateCard": rateCardData,
      // "mainContact": mainContactData,

    }

    // clientData["contacts"] = allContacts;

    this.contactList.forEach(contact => {
      if(contact && contact.isNewCreated) {
        delete contact['isNewCreated']; 
        delete contact['id']; 
      }

    });
    clientData["contacts"] = this.contactList;
    let mainContactObj = this.selectedContact;
    clientData["mainContact"] = mainContactObj || null;


    clientData["billingAddress"] = this.getBillingAddress() || null;
    return clientData;

  }


  getBillingAddress=()=>{
    try{
      let billingAddress = {};
      let budgetingForm = this.budgetingForm; 
      if(this.isBillingAddressSame) {
        billingAddress= {
          "line1": budgetingForm.get('address').get('line1').value,
          "city": budgetingForm.get('address').get('city').value,
          "country": budgetingForm.get('address').get('country').value,
          "zipcode": budgetingForm.get('address').get('zip').value
        }
      }
      else {
        billingAddress= {
          "line1": budgetingForm.get('address').get('bAddress').value,
          "city": budgetingForm.get('address').get('bCity').value,
          "country": budgetingForm.get('address').get('bCountry').value,
          "zipcode": budgetingForm.get('address').get('bZip').value
        }
      }
      return billingAddress;
    }
    catch(err){
      console.log(err)
    }
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


  createContacts(): FormGroup {
    return this.formBuilder.group({
      firstName: [null],
      lastName: [null],
      jobTitle: [null],
      mainContact: [0],
      numbers: this.formBuilder.group({
        telephone: [null],
        mobile: [null],
        email: [null],
      })

    });
  }

  copyContacts(currentContact, pos): FormGroup {
    return this.formBuilder.group({
      id: [currentContact["id"]],
      mainContact: [currentContact["main"] ? pos : 0],
      version: [currentContact["version"]],
      firstName: [currentContact["firstName"]],
      lastName: [currentContact["lastName"]],
      jobTitle: [currentContact["jobTitle"]],
      numbers: this.formBuilder.group({
        telephone: [currentContact["numbers"]["telephone"]],
        mobile: [currentContact["numbers"]["mobile"]],
        email: [currentContact["numbers"]["email"]],
      })

      // telephone: [currentContact.telephone],
      // mobile: [currentContact.mobile],
      // email: [currentContact.email],
    });
  }
  addContact() {
    let contactArray = this.budgetingForm.get('contacts') as FormArray;
    contactArray.push(this.createContacts());
  }

  removeContact(elt) {
    let contactArray = this.budgetingForm.get('contacts') as FormArray;
    contactArray.removeAt(elt);
  }

  addAccounting() {
    // const accountForm = this.budgetingForm.get('others').value as FormArray;
    let formValue = this.budgetingForm.getRawValue();
    let accountingCode = formValue.others.code;
    let accountingValue = formValue.others.value;
    this.addAccountData(accountingCode, accountingValue);



  }

  addAccountData(accountingCode, accountingValue) {
    this.accoutingCode.push({
      type: accountingCode,
      value: accountingValue
    });


    try {
      let index =  this.dropdownData.accountingCodes.indexOf(accountingCode);
      this.dropdownData.accountingCodes.splice(index,1)
      this.budgetingForm.get("others").get("code").reset();
      this.budgetingForm.get("others").get("value").reset();
    }
    catch(err){
      console.log(err)
    }
    
    // this.accountDropdownData.splice(this.accountDropdownData.indexOf(accountingCode), 1);
  }

  removeAccounting(accounting: any) {
    try{
      this.accoutingCode.splice(this.accoutingCode.indexOf(accounting), 1);
      this.dropdownData.accountingCodes.push(accounting.type);
    }
    catch(err){
      console.log(err)
    }
    
    // this.accountDropdownData.push(accounting.type);
  }
  addChannel() {
    let channel = this.budgetingForm.get('others').get('selectedChannel').value;
    let format = this.budgetingForm.get('others').get('selectedChannelFormat').value;
    // this.channelFormat.push({"channel":channel,"format":format});
    // this.budgetingForm.get('rateCard').get('selectedChannel').reset();
    // this.budgetingForm.get('rateCard').get('selectedChannelFormat').reset();
    // if(channel)
    this.selectedChannels.set(channel.id, channel);

  }

  removeChannel(ch) {
    // this.channelFormat.splice(this.channelFormat.indexOf(ch), 1);
    this.selectedChannels.delete(ch);
  }

  getValues() {
    return Array.from(this.selectedChannels.entries());
  }
  trackByFn(index, item) {
    return index;
}

  setMainCon(con) {
    this.selectedMainContact = con;
  }

  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }



  /*-  To handle event on  ProfilePictureChange*/
  onLogoPictureChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();


      if (this.isInArray(this.allowedExtensionsForPhoto, fileExtension) && file.size < 2097152) {
        this.logoName = "Successfully added File:" + file.name;
        this.invalidPhotoFormatError = null;
        console.log(this.budgetingForm.get('address').get('avatar').value);
        this.budgetingForm.get('address').get('avatar').setValue(file);
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
          let target: any = event.target; //<-- This (any) will tell compiler to shut up!
          this.pictureUrl = target.result;
        }
      }
      else if (file.size > 2097152) {
        this.logoName = null;
        this.budgetingForm.get('address').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "File size should not be greater than 2MB."
      } else {
        this.logoName = null;
        this.budgetingForm.get('address').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "Only jpeg or jpg format allowed!!"
      }

    }
  }
  /*-  To upload picture*/
  uploadPicture(personnelId: number, cb) {
    if (this.budgetingForm.get('address').get('avatar').value) {
      let body = new FormData();
      body.append('discriminator', 'company');
      // body.append('attachmentType', 'image');
      body.append('fileContent', this.budgetingForm.get('address').get('avatar').value);
      console.log(body);
      this.httpService.callApi("uploadPicture", { body: body, pathVariable: personnelId }).subscribe((respone) => {

        // this.saveAttachment(personnelId, 0);
        console.log(respone);
        cb();
      }, (error) => {
        console.log('error ', error)
      });
    } else {
      cb();
    }
    // else {
    //   this.saveAttachment(personnelId, 0);
    // }
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
      body.append('discriminator', 'company');
      this.httpService.callApi("uploadAttachment", { body: body, pathVariable: personnelId }).subscribe((respone) => {

        this.saveAttachment(personnelId, ++index);
      }, (error) => {

        this.toastr.error(error.error.message, 'Client');
        console.log('error ', error)
      });
    } else {

      this.saveAttachment(personnelId, ++index);
    }
  }

  deleteAttcahments() {
    let pathVariable: string = '/' + this.selectedClient.id + '/person';
    this.httpService.callApi("deleteAttachments", { pathVariable: pathVariable, body: this.removedAttachments }).subscribe((responce) => {
      this.toastr.success('Successfully Saved', 'Personnel');
      this.closeModalEvent.emit(false);
    }, (error) => {

    });
  }






}
