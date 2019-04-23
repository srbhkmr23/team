import { Component, OnInit, HostListener, Sanitizer } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { DataService } from '../core/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, Form, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CheckBox } from '../core/entity/checkBox';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { EmbedVideoService } from 'ngx-embed-video/dist';
import { UserDetailsService } from '../core/services/user-details.service';

@Component({
  selector: 'app-personal-reels',
  templateUrl: './personal-reels.component.html',
  styleUrls: ['./personal-reels.component.scss']
})
export class PersonalReelsComponent implements OnInit {
  showModal: boolean;
  reelList: any = [];
  selectedReel: any;
  clickedId: any = -1;
  personalId;
  fullName: string;
  fileExtension: string;
  fileUrl: any;
  fileCleanUrl: SafeUrl;
  vdoCleanUrl: SafeUrl;
  iFrameText: string;

  activeReelIndex: any = 0;
  reelForm: FormGroup;
  attachments: any = [];
  pdfSrc: string = 'https://www.tutorialspoint.com/data_structures_algorithms/data_structures_algorithms_tutorial.pdf';
  vdoSrc: string = "https://www.youtube.com/watch?v=J_BcHAxiTZM";
  imgSrc: string = "../../assets/img/schedule.png";

  localVideo: string;
  iframe_html: any;
  vimeoUrl = "https://vimeo.com/197933516";
  youtubeUrl = "https://www.youtube.com/watch?v=iHhcHTlGtRs";
  dailymotionUrl = "https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport";
  //////

  searchText: string;
  filterList: any = [];
  searchList: any;

  isfiterClicked: boolean;
  isSortByClicked: boolean;

  isFilterByReelClicked: boolean;
  isFilterByPhotoClicked: boolean;
  isFilterByResumeClicked: boolean;
  isFilterByBioClicked: boolean;
  isFilterByPressClicked: boolean;

  reelCheckBoxList: any = [];
  photoCheckBoxList: any = [];
  resumeCheckBoxList: any = [];
  bioCheckBoxList: any = [];
  pressCheckBoxList: any = [];

  selectedReelCheckBoxList: any = [];
  selectedPhotoCheckBoxList: any = [];
  selectedResumeCheckBoxList: any = [];
  selectedBioCheckBoxList: any = [];
  selectedPressCheckBoxList: any = [];

  sortBy: string;
  sortValue: number = -1;

  allowedExtensionsResume = ['pdf', 'jpg'];
  allowedExtensionsPhoto = ['jpg'];
  allowedExtensionsReel = ['mp4'];
  allowedExtensionsBio = ['pdf', 'jpg'];
  allowedExtensionsPress = ['pdf', 'jpg'];

  allowedExtensionsForAttachment = ['jpg', 'png', 'pdf'];
  invalidReelFormatError: string;
  selectedPersonnel: any = null;
  isHumanResource: boolean = false;
  attachmentTypeValue:any;

  constructor(private router:Router,private httpService: HttpService, private toastr: ToastrService, private dataService: DataService, 
    private route: ActivatedRoute, private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private embedService: EmbedVideoService, private userDetailsService: UserDetailsService) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.route.params.subscribe(params => this.personalId = params.id);
    this.dataService.getSelectedPersonnel(this.personalId, (response) => {
      this.selectedPersonnel = response;
    })
    let pathVariable: any = new Array();
    // pathVariable.push(this.personalId);
    pathVariable.push({"staffId":this.personalId});
    this.dataService.addPathvariables(pathVariable);
    this.getReels();
    this.createFilterDropDown();
    // this.dataService.currentSelectedReel.subscribe(reel => {
    //   if (reel && reel[0]) {
    //     console.log('Get selected reel is : ' , reel[0]);
    //     this.clickEvent(reel[0])
    //     this.activeReelIndex = 0;
    //   }
    // });

