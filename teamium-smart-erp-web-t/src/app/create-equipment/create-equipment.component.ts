import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.scss']
})
export class CreateEquipmentComponent implements OnInit {
  @Input() componentName='Equipment';
  @Input() equipmentDetails: any;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  equipmentForm: FormGroup;
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
  remoedAttachments: any = [];
  allowedExtensionsForPhoto = ['jpg', 'jpeg', 'png'];
  allowedExtensionsForAttachment = ['jpg', 'jpeg', 'png', 'pdf'];
  resource = {
    "functions": [],
    "informations": []
  };
  isAvailableOnMarketPlace: boolean;
  pictureUrl: string;
  modalHeading = "Add Equipment"
  isFormDataChanged: boolean;
  profilePictureName: string;
  addedAttachmentFileName: string;
  equipmentNameError: string;
  serialNumberError: string;
  showFeactureIndex: number;
  addedPictureNameMessage : string;
  removePhoto : boolean = false;
  showDeleteModal:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private commonUtilService: CommonUtilService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.getEquipmentDropdownData();
    if (this.equipmentDetails) {
      this.modalHeading = "Edit Equipment"
      this.equipmentForm = this.createFormGroupForEdit();
      this.pictureUrl = this.equipmentDetails.photo != null ? this.equipmentDetails.photo.url : '';
      this.milestones = this.equipmentDetails.milestones;

      this.attachments = this.equipmentDetails.attachments;

      this.functoinsWithRating = this.equipmentDetails.resource.functions.map(data => {
        return { 'function': data.function, 'rating': data.rating }
      });
      if (this.equipmentDetails.resource.functions)

        this.equipmentDetails.resource.informations.forEach(element => {
          this.functionKeywords.push(element);
        });


    } else {
      this.equipmentForm = this.createFormGroup();

    }

    this.equipmentForm.get('attachment').get('feedByUrl').valueChanges.subscribe(

      (feedByUrl) => {
        if (feedByUrl == '1') {
          this.equipmentForm.get('attachment').get('url').enable();
          this.equipmentForm.get('attachment').get('url').setValidators(Validators.compose([Validators.required, Validators.pattern('(https://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?|(http://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]));

          this.equipmentForm.get('attachment').get('avatar').disable();
          this.equipmentForm.get('attachment').get('avatar').clearValidators();
        } else {
          this.equipmentForm.get('attachment').get('url').disable();
          this.equipmentForm.get('attachment').get('url').clearValidators();

          this.equipmentForm.get('attachment').get('avatar').enable();
          this.equipmentForm.get('attachment').get('avatar').setValidators(Validators.required);
        }
        this.equipmentForm.get('attachment').get('url').updateValueAndValidity();
        this.equipmentForm.get('attachment').get('avatar').updateValueAndValidity();
      });

    this.equipmentForm.get('basicInfo').get('name').valueChanges.subscribe((value) => {
      this.changeEquipmentErrorMessage(value);
    })

    this.equipmentForm.get('basicInfo').get('serialNumber').valueChanges.subscribe((value) => {
      this.changeSerialNumberErrorMessage(value);
    })
  }



  setSelectedStep(stepNumber: number) {
    this.selectedStep = stepNumber;
  }


  /*-  To create from for new equipment. */
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      basicInfo: this.formBuilder.group({
        name: [null, Validators.compose([Validators.required, Validators.pattern('^([A-Za-z0-9-_#*+)(]+ )+[A-Za-z0-9-_#*+)(]+$|^[A-Za-z0-9-_#*+)(]+$')])],
        serialNumber: [null, Validators.compose([Validators.required, Validators.pattern('^([A-Za-z0-9-_#*+)(]+ )+[A-Za-z0-9-_#*+)(]+$|^[A-Za-z0-9-_#*+)(]+$')])],
        brand: [null],
        model: [null],
        type: [null],
        description: [null],
        reference: [null],
        location: [null],
        format: [null],
        avatar: [null],
        marketplace: [false],
        available: [true],
      }),

      functions: this.formBuilder.group({
        selectedFunction: [null, Validators.required],
        selectedRating: [null],

      }),

      specification: this.formBuilder.group({
        specsConsumption: [null],
        specsWeight: [null,],
        specsSize: [null,],
        specsOrign: [null],
        specsIp: [null],
      }),

      attachment: this.formBuilder.group({
        attachmentType: [null, Validators.required],
        feedByUrl: '',
        avatar: [null, Validators.required],
        url: [{ value: null, disabled: true }]
      }),

      others: this.formBuilder.group({
        milestoneType: [null, Validators.required],
        milestoneDate: [null, Validators.required],
        ata: null,
        purchase: null,
        insurance: null,
        description: null
      })

    });
  }

