import { Component, OnInit, HostListener } from '@angular/core';
import { getCurrencySymbol } from '@angular/common'
import { Observable } from '../../../node_modules/rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { DataService } from '../core/services/data.service';
import { UserDetailsService } from '../core/services/user-details.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { DayPilot } from "daypilot-pro-angular";
import { distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-sequential-booking',
  templateUrl: './sequential-booking.component.html',
  styleUrls: ['./sequential-booking.component.scss']
})
export class SequentialBookingComponent implements OnInit {

  showEditProjectModal: boolean = false;
  projectDetail: any;
  projectId: number;
  loggedInUser: any;
  addLineForm: FormGroup;
  isEquipmentManager: boolean = false;
  isEditLineModalOpen: boolean = false;
  showAddLineModal: boolean = false;
  dropdownDataAPI: any;
  projectDetailByIdAPI: any;
  dropdownData: any;
  resourceTypes: any = [];
  resourceList: any = [];
  blockedPanel: boolean = false;
  selectedLine: any;
  getCurrencySymbol = getCurrencySymbol;
  extras: any = [];
  rateOnSlectedFunction: any = [];
  manualUpdate: boolean = false;
  editLineForm: FormGroup;
  innerHeight: any;
  removedAttachments: any = [];
  attachments: any = [];
  lineEditHeightStyle: any;
  findProjectByBudgetApi: any;
  bookingExist: any = false;
  bookingDetailByBudgetIdAPI: any;
  changedByDueDate: any = true;
  bookingNotExistMessage = "No booking is available.";
  isBookingAvailabe: any = false;

