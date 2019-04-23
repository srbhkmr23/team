import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { HttpService } from '../core/services/http.service';
import { ChatService } from '../core/services/chat.service';
import * as moment from 'moment-timezone';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { truncate } from 'fs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mainHeader') mainHeaderDiv: ElementRef;
  @ViewChild('contactSearch') contactSearchDiv: ElementRef;
  @ViewChild('contactList') contactListDiv: ElementRef;


  public liClicked: boolean = false;
  public showLogot: boolean = false;
  public notificationClick: boolean = false;
  messageListClick: boolean = false;
  userForm: any;
  loggedInUserData: any;
  firstName: any;
  languages: any = [];
  public showUserList: boolean = true;
  public userList: any = [];
  public allOnlineUsersList: any = {};
  notificationsObject: any = {};
  mainNotificationCount: any = 0;
  to = '';
  from = '';
  msg = '';
  toUserObject = {};
  allMessageList: any = []
  searchUserKeyword: string = '';
  isUserTyping: boolean = false;
  timeZoneList = new Array<any>();

  lastMessageSentTime: any;
  showDigitalSignatureModal: boolean = false;
  editable: boolean = false;
  dropDownData: any;
  allowedExtensionsForPhoto = ['jpg', 'jpeg', 'png'];
  @ViewChild('inputImage') inputImage: ElementRef;
  pictureUrl: string;
  showResetPasswordModal: boolean= false;

  constructor(private renderer: Renderer2, private dataService: DataService, private httpService: HttpService, private formBuilder: FormBuilder, private chatService: ChatService, private translateService: TranslateService, private toastr: ToastrService) {
    this.userForm = this.createFormGroup();
    //  this.renderer: Renderer2 
  }

  ngOnInit() {
    this.getDropDownData();
    this.getLoggedinData();
    this.getAllUserList();
    window.addEventListener("beforeunload", (e) => {
      this.doOffline();
    });
  }

  ngAfterViewInit() {
    // alert()

    // console.log("this.mainHeaderDiv.nativeElement.offsetHeight",this.mainHeaderDiv.nativeElement.offsetHeight)
    // console.log("this.contactSearchDiv.nativeElement.offsetHeight",this.contactSearchDiv.nativeElement.offsetHeight)
  }

  getDropDownData() {
    this.httpService.callApi('getPersonalDropdownData', {}).subscribe((response) => {
      this.dropDownData = response;
    }, error => {
    });
  }

  show() {

    this.notificationClick = !this.notificationClick;

    if (this.notificationClick == false) {
      this.showUsersList();
    }

    // setTimeout(()=>{
    //   console.log("this.mntactSainHeaderDiv.nativeElement.offsetHeight",this.mainHeaderDiv.nativeElement.offsetHeight)
    //   console.log("this.contactSearchDiv.nativeElement.offsetHeight",this.contactSearchDiv.nativeElement.offsetHeight)
    //   let headerHeight = this.mainHeaderDiv.nativeElement.offsetHeight || 0;
    //   let searchDivHeight = this.contactSearchDiv.nativeElement.offsetHeight || 0;
    //   //calc(100vh - 98px) !important
    //   let setHeight=window.innerHeight-(headerHeight+searchDivHeight);
    //   // this.renderer.setStyle(this.contactListDiv.nativeElement,'max-height',`${setHeight}px`);  
    // },0)

  }



  ngOnDestroy() {
    this.doOffline()
  }

  doOffline = () => {
    try {
      if (this.loggedInUserData && this.loggedInUserData.hasOwnProperty('id')) {
        let from = this.loggedInUserData.id || '';
        this.timeoutFunction(); // set user is typing false;
        this.chatService.doOffline(from);
      }
    }
    catch (err) {
      console.log(err)
    }

  }


  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-ZÀ-ŸØ-öø-ÿ]{1,30}$')])],
      lastName: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-ZÀ-ŸØ-öø-ÿ]{1,30}$')])],
      employeeCode: [null, Validators.required],
      city: [null],
      country: [null],
      primaryEmail: [null, Validators.pattern("^[a-zA-Z0-9]+(\\.[a-zA-Z0-9]{1,})*(\\.[a-zA-Z0-9]{1,})*@[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*(\\.[a-zA-Z0-9]{2,})$")],
      primaryPhone: [null],
      timeZone: [null],
      language: [null],
      avatar: [null]
    })
  }

  getLoggedinData() {
    let telephone, email, city, country, timezone;
    this.httpService.callApi('loggedInUser', {}).subscribe(response => {
      if (response.address) {
        city = response.address.city ? response.address.city : '';
        country = response.address.country ? response.address.country : '';
      }
      if (response.userSettingDTO) {
        timezone = response.userSettingDTO.timezone ? response.userSettingDTO.timezone : 'Asis/Calcutta';
        if (response.userSettingDTO.telephones) {
          telephone = response.userSettingDTO.telephones.filter(telephone => telephone.primaryTelephone)[0].telephone;
        }
        if (response.userSettingDTO.emails) {
          email = response.userSettingDTO.emails.filter(email => email.primaryEmail)[0].email;
        }
      }
      this.loggedInUserData = response;

      this.connectMe(this.loggedInUserData.id);

      let from = this.loggedInUserData.id || '';
      let data = {
        to: from
      }
      setTimeout(() => {
        this.getAllMessageNotifications();
      }, 100);
      // this.getAllMessageNotifications();
      this.from = this.loggedInUserData.id || '';

      try {
        this.pictureUrl = this.loggedInUserData.photo ? this.loggedInUserData.photo.url : '';
        this.userForm.get('firstName').setValue(response.firstName ? response.firstName : '');
        this.userForm.get('lastName').setValue(response.lastName ? response.lastName : '');
        this.userForm.get('city').setValue(city);
        this.userForm.get('country').setValue(country);
        this.userForm.get('primaryEmail').setValue(email);
        this.userForm.get('primaryPhone').setValue(telephone);
        this.userForm.get('employeeCode').setValue(response.employeeCode);
        this.userForm.get('timeZone').setValue(timezone);
        this.userForm.get('language').setValue(this.loggedInUserData.uiLanguage ? this.loggedInUserData.uiLanguage : 'English');
        this.useLanguage(this.userForm.get('language').value);
        this.languages = response.languages;
        // this.currentUserData = data;
      }
      catch (err) {
        console.log(err)
      }

    }), (error) => {
      console.log(error);
    }
    this.editable = false;
    this.disableFields();
  }



  getAllUserList = () => {
    this.httpService.callApi('getPersonals', {}).subscribe((response) => {
      // console.log("response",response)
      this.userList = response || [];
      this.sortUserList();
    }, error => {
      console.log('Error getstatus => ', error)
    });
  }


  liClick() {
    this.liClicked = !this.liClicked;
    this.dataService.isWrapperActive = this.liClicked;
  }
  logout() {
    this.doOffline();
    this.httpService.callApi('logout', {}).subscribe((response) => {
      }, error => {
        console.log('Error getstatus => ', error)
      });
    this.httpService.logout();
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#logOut')) {
      this.showLogot = false;
    }

    if (!targetElement.closest('#notificaton')) {
      this.notificationClick = false;
      this.showUsersList();
    }
    if (!targetElement.closest('#message')) {
      this.messageListClick = false;
    }

  }

  showMessage() {
    this.showUserList = false;
  }

  showUsersList() {
    this.setMessageSeenByUserOnCloseChatBox(this.toUserObject['id']);
    this.timeoutFunction()
    this.toUserObject = {};
    this.showUserList = true;

  }


  // chat functionality

  connectMe = (userId) => {
    this.chatService.getConnect(userId).subscribe(res => {


      // detect whenever new message get
      if (res['type'] == 'getMessage') {
        let to = this.toUserObject['id'] || '';
        let from = this.from || '';

        // identify the message from and add message to that user chat box
        if ((res['data'].message_from == from && res['data'].message_to == to) || (res['data'].message_from == to && res['data'].message_to == from)) {

          //  console.log("res['data']",res['data'])
          this.allMessageList.push(res['data'])


          // // if chatbox is selected then make seen true
          // if((res['data'].message_from == to && res['data'].message_to == from)){
          //   this.setMessageSeenByUser();
          // }

          // console.log("res['data']===>",res['data'])
          setTimeout(this.scrollBottom, 0)
        }

        //  check notification count and last message for show notification
        if (res['data'].message_from != to && res['data'].message_from != from) {
          if (this.notificationsObject[res['data'].message_from]) {
            this.notificationsObject[res['data'].message_from] = {
              count: this.notificationsObject[res['data'].message_from]['count'] + 1,
              data: res['data'],
              lastUpdate: res['data'].message_send_time//new Date()
            }

          }
          else {
            this.notificationsObject[res['data'].message_from] = {
              count: 1,
              data: res['data'],
              lastUpdate: res['data'].message_send_time//new Date()
            }

          }




          // console.log(this.notificationsObject)

          this.updateMainNotificationCount();
        }


        try {
          this.lastMessageSentTime = res['data'].message_send_time;
          this.messageSendUserObject(res['data'].message_to);
          // console.log("this.lastMessageSentTime",this.lastMessageSentTime)

        }
        catch (err) {
          console.log(err)
        }

      }

      if (res['type'] == 'getAllMessage') {
        // console.log("res['data']",res['data'])
        this.allMessageList = res['data'] || [];
        setTimeout(this.scrollBottom, 0)
      }

      if (res['type'] == 'setAllMessageNotifications') {
        this.createNotificationObject(res['data']);
      }

      if (res['type'] == 'newconnection') {
        // console.log("newconnection", res['data']['onlineUserList'])
        this.allOnlineUsersList = res['data']['onlineUserList'] || {};
        // console.log("res['data']['onlineUserList']",res['data']['onlineUserList'])
      }

      if (res['type'] == 'getUserIsTyping') {
        // console.log(res['data'])
        if (res['data'].typing && res['data'].from == this.toUserObject['id']) {
          console.log(res['data'])
          this.isUserTyping = true;
        }
        else {
          this.isUserTyping = false;
        }

      }

    }, err => {
      console.log(err);
    });
  }

  onSelectFriend = (friend) => {
    this.isUserTyping = false;
    this.toUserObject = friend || {};
    this.getAllMessage();
    this.notificationsObject[friend.id] = null;//0;
    this.updateMainNotificationCount();
    this.showMessage();
    this.msg = "";
    this.setMessageSeenByUser();
  }

  setMessageSeenByUser = () => {
    let to = this.toUserObject['id'] || '';
    let from = this.loggedInUserData.id || '';
    if (to == '' || from == '') {
      return;
    }
    let data = {
      from: to,
      to: from
    };
    this.chatService.setMessageSeenByUser(data);
  }

  setMessageSeenByUserOnCloseChatBox = (toId) => {
    let to = toId || '';
    let from = this.loggedInUserData.id || '';
    if (to == '' || from == '') {
      return;
    }

    let data = {
      from: to,
      to: from
    };
    this.chatService.setMessageSeenByUser(data);
  }

  updateMainNotificationCount = () => {
    this.mainNotificationCount = 0;
    Object.keys(this.notificationsObject).forEach(key => {
      if (this.notificationsObject[key] && this.notificationsObject[key].hasOwnProperty('count'))
        this.mainNotificationCount += this.notificationsObject[key].count;
    })
    this.sortUserList();
  }

  sortUserList = () => {
    try {
      let userListWithNotification = [];
      let userListWithoutNotification = [];
      this.userList.forEach(user => {
        if (this.notificationsObject[user.id] && this.notificationsObject[user.id]['count'] > 0) {
          user.lastUpdate = this.notificationsObject[user.id]['lastUpdate'];
          userListWithNotification.push(user);
        }
        else {
          userListWithoutNotification.push(user);
        }
      })

      // console.log("userListWithoutNotification",userListWithoutNotification); 
      // console.log("userListWithNotification",userListWithNotification);  
      userListWithNotification.sort((a, b) => {
        let c: any = new Date(a.lastUpdate);
        let d: any = new Date(b.lastUpdate);
        return d - c;
      });


      let newUserList = [...userListWithNotification, ...userListWithoutNotification];
      let newUserListWithLastUpdate = [];
      let newUserListWithoutLastUpdate = [];
      newUserList.forEach(user => {
        if (user.lastUpdate) {
          newUserListWithLastUpdate.push(user);
        }
        else {
          newUserListWithoutLastUpdate.push(user)
        }
      })


      // console.log("newUserListWithLastUpdate",newUserListWithLastUpdate); 
      // console.log("newUserListWithoutLastUpdate",newUserListWithoutLastUpdate);


      let updatedUserList = [...newUserListWithLastUpdate, ...newUserListWithoutLastUpdate];

      // console.log("f",JSON.parse(JSON.stringify(newUserList)))
      updatedUserList.sort((a, b) => {
        let c: any = new Date(a.lastUpdate);
        let d: any = new Date(b.lastUpdate);
        return d - c;

      });

      this.userList = updatedUserList//newUserList;//JSON.parse(JSON.stringify(newUserList));   
      // console.log("userListWithoutNotification",userListWithoutNotification); 
      // console.log("newUserList",newUserList);
    }
    catch (err) {
      console.log(err)
    }
  }

  getAllMessage = () => {
    let to = this.toUserObject['id'] || '';
    let from = this.loggedInUserData.id || '';
    let data = {
      from: from,
      to: to
    };
    this.chatService.getAllMessage(data);
  }

  onKeyUp = (event) => {
    if (event.keyCode == 13) {
      this.sendMessage();
    }
    this.onKeyDownNotEnter();
  }

  getAllMessageNotifications = () => {
    let from = this.loggedInUserData.id || '';
    let data = {
      to: from
    }
    this.chatService.getAllMessageNotifications(data);
  }

  createNotificationObject = (list) => {
    list.forEach(row => {
      if (this.notificationsObject[row.message_from]) {
        this.notificationsObject[row.message_from] = {
          count: this.notificationsObject[row.message_from]['count'] + 1,
          data: row,
          lastUpdate: row.message_send_time//new Date()
        }
      }
      else {
        this.notificationsObject[row.message_from] = {
          count: 1,
          data: row,
          lastUpdate: row.message_send_time//new Date()
        }
      }
    });
    this.updateMainNotificationCount();
  }

  sendMessage = () => {
    if (this.msg == '' || this.msg == undefined) {
      return;
    }

    let to = this.toUserObject['id'] || '';
    let from = this.loggedInUserData.id || '';

    if (to == '' || from == '') {
      return;
    }

    // check is to user is online or not
    let seen = false;
    // if(this.allOnlineUsersList.hasOwnProperty(to)){
    //   seen=false;
    // }
    // else{
    //   seen=false;
    // }
    let data = {
      from: from,
      to: to,
      msg: this.msg,
      seen: seen
    };

    this.chatService.sendMessage(data);
    this.msg = "";
    // this.messageSendUserObject(to);
  }

  messageSendUserObject = (to) => {
    // this.userList=this.userList.map((user)=>{
    //   if(user.id==to){
    //     user.lastUpdate=new Date();
    //   }
    //   return user;
    // })

    this.userList.forEach((user) => {
      if (user.id == to) {
        user.lastUpdate = this.lastMessageSentTime;//new Date();
      }
    })

    // console.log(this.userList);
    this.sortUserList();
  }

  getTimeFormat = (date) => {
    try {
      return moment(date).format("hh:mm A");
    }
    catch (err) {
      console.log(err)
      return "";
    }
  }

  getDateFormat = (date) => {
    try {
      return moment(date).format("ddd,D MMM")
    }
    catch (err) {
      console.log(err)
      return "";
    }
  }

  // typing functionality
  typing = false;
  timeout = undefined;
  timeoutFunction = () => {
    try {
      let to = this.toUserObject['id'] || '';
      let from = this.loggedInUserData.id || '';
      this.typing = false;
      this.chatService.setUserIsTyping({ typing: false, from: from, to: to });
    }
    catch (err) {
      console.log(err)
    }
  }

  onKeyDownNotEnter = () => {
    try {
      let to = this.toUserObject['id'] || '';
      let from = this.loggedInUserData.id || '';
      if (this.typing == false) {
        this.typing = true
        this.chatService.setUserIsTyping({ typing: true, from: from, to: to });
        this.timeout = setTimeout(() => this.timeoutFunction(), 3000);
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.timeoutFunction(), 3000);
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  returnTypingName = (toUserObject) => {
    let name = toUserObject.firstName || "";
    if (name == "") {
      return toUserObject.lastName;
    }
    else {
      return toUserObject.firstName;
    }
  }

  scrollBottom = () => {
    try {
      var element = document.getElementById('messages');
      element.scrollTop = 1000000//element.clientHeight;
    }
    catch (err) {
      console.log(err)
    }

  }
  useLanguage(language: string) {
    switch (language) {
      case 'English':
        language = 'en';
        break;
      case 'French':
        language = 'fr';
        break;
      case 'German':
        language = 'german';
        break;
      default:
        language = 'en';
    }
    this.translateService.use(language);
    sessionStorage.setItem("selectedLanguage", language);
  }

  hideDigitalSignatureModal(event) {
    this.showDigitalSignatureModal = false;
  }

  showLogOutModal() {
    this.showLogot = !this.showLogot;
    if (this.showLogot) {
      this.userForm.reset();
      this.getDropDownData();
      this.getLoggedinData();
      this.getAllTimeZone();
    }
  }

  showDefaultLanguage = (languages) => {
    if (languages.length == 0) {
      return true
    }

    let val = this.languages.filter(l => l === 'English').length;
    if (val == 0) {
      return true;
    }
    else {
      return false;
    }

  }

  getAllTimeZone() {
    this.httpService.callApi('getAllTimeZone', {}).subscribe((response) => {
      this.timeZoneList = response;
    }, error => {
    });
  }

  getPrimaryFunction() {
    if(!this.loggedInUserData){
      return '';
    }
    let primaryFunction = this.loggedInUserData.resource.functions.filter(f => f.primaryFunction === true)[0];
    return primaryFunction ? primaryFunction.function.qualifiedName : '';
  }

  getOtherMaxTwoFunction() {
    let list = new Array<string>();
    this.loggedInUserData.resource.functions.filter(f => f.primaryFunction === false).slice(0, 2).forEach(element => {
      list.push(element.function.qualifiedName ? element.function.qualifiedName : '');
    });
    return list;
  }

  saveMyAccount() {
    if (!this.validateAccount()) {
      return;
    }

    this.setPrimaryData();
    let body = {
      "version": this.loggedInUserData.version,
      "firstName": this.userForm.get('firstName').value,
      "lastName": this.userForm.get('lastName').value,
      "address": {
        "id": this.loggedInUserData.address.id,
        "city": this.userForm.get('city').value,
        "country": this.userForm.get('country').value,
      },
      "userSettingDTO": {
        "timezone": this.userForm.get('timeZone').value,
        "emails": this.loggedInUserData.userSettingDTO.emails,
        "telephones": this.loggedInUserData.userSettingDTO.telephones
      },
      "uiLanguage": this.userForm.get('language').value,
      "removePhoto": this.pictureUrl === ''?true:false,
    };
    this.httpService.callApi('editUserProfile', { pathVariable: this.loggedInUserData.id, body: body }).subscribe((response) => {
      this.loggedInUserData = response;
      this.uploadPicture(this.loggedInUserData.id);
      this.toastr.success('Successfully Saved', 'My Account');
    }, error => {
      this.toastr.error(error.error.message, 'My Account');
    });
    this.useLanguage(this.userForm.get('language').value);
    this.editable = false;
    this.disableFields();
  }

  setPrimaryData() {
    let email = this.userForm.get('primaryEmail').value;
    let telephone = this.userForm.get('primaryPhone').value;
    if (email) {
      this.loggedInUserData.userSettingDTO.emails.forEach(e => {
        if (e.email === email) {
          e.primaryEmail = true;
        } else {
          e.primaryEmail = false;
        }
      });
    }

    if (telephone) {
      this.loggedInUserData.userSettingDTO.telephones.forEach(t => {
        if (t.telephone === telephone) {
          t.primaryTelephone = true;
        } else {
          t.primaryTelephone = false;
        }
      });
    }
  }

  disableFields() {
    if (this.editable) {
      this.userForm.get('firstName').enable();
      this.userForm.get('lastName').enable();
      this.userForm.get('country').enable();
      this.userForm.get('city').enable();
      this.userForm.get('primaryEmail').enable();
      this.userForm.get('primaryPhone').enable();
      this.userForm.get('language').enable();
      this.userForm.get('timeZone').enable();
      this.userForm.get('avatar').enable();
      this.inputImage.nativeElement.disabled = false;
    } else {
      this.userForm.get('firstName').disable();
      this.userForm.get('lastName').disable();
      this.userForm.get('country').disable();
      this.userForm.get('city').disable();
      this.userForm.get('primaryEmail').disable();
      this.userForm.get('primaryPhone').disable();
      this.userForm.get('language').disable();
      this.userForm.get('timeZone').disable();
      this.userForm.get('avatar').disable();
      this.inputImage.nativeElement.disabled = true;
    }
  }

  validateAccount() {
    if (this.userForm.invalid) {
      if (this.userForm.get('firstName').invalid) {
        this.toastr.warning(this.userForm.get('firstName').errors.required ? 'First name is required' : 'First name is not valid', 'My Account');
      }
      if (this.userForm.get('lastName').invalid) {
        this.toastr.warning(this.userForm.get('lastName').errors.required ? 'Last name is required' : 'Last name is not valid', 'My Account');
      }
      return false;
    }
    return true;
  }

  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  onProfilePictureChange(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();
      if (this.isInArray(this.allowedExtensionsForPhoto, fileExtension)) {
        if (file.size > 2097152) {
          this.inputImage.nativeElement.value = '';
          this.toastr.warning('File size should not be greater than 2MB.', 'My Account');
          return;
        }
        this.userForm.get('avatar').setValue(file);
        this.readImage(file);
      } else {
        this.inputImage.nativeElement.value = '';
        this.toastr.warning('Only jpeg, jpg or png format allowed!!', 'My Account');
        return;
      }
    }
  }
  readImage(file: any): any {
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event) => {
      let target: any = event.target;
      this.pictureUrl = target.result;
    }
  }

  removeImage() {
    this.pictureUrl = '';
    this.userForm.get('avatar').setValue(null);
    this.inputImage.nativeElement.value = '';
  }

  /*-  To upload picture*/
  uploadPicture(personnelId: number) {
    
    if (this.userForm.get('avatar').value) {
      let body = new FormData();
      body.append('discriminator', 'person');
      body.append('fileContent', this.userForm.get('avatar').value);
      this.httpService.callApi("uploadPicture", { body: body, pathVariable: personnelId }).subscribe((respone) => {
      }, (error) => {
        this.toastr.error('Unable to upload the profile picture', 'My Account');
      });
    }
  }

}