    this.reelForm = this.formBuilder.group({
      attachment: this.formBuilder.group({
        attachmentType: [null, Validators.required],
        attachmentTitle: [null, Validators.required],
        discription: [null],
        validate: '',
        avatar: [null, Validators.required],
        url: [{ value: null, disabled: true }]
      })
    });
    this.reelForm.get('attachment').get('attachmentType').valueChanges.subscribe(value=>{
      this.attachmentTypeValue=value;
    })
    this.reelForm.get('attachment').get('attachmentType').valueChanges.subscribe(value => {
      const attachementForm = this.reelForm.get('attachment');
      if (value == 'Bio') {
        attachementForm.get('avatar').clearValidators();
        attachementForm.get('url').clearValidators();
      } else {
        let validate = this.reelForm.get('attachment').get('validate').value;
        attachementForm.get(validate == '1' ? 'url' : 'avatar').enable();
        attachementForm.get(validate == '1' ? 'url' : 'avatar').setValidators(Validators.required);

        attachementForm.get(validate == '1' ? 'avatar' : 'url').disable();
        attachementForm.get(validate == '1' ? 'avatar' : 'url').clearValidators();
      }
      attachementForm.get('url').updateValueAndValidity();
      attachementForm.get('avatar').updateValueAndValidity();

      this.reelForm.get('attachment').get('avatar').setValue(null);
    });
    this.reelForm.get('attachment').get('validate').valueChanges.subscribe(
      (validate) => {
        const attachementForm = this.reelForm.get('attachment');
        if (this.reelForm.get('attachment').get('attachmentType').value == 'Bio') {
          attachementForm.get(validate == '1' ? 'url' : 'avatar').enable();
          attachementForm.get(validate == '1' ? 'avatar' : 'url').disable();
        } else {
          attachementForm.get(validate == '1' ? 'url' : 'avatar').enable();
          attachementForm.get(validate == '1' ? 'url' : 'avatar').setValidators(Validators.required);
          attachementForm.get(validate == '1' ? 'avatar' : 'url').disable();
          attachementForm.get(validate == '1' ? 'avatar' : 'url').clearValidators();
        }
        attachementForm.get('url').updateValueAndValidity();
        attachementForm.get('avatar').updateValueAndValidity();
      });