  /*-  To create from for edit */
  createFormGroupForEdit(): FormGroup {
    let editMode: boolean = this.equipmentDetails;
    return this.formBuilder.group({
      basicInfo: this.formBuilder.group({
        name: [this.equipmentDetails.name, Validators.compose([Validators.required, Validators.pattern('^([A-Za-z0-9-_#*+)(]+ )+[A-Za-z0-9-_#*+)(]+$|^[A-Za-z0-9-_#*+)(]+$')])],
        serialNumber: [this.equipmentDetails.serialNumber, Validators.compose([Validators.required, Validators.pattern('^([A-Za-z0-9-_#*+)(]+ )+[A-Za-z0-9-_#*+)(]+$|^[A-Za-z0-9-_#*+)(]+$')])],
        brand: [this.equipmentDetails.brand],
        model: [this.equipmentDetails.model],
        type: [this.equipmentDetails.type.length == 0 ? null : this.equipmentDetails.type],
        description: [this.equipmentDetails.description],
        reference: [this.equipmentDetails.reference],
        location: [this.equipmentDetails.location],
        format: [this.equipmentDetails.format],
        avatar: [null],
        marketplace: [this.equipmentDetails.marketplace],
        available: [this.equipmentDetails.available]
      }),

      functions: this.formBuilder.group({
        selectedFunction: [null, Validators.required],
        selectedRating: [null],

      }),

      specification: this.formBuilder.group({
        specsConsumption: [this.equipmentDetails.specsConsumption],
        specsWeight: [this.equipmentDetails.specsWeight],
        specsSize: [this.equipmentDetails.specsSize],
        specsOrign: [this.equipmentDetails.specsOrign],
        specsIp: [this.equipmentDetails.specsIp],
      }),

      attachment: this.formBuilder.group({
        attachmentType: [null, Validators.required],
        feedByUrl: '',
        avatar: [null, Validators.required],
        url: [{ value: null, disabled: true }]
      }),

      others: this.formBuilder.group({
        milestoneType: [null, Validators.required],
        milestoneDate: [null, Validators.required],
        ata: [this.equipmentDetails.ata, Validators.pattern('^[0-9]*[.]?[0-9]*')],
        purchase: this.equipmentDetails.purchase,
        insurance: this.equipmentDetails.insurance,
        description: this.equipmentDetails.description
      })

    });
  }