  showTemplateModal: boolean = false;
  templateForm: any;
  templateList: any = [];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService, private userDetailsService: UserDetailsService) {
    this.innerHeight = window.innerHeight - 70;
    this.lineEditHeightStyle = {
      'max-height': innerHeight + 'px',
      'overflow': 'auto'
    };

    this.templateForm = this.createTemplateForm();

  }

  
  ngOnInit() {
    this.route.params.subscribe(params => this.projectId = params.id);
    // if (this.projectId.toString() == "undefined" && !this.dataService.pathVariable) {
    //   this.router.navigate(["/teamium/project-list"]);
    // }

    this.dataService.checkSubmenu(this.router);
    this.blockedPanel = true;
    this.addLineForm = this.createFormGroup();
    let findBudgetIdFromProjectIdApi = this.httpService.callApi('findBudgetIdFromProjectId', { pathVariable: "/" + this.projectId });
    this.dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    this.bookingDetailByBudgetIdAPI = this.httpService.callApi('getBookingByBookingId', { pathVariable: this.projectId })

    this.editLineForm = this.creatEditLineFormGroup();

    forkJoin([this.dropdownDataAPI, findBudgetIdFromProjectIdApi, this.bookingDetailByBudgetIdAPI]).subscribe(resultList => {
      this.dropdownData = resultList[0];
      this.projectDetail = resultList[2];


      this.templateList = this.dropdownData.templateList || [];
      if (this.projectDetail && this.projectDetail.templateLayout && this.projectDetail.templateLayout.hasOwnProperty('title') == true) {
        this.templateForm.get('templateName').setValue(this.projectDetail.templateLayout.title);
      }


      let pathVariable: any = new Array();
      if (resultList[1]) {
        pathVariable.push({ "budgetId": resultList[1] });
      }
      pathVariable.push({ "projectId": this.projectId });

      this.dataService.addPathvariables(pathVariable);

      this.resourceList = this.dropdownData.functionsByType.Equipment;
      this.resourceList.forEach(element => {

        this.addQtyOnFunction();
      });

      this.resourceTypes = ["Equipment", "Personnel", "Services", "Copyright", "Supplier", "Template"];
      // this.resourceTypes =  Object.keys(this.dropdownData.functionsByType) || []; 
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      console.log('Error[0] ', errorList[1]);
      this.blockedPanel = false;
      this.isBookingAvailabe = true;
    });

    this.addLineForm.get('resource').get('selectedResourceType').valueChanges.subscribe((value) => {
      this.getResource(this.addLineForm.get('resource').get('selectedResourceType').value);

    });
    this.editLineForm.get('active').valueChanges.subscribe(value => {
      this.selectedLine.active = value;
    });

    this.editLineForm.get('from').valueChanges.subscribe(value => {
      if (!this.manualUpdate) {
        let diff = this.getDateDiff(value, this.editLineForm.get('to').value)
        this.editLineForm.get('qtyUsedPerOc').setValue(diff);
        this.editLineForm.get('qtySoldPerOc').setValue(diff);
        this.selectedLine.from = value;
        this.selectedLine.qtyUsedPerOc = diff;
        this.selectedLine.qtySoldPerOc = diff;
      }
      this.selectedLine.start = moment(this.selectedLine.from).tz("Asia/Calcutta").format()

    }
    );
    this.editLineForm.get('to').valueChanges.subscribe(value => {
      if (!this.manualUpdate) {
        let diff = this.getDateDiff(this.editLineForm.get('from').value, value);
        this.editLineForm.get('qtyUsedPerOc').setValue(diff);
        this.editLineForm.get('qtySoldPerOc').setValue(diff);
        this.selectedLine.to = value;

        this.selectedLine.qtyUsedPerOc = diff;
        this.selectedLine.qtySoldPerOc = diff;
      } else {
        this.changedByDueDate = false;
        this.selectedLine.dateChange = true;
        this.selectedLine.qtyChange = false;
        this.selectedLine.to = value;
        let diff = Math.round(new DayPilot.Duration(new DayPilot.Date(this.editLineForm.get('from').value), new DayPilot.Date(value)).totalDays()) + 1;
        this.editLineForm.get('qtyUsedPerOc').setValue(diff);
      }
      this.selectedLine.end = moment(this.selectedLine.to).tz("Asia/Calcutta").format()
    }
    );


    this.editLineForm.get('synQty').valueChanges.distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)).subscribe(value => {
      this.manualUpdate = value;
      this.selectedLine.syncQty = value;
      this.selectedLine.qtyChange = value;
      if (value) {
        this.editLineForm.get('rateCard').setValue(0);
        this.selectedLine.rate = null;
        this.editLineForm.get('basis').enable();
        this.editLineForm.get('currency').enable();
        this.editLineForm.get('qtySoldPerOc').enable();
        this.editLineForm.get('qtyUsedPerOc').enable();
      } else {
        this.editLineForm.get('basis').disable();
        this.editLineForm.get('currency').disable();
        this.editLineForm.get('qtySoldPerOc').enable();
        this.editLineForm.get('qtyUsedPerOc').enable();
      }
    });

    this.editLineForm.get('rateCard').valueChanges.distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)).subscribe(value => {

      if (value != 0) {

        let rate = this.rateOnSlectedFunction.find(dt => dt.id == value);
        if (rate) {

          this.selectedLine.syncQty = false;
          this.selectedLine.rate = rate;

          this.applyRateCard(rate);
        }
      } else {
        this.selectedLine.syncQty = true;
        this.selectedLine.rate = null;
        this.editLineForm.get('synQty').setValue(true);
      }
    });


    this.editLineForm.get('occurrenceCount').valueChanges.subscribe(value => {
      this.calculateSaleSection();
      this.calculateCostSection();
      this.selectedLine.occurrenceCount = value;
    });
    this.editLineForm.get('basis').valueChanges.subscribe(value => {

      this.selectedLine.unitPriceBasis = value;
    });

    this.editLineForm.get('currency').valueChanges.subscribe(value => {
      this.selectedLine.persistentCurrency = value;
    });

    this.editLineForm.get('qtySoldPerOc').valueChanges.distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)).subscribe(value => {
      this.selectedLine.qtySoldPerOc = value;
      this.selectedLine.qtyUsedPerOc = value;
      this.calculateSaleSection();
    });

    this.editLineForm.get('unitPrice').valueChanges.subscribe(value => {
      this.selectedLine.unitPrice = value;
      this.calculateSaleSection();
    });

    this.editLineForm.get('qtyUsedPerOc').valueChanges.distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)).subscribe(value => {
      if (value != "" && value != null) {
        this.selectedLine.qtyUsedPerOc = value;
        if (this.manualUpdate) {
          let dueDate = this.editLineForm.get('to').value;
          if (dueDate != null) {
            if (this.changedByDueDate) {
              let newFromDate = this.getDateBeforeOrAfterNDays(dueDate, value, true);
              newFromDate.setDate(newFromDate.getDate() + 1);
              this.editLineForm.get('from').setValue(newFromDate);
              this.selectedLine.from = newFromDate;
              this.selectedLine.start = moment(this.selectedLine.from).tz("Asia/Calcutta").format();
              this.selectedLine.dateChange = false;
              this.selectedLine.qtyChange = true;
            }
            this.changedByDueDate = true;
          }
        }
        this.calculateCostSection();
      } else {
        this.selectedLine.qtyUsedPerOc = 0;
      }
    });

    this.editLineForm.get('unitCost').valueChanges.subscribe(value => {
      if (value != "" && value != null) {
        this.selectedLine.unitCost = value;
        this.calculateCostSection();
      } else {
        this.selectedLine.unitCost = 0;
      }

    });


    this.editLineForm.get('discountRate').valueChanges.subscribe(value => {
      this.calculateSaleSection();
      this.selectedLine.discountRate = value;
    });

    this.editLineForm.get('vatRate').valueChanges.subscribe(value => {
      this.calculateSaleSection();
      this.selectedLine.vatRate = value;
    });
    this.editLineForm.get('description').valueChanges.subscribe(value => {
      this.selectedLine.comment = value;
    });

    this.editLineForm.get('extras').valueChanges.distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)).subscribe(value => {
      this.selectedLine.extras = value;
      this.calculateSaleSection();
      this.calculateCostSection();
    });

  }

  createFormGroup(): FormGroup {
    let from = new Date();
    from.setHours(9);
    from.setMinutes(0)
    let to = new Date();
    to.setHours(from.getHours() + 24);
    to.setMinutes(0);
    return this.formBuilder.group({
      resource: this.formBuilder.group({
        selectedResourceType: ['Equipment'],
        from: [from],
        to: [to],
        searchBy: [null],
        qtyOnFunction: this.formBuilder.array([])
      })
    });
  }

  get qtyOnFunctionForm() {
    return this.addLineForm.get('resource').get('qtyOnFunction') as FormArray
  }

  addQtyOnFunction() {
    const qty = this.formBuilder.group({
      qty: [1]
    })

    if (this.qtyOnFunctionForm)
      this.qtyOnFunctionForm.push(qty);

  }

  increaseQtyOnFunction(index: number) {
    let qty = this.qtyOnFunctionForm.controls[index].get('qty').value;
    if(qty >= 99){
      qty = 99;
      this.qtyOnFunctionForm.controls[index].get('qty').setValue(qty);
    } else {
      this.qtyOnFunctionForm.controls[index].get('qty').setValue(qty + 1);
    }
  }

  decreaeseQtyOnFunction(index: number) {
    let qty = this.qtyOnFunctionForm.controls[index].get('qty').value;
    if (qty > 1) {
      this.qtyOnFunctionForm.controls[index].get('qty').setValue(qty - 1);
    }

  }

  createTemplateForm = () => {
    return this.formBuilder.group({
      templateName: [null, Validators.required]
    })
  }



  getResource(resourceType): any {
    let resourceTypeToGet = resourceType.toLowerCase();
    switch (resourceTypeToGet) {
      case 'equipment': {
        this.resourceList = this.dropdownData.functionsByType.Equipment;
        break;
      }
      case 'personnel': {
        this.resourceList = this.dropdownData.functionsByType.Personnel;
        break;
      }
      case 'services': {
        this.resourceList = this.dropdownData.functionsByType.Services;
        break;
      }
      case 'copyright': {
        this.resourceList = this.dropdownData.functionsByType.Copyright;
        break;
      }
      case 'supplier': {
        this.resourceList = this.dropdownData.functionsByType.Supplier;
        break;
      }
      case 'template': {
        this.resourceList = this.templateList || [];
      }
    }
    this.clearFormArray(this.qtyOnFunctionForm);
    this.resourceList.forEach(element => {

      this.addQtyOnFunction();
    });

  }

  addLine(resourceFunction: any, index) {
    let from = this.addLineForm.get('resource').get('from').value;
    let to = this.addLineForm.get('resource').get('to').value;

    let newLine = {
      "id": null,
      "version": null,
      "function": resourceFunction,
      "from": from,
      "to": to,
      "syncQty": false,
      "occurrenceCount": this.qtyOnFunctionForm.controls[index].get('qty').value,
      "start": moment(from).tz("Asia/Kolkata").format(),
      "end": moment(to).tz("Asia/Kolkata").format(),
    }
    this.addOrSaveLine(newLine, 'Line added succesfully.');

  }


  openTemplateModal = () => {

    if (this.projectDetail && this.projectDetail.templateLayout && this.projectDetail.templateLayout.hasOwnProperty('title') == true) {
      return;
    }


    if (this.projectDetail && this.projectDetail.lines && this.projectDetail.lines.length == 0) {
      this.toastr.warning("Project must have atleast one line event.");
      return;
    }

    if ((this.projectDetail.status == 'To Do' || this.projectDetail.status == 'In Progress') && (this.projectDetail.financialStatus == undefined || this.projectDetail.financialStatus == null || this.projectDetail.financialStatus == 'Revised')) {
      this.showTemplateModal = true;
    }
    else {
      this.toastr.warning("Invalid project status or financial status");
    }

  }

  closeTemplateModal = () => {
    this.showTemplateModal = false;
    this.templateForm.get('templateName').setValue('');
  }

  onCreateTempalte = () => {

    let templateName = this.templateForm.get('templateName').value || '';
    templateName = templateName.trim();

    let budgetId = this.projectDetail.id || '';
    let bodyData = {
      title: templateName || ''
    }

    this.httpService.callApi('saveNewTemplateToBooking', { body: bodyData, pathVariable: budgetId }).subscribe(response => {
      this.blockedPanel = false;
      if (response && response.hasOwnProperty('templateLayout')) {
        this.projectDetail = response;
        if (this.projectDetail && this.projectDetail.templateLayout && this.projectDetail.templateLayout.hasOwnProperty('title') == true) {
          this.templateForm.get('templateName').setValue(this.projectDetail.templateLayout.title);
        }
      }

      this.toastr.success("Template created succesfully.")
      this.getDropdownData();
      this.closeTemplateModal()

    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message)
      console.log(error.error.message)
    });

  }


  getDropdownData = () => {
    this.httpService.callApi('getProjectDropdown', {}).subscribe(response => {
      this.templateList = response.templateList || [];
    }, error => {
      this.toastr.error(error.error.message)
      console.log(error.error.message)
    });
  }




  /*-To close create-equipment component and refresh it. -*/
  closeModal($event) {
    this.showEditProjectModal = $event;
    this.ngOnInit();
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

  showLineEditModal(line: any) {
    if (this.projectDetail.status == 'Done' && this.projectDetail.financialStatus == 'Approved') {
      this.toastr.warning("Cannot edit line as the project has been approved.");
    } else {

      this.selectedLine = JSON.parse(JSON.stringify(line));// line;
      let discout = this.selectedLine.discountRate;
      let tax = this.selectedLine.vatRate;


      this.selectedLine.end = moment(this.selectedLine.to).tz("Asia/Calcutta").format()
      this.selectedLine.start = moment(this.selectedLine.from).tz("Asia/Calcutta").format()
      this.manualUpdate = this.selectedLine.syncQty;
      this.editLineForm.get('qtyUsedPerOc').setValue(this.selectedLine.qtyUsedPerOc);
      this.editLineForm.get('active').setValue(this.selectedLine.active);
      this.editLineForm.get('description').setValue(this.selectedLine.comment);
      this.editLineForm.get('from').setValue(new Date(this.selectedLine.from));
      this.editLineForm.get('to').setValue(new Date(this.selectedLine.to));
      this.editLineForm.get('occurrenceCount').setValue(this.selectedLine.occurrenceCount);
      this.editLineForm.get('qtySoldPerOc').setValue(this.selectedLine.qtySoldPerOc);
      this.editLineForm.get('basis').setValue(this.selectedLine.rate ? this.selectedLine.rate.basis : this.selectedLine.unitPriceBasis ? this.selectedLine.unitPriceBasis : 'Day');
      this.editLineForm.get('currency').setValue(this.selectedLine.rate ? this.selectedLine.rate.currency : this.selectedLine.persistentCurrency);
      this.editLineForm.get('synQty').setValue(this.selectedLine.syncQty);
      this.editLineForm.get('rateCard').setValue(this.selectedLine.rate ? this.selectedLine.rate.id : 0);
      this.editLineForm.get('unitPrice').setValue(this.selectedLine.unitPrice);
      this.editLineForm.get('unitCost').setValue(this.selectedLine.unitCost);
      this.editLineForm.get('discountRate').setValue(discout);
      this.editLineForm.get('discountAmount').setValue(this.selectedLine.discountAmount);
      this.editLineForm.get('vatRate').setValue(tax);
      this.editLineForm.get('vatAmount').setValue(this.selectedLine.vatAmount);
      this.editLineForm.get('totalLocalPrice').setValue(this.selectedLine.totalLocalPrice);
      this.editLineForm.get('extraCost').setValue(this.selectedLine.extraCost);
      this.editLineForm.get('totalLocalCost').setValue(this.selectedLine.totalLocalCost);
      this.editLineForm.get('totalWithVat').setValue(this.selectedLine.totalWithTax);
      this.editLineForm.get('totalWithQuantity').setValue(this.selectedLine.totalPriceWithOccurenceCount);
      this.editLineForm.get('totalLocalCostWithQuantity').setValue((this.selectedLine.totalCostWithOccurenceCount));

      this.getRatesByFunction(() => {
        this.isEditLineModalOpen = true;
        if (this.selectedLine.from) {
          this.selectedLine.from = new Date(this.selectedLine.from)
        }
        if (this.selectedLine.to) {
          this.selectedLine.to = new Date(this.selectedLine.to)
        }
      });

      this.clearFormArray(this.extrasForm);
      this.selectedLine.extras.forEach(element => {
        this.addExtra(element);
      });
      this.calculateSaleSection();
      this.calculateCostSection();
    }
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  showAddLineModalView() {

    if (this.projectDetail.status == 'Done' && this.projectDetail.financialStatus == 'Approved') {
      this.toastr.warning("Cannot add lines as the project has been approved and done.");
    } else {
      this.showAddLineModal = !this.showAddLineModal;
    }
  }
  removeLine(line: any) {
    if (confirm("Are you sure to delete this line?")) {
      this.httpService.callApi('deleteLineFromBudget', { pathVariable: line.id }).subscribe(response => {
        this.blockedPanel = false;
        this.projectDetail = response;
        this.isEditLineModalOpen = false;
        this.selectedLine = null;
        this.toastr.success("Line deleted succesfully.")
      }, error => {
        this.blockedPanel = false;
        this.toastr.error(error.error.message)
        console.log(error.error.message)
      });
    }
    //this.projectDetail.lines.splice(this.projectDetail.lines.indexOf(line), 1);
  }



  addTemplate = (template) => {


    ///budget/apply/template/{budgetId}/{templateId}

    let templateId = template.id;
    let budgetId = this.projectDetail.id;
    let pathVariable = budgetId + "/" + templateId
    this.httpService.callApi('addTemplateToBooking', { pathVariable: pathVariable }).subscribe(response => {
      this.blockedPanel = false;
      this.projectDetail = response;
      this.toastr.success("Template added succesfully.")
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message)
      console.log(error.error.message)
    });
  }


  closeEditLineModal() {
    this.isEditLineModalOpen = false;
    this.selectedLine = undefined;
  }

  /*-To save a line -*/
  saveLine() {
    this.selectedLine.extras = this.editLineForm.get('extras').value;
    if (!this.manualUpdate && this.selectedLine.rate == null) {
      this.toastr.warning("Please select a Rate card While using manual update off!");
    } else if (this.manualUpdate && (this.editLineForm.get('basis').invalid || this.editLineForm.get('currency').invalid)) {
      this.toastr.warning("Please select a basis and currency.");
    }
    else {
      this.addOrSaveLine(this.selectedLine, 'Line saved succesfully.');
    }
  }

  addOrSaveLine(line: any, message: string) {
    this.blockedPanel = true;
    this.httpService.callApi('addLineToProject', { pathVariable: this.projectDetail.id, body: line }).subscribe(response => {
      this.blockedPanel = false;
      this.projectDetail = response;
      this.toastr.success(message)
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message)
      console.log(error.error.message)
    });
  }
  /*-  To save equipment*/
  saveProject() {
    if (this.projectDetail.status == 'Done' && this.projectDetail.financialStatus == 'Approved') {
      this.toastr.warning("Cannot update booking as the project has been approved and done.");
    } else {
      this.isEditLineModalOpen = false;
      this.blockedPanel = true;
      let body = this.projectDetail;
      this.httpService.callApi('saveProject', { body: body }).subscribe((response) => {
        this.toastr.success("Successfully saved", 'Booking');
        this.blockedPanel = false;
        this.selectedLine = undefined;
        this.ngOnInit();
      }, error => {
        this.toastr.error(error.error.message, 'Booking');
        console.log('Error getstatus => ', error)
        this.blockedPanel = false;
      });
    }


  }

  bookAllLines() {
    if (confirm('Are you sure to book all lines.Once you booked, you can not change the lines.Budget will freezed.')) {
      this.httpService.callApi('createProjectBooking', { body: this.projectDetail }).subscribe((response) => {
        this.toastr.success("Successfully saved", 'Booking');
        let pathVariable: any = new Array();
        if (response) {
          this.bookingExist = true;
          pathVariable.push({ "projectId": response.id });
        } else {
          pathVariable.push({ "projectId": 'undefined' });
        }
        pathVariable.push({ "budgetId": this.projectId });
        this.dataService.addPathvariables(pathVariable);
        this.blockedPanel = false;
        this.ngOnInit();
      }, error => {
        this.toastr.error(error.error.message, 'Booking');
        console.log('Error getstatus => ', error)
        this.blockedPanel = false;
      });
    }
  }

  getDaysDiff() {

    this.selectedLine.qtyUsedPerOc = new DayPilot.Duration(new DayPilot.Date(this.selectedLine.from), new DayPilot.Date(this.selectedLine.to)).totalDays();
  }

  applyBookingDateToAllLines() {

    if (confirm("Are you sure to apply these dates to all bookings?It will change the budget.")) {
      this.blockedPanel = true;
      this.httpService.callApi('applyDateToAllLinesOnProject', { body: this.selectedLine, pathVariable: this.projectDetail.id }).subscribe((response) => {
        this.blockedPanel = false;
        this.projectDetail = response;
        this.isEditLineModalOpen = false;
        this.selectedLine = null;
      }, error => {
        this.toastr.error(error.error.message, 'Booking');
        console.log('Error getstatus => ', error)
        this.blockedPanel = false;
      });

    }
  }

  getRatesByFunction(cb) {
    this.blockedPanel = true;

    this.httpService.callApi('getRatesByFunction', { pathVariable: this.selectedLine.function.id }).subscribe((response) => {
      this.rateOnSlectedFunction = response;
      this.blockedPanel = false;
      cb();

    }, error => {
      this.toastr.error(error.error.message, 'Booking');
      console.log('Error getstatus => ', error)
      this.blockedPanel = false;
    });
  }

  creatEditLineFormGroup(): FormGroup {
    let editLineForm = this.formBuilder.group({
      active: [true],
      description: [null],
      from: [null],
      to: [null],
      occurrenceCount: [{ value: 1, disabled: true }],
      qtySoldPerOc: [{ value: 0, disabled: true }],
      basis: [{ value: null, disabled: true }],
      currency: [{ value: null, disabled: true }],
      synQty: [false],
      qtyUsedPerOc: [{ value: null, disabled: true }],

      rateCard: [null],
      unitPrice: [null],
      unitCost: [null],
      discountRate: [0],
      discountAmount: [null],
      vatRate: [0],
      vatAmount: [null],
      totalLocalPrice: [null],
      extraCost: [null],
      totalLocalCost: [null],
      totalWithVat: [0],
      totalWithQuantity: [0],
      totalLocalCostWithQuantity: [0],
      extras: this.formBuilder.array([])
    });

    return editLineForm;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = window.innerHeight - 70;
    this.lineEditHeightStyle = {
      'max-height': innerHeight + 'px',
      'overflow': 'auto'
    };
  }

  get extrasForm() {
    return this.editLineForm.get('extras') as FormArray
  }

  addExtra(ex: any) {
    if (!ex) {
      const extra = this.formBuilder.group({
        id: [null],
        label: [],
        price: [0],
        cost: [0],
      })
      this.extrasForm.push(extra);
    } else {
      const extra = this.formBuilder.group({
        id: [ex.id],
        label: [ex.label],
        price: [ex.price],
        cost: [ex.cost],
      })
      this.extrasForm.push(extra);
    }


  }

  deleteExtra(i) {
    this.extrasForm.removeAt(i)
  }

  goToSchedule(line) {
    // this.blockedPanel = true;
    // this.httpService.callApi('findBookingEventFromLineId', { pathVariable: '/' + lineId }).subscribe((response) => {
    //   console.log('Line Response => ', response.event)
    //   this.blockedPanel = false;
    let pathVariable: any = new Array();
    pathVariable.push(line.event);
    this.dataService.addPathvariables(pathVariable);
    this.dataService.openSubmenu('/teamium/schedule-timeline');
    // }, (error) => {
    //   console.log('Eroor => ', error)
    //   this.blockedPanel = false;
    // })
    // this.router.navigate(['teamium/project-scheduler/' + this.projectDetail.id]);
  }

  calculateSaleSection() {
    let total = 0;
    let saleQty = this.editLineForm.get('qtySoldPerOc').value;
    let unitPrice = this.editLineForm.get('unitPrice').value;
    let extarTotal = 0;
    let discountRate = this.editLineForm.get('discountRate').value;
    if (discountRate == "" && discountRate == null) {
      discountRate = 0;
    }
    let vatRate = this.editLineForm.get('vatRate').value;

    if (vatRate == "" && vatRate == null) {
      vatRate = 0;
    }
    let extars = this.editLineForm.get('extras').value;
    let qty = this.editLineForm.get('occurrenceCount').value;
    extars.forEach(element => {
      extarTotal += element.price;
    });

    total = saleQty * unitPrice + extarTotal;

    let discountAmount = (total * discountRate) / 100;
    total = total - discountAmount;
    this.editLineForm.get('discountAmount').setValue(discountAmount.toFixed(2));


    if (vatRate) {
      let vatAmount = (total * vatRate) / 100;
      let totalWithVat = total + vatAmount;
      this.editLineForm.get('vatAmount').setValue(vatAmount.toFixed(2));
      this.editLineForm.get('totalWithVat').setValue((qty * totalWithVat).toFixed(2));
    } else {
      this.editLineForm.get('totalWithVat').setValue((qty * total).toFixed(2));
    }

    this.editLineForm.get('totalLocalPrice').setValue(total.toFixed(2));
    this.editLineForm.get('totalWithQuantity').setValue((qty * total).toFixed(2));
  }

  calculateCostSection() {
    let total: number = 0;
    let extraCostTotal: number = 0;
    let qty: number = this.editLineForm.get('occurrenceCount').value;
    let costQty: number = this.editLineForm.get('qtyUsedPerOc').value;
    let unitCost: number = this.editLineForm.get('unitCost').value;
    let extars = this.editLineForm.get('extras').value;
    extars.forEach(element => {
      extraCostTotal = extraCostTotal + element.cost;
    });
    total = (costQty * unitCost) + extraCostTotal;
    this.editLineForm.get('totalLocalCost').setValue(total.toFixed(2));
    this.editLineForm.get('totalLocalCostWithQuantity').setValue((qty * total).toFixed(2));
  }

  applyRateCard(rateCard: any) {
    this.editLineForm.get('qtySoldPerOc').setValue(rateCard.quantitySale);
    this.editLineForm.get('basis').setValue(rateCard.basis);
    this.editLineForm.get('currency').setValue(rateCard.currency);
    this.editLineForm.get('qtyUsedPerOc').setValue(rateCard.quantityCost);
    this.editLineForm.get('unitPrice').setValue(rateCard.unitPrice);
    this.editLineForm.get('unitCost').setValue(rateCard.unitCost);
    this.editLineForm.get('synQty').setValue(false);
  }

  addResourceToLine(line: any, resource: any) {
    this.blockedPanel = true;
    // line.resource = resource;
    let event = line.event;
    if (event.resource) {
      event.resource = resource.id;
      event.changeable = false;
      this.httpService.callApi('saveOrUpdateEvent', { body: [event] }).subscribe((resp) => {
        this.blockedPanel = false;
        this.ngOnInit();
      }, (error) => {
        this.blockedPanel = false;
      });
    }

  }

  getDateBeforeOrAfterNDays(date: Date, n: number, before: boolean): Date {
    if (date) {
      let newdDate = before ? new Date(date.getFullYear(), date.getMonth(), date.getDate() - n) : new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
      newdDate.setHours(date.getHours());
      newdDate.setMinutes(date.getMinutes());
      return newdDate;
    }
  }
  getDateDiff(start, end): number {
    if (start && end) {
      let days = new DayPilot.Duration(new DayPilot.Date(moment(start).format("YYYY-MM-DD")), new DayPilot.Date(moment(end).format("YYYY-MM-DD"))).totalDays();
      return days + 1;
    }
  }

  onlyNumber=(evt,value)=>{    
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    value=value+evt.key;
    if(parseInt(value)>99){
      return false;
    }
    return true;
  }

}