    this.userDetailsService.isValidateUserRoleForModule('Human Resources', (res) => {
      this.isHumanResource = res;
    });

  }

  public createFilterDropDown() {
    this.photoCheckBoxList = new Array();
    this.photoCheckBoxList.push(new CheckBox("Photo", "Photo", false));

    this.reelCheckBoxList.push(new CheckBox("Reel", "Reel", false));

    this.resumeCheckBoxList.push(new CheckBox("Resume", "Resume", false));

    this.bioCheckBoxList.push(new CheckBox("Bio", "Bio", false));

    this.pressCheckBoxList.push(new CheckBox("Press", "Press", false));

    this.searchList = new Array();
    this.searchList.push('title');

  }

  getReels() {
    console.log('this.personalId ', this.personalId);
    let pathVariable = '/' + this.personalId + '/reel';
    console.log('this.pathVariable ', pathVariable);

    this.httpService.callApi('getPersonalReel', { pathVariable }).subscribe((responce) => {
      this.reelList = responce;
      if (this.reelList != null) {
        this.selectedReel = this.reelList[0];
        if (this.selectedReel) {
          console.log('my selected reel is : ', this.selectedReel);
          this.clickEvent(this.selectedReel)
          this.activeReelIndex = 0;
        }
      }
      console.log('reelList is : ', this.reelList);
    }, error => {
      console.log('Error getstatus => ', error)
    });
  }

  saveReel() {
    console.log('this.personalId ', this.personalId);
    let pathVariable = '/' + this.personalId + '/reel';
    let body = new FormData();
    const attachmentForm = this.reelForm.get('attachment');
    body.append('type', attachmentForm.get('attachmentType').value);
    body.append('title', attachmentForm.get('attachmentTitle').value);
    body.append('bio', attachmentForm.get('discription').value);

    if (attachmentForm.get('attachmentType').value === 'Bio') {
      if (attachmentForm.get('url').value) {
        body.append('url', attachmentForm.get('url').value);
      }
      if (attachmentForm.get('avatar').value) {
        body.append('fileContent', attachmentForm.get('avatar').value);
      }
    } else {
      body.append('url', attachmentForm.get('url').value);
      if (attachmentForm.get('avatar').value) {
        body.append('fileContent', attachmentForm.get('avatar').value);
      }
    }

    if (attachmentForm.get('validate').value) {
      var urlData = 'true';
      body.append('isFeedByUrl', urlData);
    } else {
      var urlData = 'false';
      body.append('isFeedByUrl', urlData);
    }

    this.httpService.callApi('savePersonalReel', { body, pathVariable }).subscribe((responce) => {
      this.reelList.push(responce);
      if (!this.selectedReel) {
        this.clickEvent(responce);
      }
      console.log('reelList is : ', this.reelList);
      this.toastr.success('Successfully Saved', 'Reel');
      this.reelForm.reset();
      this.showModal = !this.showModal;
    }, error => {
      console.log('Error getstatus => ', error)
      this.toastr.error(error.error.message, 'Reel');
    });
  }

  onFileChange(event) {
    if(this.attachmentTypeValue===undefined || null || ''){
      this.invalidReelFormatError="Please select the attachement type first!!";
      event.target.value = '';
     }
    if (event.target.files.length > 0) {
      let file = event.target.files[0];

      let fileExtension = file.name.split('.').pop().toLowerCase();
      if (this.reelForm.get('attachment').get('attachmentType').value === 'Resume') {
        if (this.isInArray(this.allowedExtensionsResume, fileExtension)) {
          this.invalidReelFormatError = null;
          this.reelForm.get('attachment').get('avatar').setValue(file);
        } else if (file.size > 2097152) {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "File size should not be greater than 2MB."
        } else {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "Only pdf or jpg format allowed for resume!!"
        }
      }

      if (this.reelForm.get('attachment').get('attachmentType').value === 'Photo') {

        if (this.isInArray(this.allowedExtensionsPhoto, fileExtension)) {
          this.invalidReelFormatError = null;
          this.reelForm.get('attachment').get('avatar').setValue(file);
          this.invalidReelFormatError="Sucessfully added!!";
          event.target.value=''; 
        } else if (file.size > 2097152) {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "File size should not be greater than 2MB."
        } else {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "Only jpg format allowed for photo!!"
        }
      }

      if (this.reelForm.get('attachment').get('attachmentType').value === 'Reel') {
        if (this.isInArray(this.allowedExtensionsReel, fileExtension)) {
          this.invalidReelFormatError = null;
          this.reelForm.get('attachment').get('avatar').setValue(file);
        }
        else {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "Only mp4 format allowed for reel!!"
        }
      }
      if (this.reelForm.get('attachment').get('attachmentType').value === 'Bio') {
        if (this.isInArray(this.allowedExtensionsBio, fileExtension)) {
          this.invalidReelFormatError = null;
          this.reelForm.get('attachment').get('avatar').setValue(file);
        } else if (file.size > 2097152) {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "File size should not be greater than 2MB."
        } else {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "Only pdf or jpg format allowed for bio!!"
        }
      }

      if (this.reelForm.get('attachment').get('attachmentType').value === 'Press') {
        if (this.isInArray(this.allowedExtensionsPress, fileExtension)) {
          this.invalidReelFormatError = null;
          this.reelForm.get('attachment').get('avatar').setValue(file);
        } else if (file.size > 2097152) {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "File size should not be greater than 2MB."
        }
        else {
          this.reelForm.get('attachment').get('avatar').setValue(null);
          this.invalidReelFormatError = "Only pdf or jpg format allowed for press!!"
        }
      }
    }

  }

  clickEvent(selectedReel: any) {
    this.selectedReel = selectedReel;
    if (selectedReel.url) {
      this.fileUrl = selectedReel.url;
      this.fileExtension = this.fileUrl.slice((this.fileUrl.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();

      if (selectedReel.type === 'Reel') {
        if (this.fileExtension === 'mp4') {
          this.localVideo = this.fileUrl;
          this.iframe_html = null;
        } else {
          this.iframe_html = this.embedService.embed(this.fileUrl);
          this.localVideo = null;
        }

      }
    } else {
      this.fileExtension = null;
      this.fileUrl = null;
    }

    console.log('fileUrl is : ', this.fileUrl);
    console.log('fileExtension is : ', this.fileExtension);

    this.fileCleanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
    console.log('fileCleanUrl is : ', this.fileCleanUrl);
    if (this.selectedReel) {
      this.clickedId = selectedReel.id;
    } else {
      this.clickedId = -1;
    }
  }
  addAttachment() {
    // this.saveReel();
    // this.attachments.push({ 'attachmentType': this.reelForm.get('attachment').get('attachmentType').value, 'avatar': this.reelForm.get('attachment').get(this.reelForm.get('attachment').get('validate').value ? 'url' : 'avatar').value, 'validate': this.reelForm.get('attachment').get('validate').value })
    // this.attachments.push(this.reelForm.get('attachment').value);
    // console.log(' Add this.attachments => ',this.attachments)


    // this.reelForm.get('attachment').reset();
  }

  removeAttachment(attachment) {
    this.attachments.splice(this.attachments.indexOf(attachment), 1);
  }

  addSelectedReelCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedReelCheckBoxList.push(checkBox.value);
    } else {
      this.selectedReelCheckBoxList.splice(this.selectedReelCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedReelCheckBoxList = JSON.parse(JSON.stringify(this.selectedReelCheckBoxList));


  }

  addSelectedPhotoCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedPhotoCheckBoxList.push(checkBox.value);
    } else {
      this.selectedPhotoCheckBoxList.splice(this.selectedPhotoCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedPhotoCheckBoxList = JSON.parse(JSON.stringify(this.selectedPhotoCheckBoxList));

  }

  addSelectedResumeCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedResumeCheckBoxList.push(checkBox.value);
    } else {
      this.selectedResumeCheckBoxList.splice(this.selectedResumeCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedResumeCheckBoxList = JSON.parse(JSON.stringify(this.selectedResumeCheckBoxList));

  }

  addSelectedBioCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedBioCheckBoxList.push(checkBox.value);
    } else {
      this.selectedBioCheckBoxList.splice(this.selectedBioCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedBioCheckBoxList = JSON.parse(JSON.stringify(this.selectedBioCheckBoxList));

  }

  addSelectedPressCheckbox(checkBox: CheckBox) {

    checkBox.checked = !checkBox.checked;
    if (checkBox.checked) {
      this.selectedPressCheckBoxList.push(checkBox.value);
    } else {
      this.selectedPressCheckBoxList.splice(this.selectedPressCheckBoxList.indexOf(checkBox.value), 1);

    }
    this.selectedPressCheckBoxList = JSON.parse(JSON.stringify(this.selectedPressCheckBoxList));

  }
  /*-  To handle event on  ProfilePictureChange*/
  onProfilePictureChange(event) {

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
  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  deleteReel(reel: any) {
    if (confirm("Are you sure to delete this reel?")) {
      this.httpService.callApi('deleteReel', { pathVariable: reel.id }).subscribe((response) => {
        this.toastr.success('Successfully deleted', 'Reel');
        // this.clickEvent(reel);
        // this.reelList.splice( this.reelList.indexOf(reel),1);
        let deleteIndex = this.reelList.indexOf(reel);
        this.reelList.splice(deleteIndex, 1);
        console.log('this.reelList[deleteIndex]', this.reelList.length, ' deleteIndex ', deleteIndex)
        if (this.reelList.length == 0) {
          this.clickEvent(null);
          return;
        }
        if (this.reelList.length > deleteIndex) {
          console.log('inside if')
          this.clickEvent(this.reelList[deleteIndex]);
        } else {
          deleteIndex -= 1;
          console.log('inside else', deleteIndex)
          console.log('this.reelList[deleteIndex] ', this.reelList[deleteIndex])
          this.clickEvent(this.reelList[deleteIndex]);
          this.activeReelIndex = deleteIndex;
        }
      }, error => {
        console.log('Error getstatus => ', error)
        this.toastr.error(error.error.message, 'Reel');
      });
    }
  }
  cleanFileURL(fileUrl): SafeUrl {
    let fileExtension = fileUrl.name.split('.').pop().toLowerCase();
    this.fileExtension = fileExtension;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }
}