  /*-  To create dropdown data*/
  getEquipmentDropdownData() {
    this.httpService.callApi('getEquipmentDropdownData', {}).subscribe((response) => {
      this.dropdownData = response;
      if (this.equipmentDetails) {

        let isContain: boolean = false;
        this.dropdownData.functions = this.dropdownData.functions.filter(dt => {
          let contains: boolean = true;
          this.equipmentDetails.resource.functions.forEach(element => {
            if (dt.id == element.function.id) {
              contains = false;
              return contains;
            }

          })
          return contains;
        });


        this.dropdownData.milestones = this.dropdownData.milestones.filter(milestone => {
          let contains: boolean = true;
          this.equipmentDetails.milestones.forEach(element => {
            if (element.type == milestone) {
              contains = false;

            }
            return contains;
          });
          return contains;
        })
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


  /*-  To add function*/
  addFunction() {
    let selectedFunction = this.equipmentForm.get('functions').get('selectedFunction').value;
    let selectedRating = this.equipmentForm.get('functions').get('selectedRating').value;
    if (selectedFunction.functionKeyword && selectedFunction.functionKeyword.keysList && selectedFunction.functionKeyword.keysList.length > 0) {
      selectedFunction.functionKeyword.keysList.forEach(element => {
        this.functionKeywords.push({ "functionId": selectedFunction.id, "keywordValue": selectedFunction.functionKeyword.keyword, "description": "", "keyValue": element.keyValue });
      });
    }
    this.functoinsWithRating.push({ 'function': selectedFunction, 'rating': selectedRating });
    this.dropdownData.functions.splice(this.dropdownData.functions.indexOf(selectedFunction), 1);
    this.equipmentForm.get('functions').reset();
    console.log('rating value ', this.equipmentForm.get('functions').get('selectedRating').value)
  }

  getFeatureKeyword(functionId) {
    return this.functionKeywords.filter(data => data.functionId == functionId);
  }

  showFeature(id) {
    if (this.showFeactureIndex) {
      if (this.showFeactureIndex == id) {
        this.showFeactureIndex = null;
        return;
      }
    }
    this.showFeactureIndex = id;
  }

  /*-  To remove function*/
  removeFunction(fun: any) {
    this.functoinsWithRating.splice(this.functoinsWithRating.indexOf(fun), 1);

    this.dropdownData.functions.push(fun.function);
    this.functionKeywords = this.functionKeywords.filter(data => !(data.functionId === fun.function.id))
  }

  /*-  To handle event on FileChange for attachments*/
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();

      if (this.isInArray(this.allowedExtensionsForAttachment, fileExtension) && file.size < 2097152) {
        this.invalidAttachmentFormatError = null;
        this.equipmentForm.get('attachment').get('avatar').setValue(file);
        this.addedAttachmentFileName = "Successfully added File:" + file.name;
      } else if (file.size > 2097152) {
        this.addedAttachmentFileName = null;
        this.equipmentForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "File size should not be greater than 2MB."
      }
      else {
        this.addedAttachmentFileName = null;
        this.equipmentForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "Only jepg, jpg, png or pdf format allowed!!"
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
        this.addedPictureNameMessage = "Successfully added File : " + file.name;
        this.invalidPhotoFormatError = null;
        this.equipmentForm.get('basicInfo').get('avatar').setValue(file);
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
        this.equipmentForm.get('attachment').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "File size should not be greater than 2MB."
      } else {
        this.profilePictureName = null;
        this.addedPictureNameMessage = null;
        this.equipmentForm.get('basicInfo').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "Only jpeg, jpg or png format allowed!!"
      }
    }
  }

  /*-  To add attachment*/
  addAttachment() {
    let fileExtention = '';
    if (!this.equipmentForm.get('attachment').get('feedByUrl').value) {
      fileExtention = this.equipmentForm.get('attachment').get('avatar').value.name.split('.').pop().toLowerCase();
    }
    this.attachments.push({ 'type': this.equipmentForm.get('attachment').get('attachmentType').value, 'extension': fileExtention, 'feedByUrl': this.equipmentForm.get('attachment').get('feedByUrl').value ? 'true' : 'false', 'avatar': this.equipmentForm.get('attachment').get(this.equipmentForm.get('attachment').get('feedByUrl').value ? 'url' : 'avatar').value })
    this.equipmentForm.get('attachment').reset();
    this.addedAttachmentFileName = null;
  }

  /*-  To remove attachment*/
  removeAttachment(attachment) {
    if (attachment.id) {
      this.remoedAttachments.push(attachment.id);
    }
    this.attachments.splice(this.attachments.indexOf(attachment), 1);
  }

  /*-  To add milestone*/
  addMilestone() {
    let milestoneType = this.equipmentForm.get('others').get('milestoneType').value;
    let milestoneDate = this.equipmentForm.get('others').get('milestoneDate').value
    this.milestones.push({
      "type": milestoneType,
      "date": milestoneDate
    });
    this.dropdownData.milestones.splice(this.dropdownData.milestones.indexOf(milestoneType), 1);
    this.equipmentForm.get('others').get('milestoneType').reset()
    this.equipmentForm.get('others').get('milestoneDate').reset()

  }

  /*-  To remove molestone*/
  removeMilestone(milestone: any) {
    this.milestones.splice(this.milestones.indexOf(milestone), 1);
    this.dropdownData.milestones.push(milestone.type);
  }

  /*-  To set features on changes*/
  setfeatureDescription(event: any, feature: any) {
    feature.description = event.target.value;
  }


  /*-  To create JSON for saving equipment.*/
  getJSONForSaveEquipment(): any {
    let id = null;
    let version = null;
    if (this.equipmentDetails) {
      id = this.equipmentDetails.id;
      version = this.equipmentDetails.version;
    }

    this.getNewEquipmentResource(this.equipmentDetails ? true : false);

    let equipmentData = {
      "id": id,
      "version": version,
      "name": this.equipmentForm.get('basicInfo').get('name').value,
      "serialNumber": this.equipmentForm.get('basicInfo').get('serialNumber').value,
      "brand": this.equipmentForm.get('basicInfo').get('brand').value,
      "model": this.equipmentForm.get('basicInfo').get('model').value,
      "reference": this.equipmentForm.get('basicInfo').get('reference').value,
      "type": this.equipmentForm.get('basicInfo').get('type').value,
      "location": this.equipmentForm.get('basicInfo').get('location').value,
      "format": this.equipmentForm.get('basicInfo').get('format').value,
      "marketplace": this.equipmentForm.get('basicInfo').get('marketplace').value,
      "available": this.equipmentForm.get('basicInfo').get('available').value,
      "removePhoto":this.removePhoto,

      "specsConsumption": this.equipmentForm.get('specification').get('specsConsumption').value,
      "specsWeight": this.equipmentForm.get('specification').get('specsWeight').value,
      "specsSize": this.equipmentForm.get('specification').get('specsSize').value,
      "specsOrign": this.equipmentForm.get('specification').get('specsOrign').value,
      "specsIp": this.equipmentForm.get('specification').get('specsIp').value,

      "milestones": this.milestones,
      "ata": this.equipmentForm.get('others').get('ata').value,
      "purchase": this.equipmentForm.get('others').get('purchase').value,
      "insurance": this.equipmentForm.get('others').get('insurance').value,
      "description": this.equipmentForm.get('others').get('description').value,
      "resource": this.resource
    }
    return equipmentData;

  }

  /*-  To create equipment resource on the baiss of functions*/
  getNewEquipmentResource(existing: boolean) {
    if (existing) {
      this.functoinsWithRating.forEach(element => {
        let id = null;
        this.equipmentDetails.resource.functions.forEach(data => {
          if (data.function != null && element.function.id == data.function.id) {
            id = data.id;
            return;
          }
        });
        this.resource.functions.push({ "id": id, "function": { "id": element.function.id }, "rating": element.rating });
      });
    } else {
      this.functoinsWithRating.forEach(element => {
        this.resource.functions.push({ "function": { "id": element.function.id }, "rating": element.rating });
      });
    }
    this.resource.informations = this.functionKeywords;

  }

  /*-  To save equipment*/
  saveEquipment() {
    this.httpService.callApi('saveEquipment', { body: this.getJSONForSaveEquipment() }).subscribe((response) => {

      this.uploadPicture(response.id);


    }, error => {
      this.toastr.error(error.error.message, 'Equipment');
      console.log('Error getstatus => ', error)
    });
  }
  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  /*-  To upload picture*/
  uploadPicture(equipmentId: number) {
    if (this.equipmentForm.get('basicInfo').get('avatar').value) {
      let body = new FormData();
      body.append('discriminator', 'equipment');
      body.append('fileContent', this.equipmentForm.get('basicInfo').get('avatar').value);
      this.httpService.callApi("uploadPicture", { body: body, pathVariable: equipmentId }).subscribe((respone) => {
        this.saveAttachment(equipmentId, 0);
      }, (error) => {
        console.log('error ', error)
      });
    } else {
      this.saveAttachment(equipmentId, 0);
    }
  }

  /*-  To upload attachments*/
  saveAttachment(equipmentId: number, index: number): string {

    if (index >= this.attachments.length) {
      if (this.remoedAttachments.length > 0) {
        this.deleteAttcahments();
      } else {
        this.closeModalEvent.emit(false);
        this.toastr.success('Successfully Saved', 'Equipment');
      }
      return;
    }
    let element = this.attachments[index];
    if (!element.id) {
      let body = new FormData();
      body.append(element.feedByUrl == 'true' ? 'url' : 'fileContent', element.avatar);
      body.append('attachmentType', element.type);
      body.append('isFeedByUrl', element.feedByUrl);
      body.append('discriminator', 'equipment');
      this.httpService.callApi("uploadAttachment", { body: body, pathVariable: equipmentId }).subscribe((respone) => {
        this.saveAttachment(equipmentId, ++index);
      }, (error) => {
        console.log('error ', error)
      });
    } else {
      this.saveAttachment(equipmentId, ++index);
    }
  }

  deleteAttcahments() {
    let pathVariable: string = '/' + this.equipmentDetails.id + '/equipment';
    this.httpService.callApi("deleteAttachments", { pathVariable: pathVariable, body: this.remoedAttachments }).subscribe((responce) => {
      this.toastr.success('Successfully Saved', 'Equipment');
      this.closeModalEvent.emit(false);
    }, (error) => {

    });
  }
  /*-To send an event to list and edit parent components on close modal. -*/
  sendCloseEventToEditOrListComponent() {
    if (this.equipmentForm.get('basicInfo').invalid) {
      if (confirm("Incomplete form! Do you want to close it ?")) {
        this.closeModalEvent.emit(false);
      }
    }
    else {
      if (confirm("Do you want to save the changes ?")) {
        this.saveEquipment();

      } else {
        this.closeModalEvent.emit(false);
      }
    }

  }

  deleteEquipment($event) {
    if ($event) {
      this.httpService.callApi("deleteEquipment", { pathVariable: this.equipmentDetails.id }).subscribe((response) => {
        this.toastr.success('Successfully Deleted', 'Equipment');
        this.router.navigate(['/teamium/equipment-list']);
      }, (error) => {
        this.toastr.error('Error while deletion' + error.error.message, 'Equipment');
        console.log(error.error);
      });

    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }

  focusOutEquipment(fieldName: String) {
    switch (fieldName) {
      case 'EquipmentName': {
        let name = this.equipmentForm.get('basicInfo').get('name').value;
        if (!name) {
          this.equipmentNameError = 'Equipment name is required.'
          return;
        }
        name = name.trim();
        this.equipmentForm.get('basicInfo').get('name').setValue(name);
        this.changeEquipmentErrorMessage(name);
        break;
      }
      case 'SerialNumber': {
        let name = this.equipmentForm.get('basicInfo').get('serialNumber').value;
        if (!name) {
          this.serialNumberError = 'Serial number is required.'
          return;
        }
        name = name.trim();
        this.equipmentForm.get('basicInfo').get('serialNumber').setValue(name);
        this.changeSerialNumberErrorMessage(name);
        break;

      }
    }
  }

  changeEquipmentErrorMessage(name: string) {
    if (name.length == 0) {
      this.equipmentNameError = 'Equipment name is required.'
    } else if (this.equipmentForm.get('basicInfo').get('name').invalid) {
      this.equipmentNameError = 'Invalid Equipment name.'
    } else {
      this.equipmentNameError = null;
    }
  }

  changeSerialNumberErrorMessage(name: string) {
    if (name.length == 0) {
      this.serialNumberError = 'Serial number is required.'
    } else if (this.equipmentForm.get('basicInfo').get('serialNumber').invalid) {
      this.serialNumberError = 'Invalid Serial number.'
    } else {
      this.serialNumberError = null;
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

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#feature-id')) {
      this.showFeactureIndex = null;
    }
  }

  removePicture() {
    this.equipmentForm.get('basicInfo').get('avatar').setValue(null);
    this.pictureUrl = null;
    this.profilePictureName = 'No file chosen';
    this.addedPictureNameMessage = null;
    this.removePhoto=true;
  }

}