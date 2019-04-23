import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { DataService } from '../core/services/data.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { UserDetailsService } from '../core/services/user-details.service';
import { forkJoin } from '../../../node_modules/rxjs';
import { getCurrencySymbol } from '@angular/common';
import { moment } from 'fullcalendar';
//import {CurrencyPipe} from '@angular/common';
@Component({
  selector: 'app-project-procurement',
  templateUrl: './project-procurement.component.html',
  styleUrls: ['./project-procurement.component.scss']
})
export class ProjectProcurementComponent implements OnInit {
  searchText: any;
  personnelDetail: any
  showSaveEquipmentModal: false;
  projectId: number;
  getCurrencySymbol = getCurrencySymbol;
  bookingDetailByBudgetIdAPI: any;
  findBudgetIdFromProjectIdApi: any;
  projectDetail: any;
  blockedPanel: any;
  isBookingAvailabe: boolean;
  bookingNotExistMessage = "No booking is available.";
  externlizedLines: any = [];
  vendorsList: any;
  searchList: any = ['name'];
  selectedDomainCheckBoxList: any = [];
  selectedCountryCheckBoxList: any = [];
  selectedCityCheckBoxList: any = [];
  sortBy: string;
  sortValue: number = -1;
  dropdownData = [];
  bookingsForOrder: any = [];
  orders: any = [];
  selectedOrder: any;
  showOrderEditModal: boolean;
  editOrderForm: FormGroup;
  attachments: any = [];
  addedAttachmentFileName = null;
  allowedExtensionsForAttachment = ['jpg', 'JPG', 'jpeg', 'JPEG', 'pdf'];
  invalidAttachmentFormatError: string;
  removedAttachments: any = [];
  orderForm: any;
  totalSum: 0;
  withVat: 0;
  updatedLines: any = [];


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService, private userDetailsService: UserDetailsService) {



  }


  ngOnInit() {

    // this.editOrderForm = this.createFormGroupForEdit();

    this.blockedPanel = true;
    this.dataService.checkSubmenu(this.router);
    this.route.params.subscribe(params => this.projectId = params.id);
    this.getProcurmentData();

    this.orderForm = this.createFormGroupForEdit(null);

    // initialize stream on units
    const myFormValueChanges$ = this.orderForm.controls['orderLines'].valueChanges;
    // subscribe to the stream so listen to changes on units
    myFormValueChanges$.subscribe(lines => {
      this.updateTotalUnitPrice(lines);
      this.updatedLines = lines;
    }

    );

    this.orderForm.get('tax').valueChanges.subscribe(value => {
      this.withVat = this.selectedOrder.totalPrice + (this.selectedOrder.totalPrice * value) / 100;
      console.log("withVat", this.withVat);
    });

    this.orderForm.get('attachment').get('feedByUrl').valueChanges.subscribe(

      (feedByUrl) => {
        if (feedByUrl == '1') {
          this.orderForm.get('attachment').get('url').enable();
          this.orderForm.get('attachment').get('url').setValidators(Validators.compose([Validators.required, Validators.pattern('(https://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?|(http://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]));

          this.orderForm.get('attachment').get('avatar').disable();
          this.orderForm.get('attachment').get('avatar').clearValidators();
        } else {
          this.orderForm.get('attachment').get('url').disable();
          this.orderForm.get('attachment').get('url').clearValidators();

          this.orderForm.get('attachment').get('avatar').enable();
          this.orderForm.get('attachment').get('avatar').setValidators(Validators.required);
        }
        this.orderForm.get('attachment').get('url').updateValueAndValidity();
        this.orderForm.get('attachment').get('avatar').updateValueAndValidity();
      });


  }


  getProcurmentData() {
    this.blockedPanel = true;
    this.findBudgetIdFromProjectIdApi = this.httpService.callApi('findBudgetIdFromProjectId', { pathVariable: "/" + this.projectId });
    this.bookingDetailByBudgetIdAPI = this.httpService.callApi('getProcurmentByProjectId', { pathVariable: this.projectId });

    let dropDownDataAPI = this.httpService.callApi('getVendorDropdown', {});
    let ordersByProjectAPI = this.httpService.callApi('getOrdersByProjectId', { pathVariable: this.projectId });
    forkJoin([this.findBudgetIdFromProjectIdApi, this.bookingDetailByBudgetIdAPI, dropDownDataAPI, ordersByProjectAPI]).subscribe(resultList => {
      this.projectDetail = resultList[1];
      this.projectDetail.externalLinesForOrder.forEach(booking => {
        booking.from = moment(booking.from).tz("Asia/Calcutta").format();
        booking.to = moment(booking.to).tz("Asia/Calcutta").format();
        booking.start = moment(booking.start).tz("Asia/Calcutta").format();
        booking.end = moment(booking.end).tz("Asia/Calcutta").format();
      });
      this.externlizedLines = this.projectDetail.externalLinesForOrder;
      this.vendorsList = this.projectDetail.vendorListForOrder;
      this.dropdownData = resultList[2];
      this.orders = resultList[3];

      let pathVariable: any = new Array();
      if (resultList[0]) {
        pathVariable.push({ "budgetId": resultList[0] });
      }
      pathVariable.push({ "projectId": this.projectId });
      this.dataService.addPathvariables(pathVariable);
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      console.log('Error[1] ', errorList[1]);
      console.log('Error[2] ', errorList[2]);
      this.blockedPanel = false;
      this.isBookingAvailabe = true;
    });
  }

  onFilter(filterData, filterType) {

    try {

      if (filterType == 'domain') {
        if (this.selectedDomainCheckBoxList.indexOf(filterData) >= 0) {
          this.selectedDomainCheckBoxList.splice(this.selectedDomainCheckBoxList.indexOf(filterData), 1);
        }
        else {
          this.selectedDomainCheckBoxList.push(filterData);
        }

        this.selectedDomainCheckBoxList = JSON.parse(JSON.stringify(this.selectedDomainCheckBoxList));
      }

      if (filterType == 'country') {
        if (this.selectedCountryCheckBoxList.indexOf(filterData) >= 0) {
          this.selectedCountryCheckBoxList.splice(this.selectedCountryCheckBoxList.indexOf(filterData), 1);
        }
        else {
          this.selectedCountryCheckBoxList.push(filterData);
        }

        this.selectedCountryCheckBoxList = JSON.parse(JSON.stringify(this.selectedCountryCheckBoxList));
      }

      if (filterType == 'city') {
        if (this.selectedCityCheckBoxList.indexOf(filterData) >= 0) {
          this.selectedCityCheckBoxList.splice(this.selectedCityCheckBoxList.indexOf(filterData), 1);
        }
        else {
          this.selectedCityCheckBoxList.push(filterData);
        }

        this.selectedCityCheckBoxList = JSON.parse(JSON.stringify(this.selectedCityCheckBoxList));
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  sort(sortBy: string) {
    if (this.sortBy != sortBy) {
      this.sortValue = -1;
    }
    this.sortBy = sortBy;
    this.sortValue *= -1;
  }

  addOrRemoveBooking(booking: any) {
    if (!this.bookingsForOrder.includes(booking)) {
      this.bookingsForOrder.push(booking);
    } else {
      this.bookingsForOrder.splice(this.bookingsForOrder.indexOf(booking), 1);
    }
  }

  createOrder(vendor: any) {
    if (this.bookingsForOrder.length < 1) {
      this.toastr.warning("Please select at least one booking item.")
    } else {
      if (confirm("Are you sure to place an order?")) {

        this.blockedPanel = true;
        let body = {
          "supplierId": vendor.id,
          "projectId": this.projectDetail.id,
          "lines": this.bookingsForOrder
        };

        this.httpService.callApi('createOrder', { body: body }).subscribe(response => {
          this.toastr.success("Order created succesfully.")
          this.getProcurmentData();
         
          this.bookingsForOrder = [];

        }, error => {
          this.blockedPanel = false;
          this.toastr.error(error.error.message)
          console.log(error.error.message)
        });
      }
    }


  }
  openOrderWinodw(order: any) {
    this.selectedOrder = order;
    this.editOrderForm = this.createFormGroupForEdit(order);
    this.clearFormArray(this.orderLinesForm);
    order.lines.forEach(element => {
      this.addExtra(element);
    });
    this.showOrderEditModal = true;

  }

  closeOrderWinodw() {

    this.showOrderEditModal = false;
  }
  /*-  To create from for edit */
  createFormGroupForEdit(order: any) {
    if (order) {
      this.attachments = order.attachments;
    }

    return this.formBuilder.group({
      orderLines: this.formBuilder.array([]),
      comment: [order && order.information ? order.information.comment : ''],
      paymentTerms: [order ? order.paymentTerms : ''],
      totalLocalPrice: [order ? order.totalLocalPrice : ''],
      orderStatus: [order ? order.status : null],
      attachment: this.formBuilder.group({
        attachmentType: [null,Validators.required],
        feedByUrl: '',
        avatar: [null, Validators.required],
        url: [{ value: null, disabled: true }]
      }),
      tax: [order ? order.procurementTax : 0]
    });

  }
  /*-  To handle event on FileChange for attachments*/
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();

      if (this.isInArray(this.allowedExtensionsForAttachment, fileExtension) && file.size < 2097152) {
        this.invalidAttachmentFormatError = null;
        this.orderForm.get('attachment').get('avatar').setValue(file);

        this.addedAttachmentFileName = "Successfully added File:" + file.name;
      } else if (file.size > 2097152) {
        this.addedAttachmentFileName = null;
        this.orderForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "File size should not be greater than 2MB."
      }
      else {
        this.addedAttachmentFileName = null;
        this.orderForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "Only jpg or jpeg or pdf  format allowed!!"
      }


    }
  }
  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  /*-To Add different values for Email,Telephone,Function,Skill,Language,Attachment,Role,Group,Document-*/
  addContents(addTo: string) {
    switch (addTo) {

      case 'Attachment':
        {
          let fileExtention = '';
          if (!this.orderForm.get('attachment').get('feedByUrl').value) {
            fileExtention = this.orderForm.get('attachment').get('avatar').value.name.split('.').pop().toLowerCase();
          }
          let type = this.orderForm.get('attachment').get('attachmentType').value;
          this.attachments.push({ 'type': type, 'extension': fileExtention, 'feedByUrl': this.orderForm.get('attachment').get('feedByUrl').value ? 'true' : 'false', 'avatar': this.orderForm.get('attachment').get(this.orderForm.get('attachment').get('feedByUrl').value ? 'url' : 'avatar').value })
          this.orderForm.get('attachment').reset();
          this.addedAttachmentFileName = null;
          break;
        }
    }

  }


  removeContents(obj: any, removeFrom: String) {
    switch (removeFrom) {
      case 'Attachment':
        {
          if (obj.id) {
            this.removedAttachments.push(obj.id);
          }
          this.attachments.splice(this.attachments.indexOf(obj), 1);
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

  addExtra(ex: any) {
    {
      const line = this.formBuilder.group({
        id: [ex.id],
        function: [ex.function],
        qtySoldPerOc: [ex.qtySoldPerOc ? ex.qtySoldPerOc : 0],
        basis: [{ value: ex.unitPriceBasis, disabled: true }, Validators.required],
        currency: [{ value: ex.currency, disabled: true }, Validators.required],
        synQty: [false],
        qtyUsedPerOc: [{ value: ex.qtyUsedPerOc, disabled: true }],
        unitPrice: [ex.unitPrice],
        unitCost: [ex.unitPrice],
        discountRate: [ex.discountRate],
        discountAmount: [null],
        totalLocalPrice: [{ value: ex.totalLocalPrice, disabled: true }],

      })
      // console.log("orderLine",line);
      this.orderLinesForm.push(line);
      //  console.log("main ",this.editOrderForm)
    }
  }

  get orderLinesForm() {
    return this.orderForm.get('orderLines') as FormArray;
  }


  private updateTotalUnitPrice(lines: any) {
    // get our units group controll
    const control = <FormArray>this.orderForm.controls['orderLines'];
    // before recount total price need to be reset. 
    this.totalSum = 0;
    for (let i in lines) {

      let totalUnitPrice = (lines[i].qtySoldPerOc * lines[i].unitPrice);
      totalUnitPrice = totalUnitPrice - (totalUnitPrice * lines[i].discountRate) / 100;

      // now format total price with angular currency pipe
      // let totalUnitPriceFormatted = this.currencyPipe.transform(totalUnitPrice, 'USD', 'symbol-narrow', '1.2-2');
      // update total sum field on unit and do not emit event myFormValueChanges$ in this case on units
      control.at(+i).get('totalLocalPrice').setValue(totalUnitPrice, { onlySelf: true, emitEvent: false });
      this.totalSum += totalUnitPrice;

    }
    this.selectedOrder.totalPrice = this.totalSum;
    this.withVat = this.selectedOrder.totalPrice + (this.selectedOrder.totalPrice * this.orderForm.get('tax').value) / 100;

  }

  updateOrder() {
    this.blockedPanel = true;
    let body = {
      "id": this.selectedOrder.id,
      "lines": this.updatedLines,
      "paymentTerms": this.orderForm.get('paymentTerms').value,
      "procurementTax": this.orderForm.get('tax').value,
      "status": this.orderForm.get('orderStatus').value,
      "information": { "comment": this.orderForm.get('comment').value }
    }

    this.httpService.callApi('updateOrder', { body: body }).subscribe(response => {
      // this.toastr.success("Order updated succesfully.")
      this.saveAttachment(this.selectedOrder.id, 0);
      this.getProcurmentData();
      this.blockedPanel = false;
      
      this.bookingsForOrder = [];
      this.showOrderEditModal = false;

    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message)
      console.log(error.error.message)
    });
  }
  /*-  To upload attachments*/
  saveAttachment(orderId: number, index: number): string {

    if (index >= this.attachments.length) {
      if (this.removedAttachments.length > 0) {
        this.deleteAttcahments();
      } else {

        this.toastr.success('Successfully Saved', "Order");
      }

      return;
    }
    let element = this.attachments[index];
    if (!element.id) {
      let body = new FormData();
      body.append(element.feedByUrl == 'true' ? 'url' : 'fileContent', element.avatar);
      body.append('attachmentType', element.type);
      body.append('isFeedByUrl', element.feedByUrl);
      body.append('discriminator', 'order');
      this.httpService.callApi("uploadAttachment", { body: body, pathVariable: orderId }).subscribe((respone) => {

        this.saveAttachment(orderId, ++index);
      }, (error) => {

        this.toastr.error(error.error.message, "Order");
        console.log('error ', error)
      });
    } else {

      this.saveAttachment(orderId, ++index);
    }
  }


  deleteAttcahments() {
    let pathVariable: string = '/' + this.selectedOrder.id + '/order';
    this.httpService.callApi("deleteAttachments", { pathVariable: pathVariable, body: this.removedAttachments }).subscribe((responce) => {
      this.toastr.success('Successfully Saved', "Order");
      //this.closeModalEvent.emit(false);
    }, (error) => {

    });
  }

  clearSpace(form, fieldName) {
    if (form.get(fieldName).value)
      form.get(fieldName).setValue(form.get(fieldName).value.trim());
  }

}
