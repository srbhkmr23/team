import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { HttpService } from '../core/services/http.service';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { HttpParams } from '../../../node_modules/@angular/common/http';
import { DISABLED } from '../../../node_modules/@angular/forms/src/model';


@Component({
    selector: 'app-create-work-order',
    templateUrl: './create-work-order.component.html',
    styleUrls: ['./create-work-order.component.scss']
})
export class CreateWorkOrderComponent implements OnInit {

    blockedPanel: boolean = false;
    @Input() selectedOrder: any;
    @Input() lineId: any;
    @Output() closeModalEvent = new EventEmitter<boolean>();
    orderForm: any;
    showTemplateText: any;
    modalText: string = '';
    availableOrderFormTypes: any;
    formList: any;
    openFormList: boolean;
    selectedFormType: any;
    orderType: any;
    disableOrder:boolean;

    constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) {

    }
    ngOnInit() {
        this.blockedPanel = true;
        this.getAvailableBookingOrderForms();
        this.orderForm = this.createFormGroup();
        this.orderType = this.selectedOrder.orderType === 'WORK_ORDER' ? 'Work Order' : this.selectedOrder.orderType === 'TRAVEL_ORDER' ? 'Travel Order' : 'Media Order';
        if (this.selectedOrder && this.selectedOrder.keywords) {
            this.modalText = "Edit " + this.orderType;
            this.selectedFormType = this.selectedOrder.formType;
            this.selectedOrder.keywords.forEach(element => {
                this.addKeywordsToOrderForm(element);
            });
        } else {
            this.selectedFormType = "Select Order Form";
            this.modalText = "Create " + this.orderType;
        }

        this.disabelingForm();
    }

    disabelingForm(){

        if(this.selectedOrder.status !== 0 && this.selectedOrder.hasOwnProperty('status')){            
            this.disableOrder = true;
            // this.orderForm.get('mediaId').disable();
        }

        if(this.selectedOrder.status === 2 && this.selectedOrder.hasOwnProperty('status')){
            this.orderForm.disable();
            this.disableOrder = true;
        }

    }

    hideOrderModal() {
        this.closeModalEvent.emit(false);
    }

    createFormGroup(): FormGroup {
        if (this.selectedOrder.id) {
            let form = this.formBuilder.group({
                lineId: [],
                id: [this.selectedOrder.id],
                version: [this.selectedOrder.version],
                formType: [this.selectedOrder.formType],
                orderType: [this.selectedOrder.orderType],
                comment: [this.selectedOrder.comment],
                mediaId: [this.selectedOrder.mediaId],
                status: [this.selectedOrder.status],
                searchText:[null],
                projectId: [{ value: this.selectedOrder.projectId, disabled: true }],
                keywords: this.formBuilder.array([])
            });
            return form;
        }
        else {
            return this.formBuilder.group({
                formType: ['Select Form Type', Validators.required],
                orderType: [this.selectedOrder.orderType, Validators.required],
                comment: [null],
                mediaId: [null],
                searchText:[null],
                projectId: [{ value: 0, disabled: true }],
                status: [1],
                keywords: this.formBuilder.array([])
            });
        }

    }
    get keywordsForm() {
        return this.orderForm.get('keywords') as FormArray;
    }

    addKeywordsToOrderForm(ex: any) {
        {
            const keyword = this.formBuilder.group({
                id: [ex.id],
                keyword: [ex.keyword, Validators.required],
                keywordValue: [ex.keywordValue],
                version: [ex.version]

            });
            this.keywordsForm.push(keyword);
        }
    }

    addKeywordToOrderForm(ex) {
        const keyword = this.formBuilder.group({
            keyword: [ex.key, Validators.required],
            keywordValue: [ex.keywordValue],
        });
        this.keywordsForm.push(keyword)
    }


    saveOrder(){
        if (this.orderForm.value.formType==="Select Order Form" || this.selectedFormType==='Select Order Form') {
            this.toastr.warning("Please provide a form type.");
        } else if (!this.orderForm.value.orderType || this.orderForm.value.orderType === 'null') {
            this.toastr.warning("Please select a order type.");
        } else if (this.orderForm.value.keywords.length < 1) {
            this.toastr.warning("Atleast one Keyword required.");
        }
       
        else {
            let body = this.orderForm.value;
            this.httpService.callApi('addOrderFormOnBooking', { pathVariable: this.lineId, body: body }).subscribe((response) => {
                this.toastr.success("Successfully saved", 'Order Form');
                this.closeModalEvent.emit(false);
            }, error => {
                this.blockedPanel = false;
                this.toastr.error(error.error.message, 'Order Form');
                console.log('Error getstatus => ', error)
            });
        }
    }

    saveOrderForm() {
        let message, status;
        status = this.selectedOrder.status === 1? 'In Progress': 'Done';

        if(this.selectedOrder.status === 2 && this.selectedOrder.hasOwnProperty('status')){
            this.toastr.warning('Order form status '+status+'. So It can not be updated.', 'Order Form');
        }
        else{
            this.saveOrder()
        }

    }

    deleteOrder(){
        if (confirm('Are you sure to delete order form?')) {
            let pathVariable = '?bookingId=' + this.lineId + '&orderType=' + this.selectedOrder.orderType;
            this.httpService.callApi('removeOrderFormOnBooking', { pathVariable: pathVariable }).subscribe((response) => {
                this.toastr.success("Successfully deleted", 'Order Form');
                this.closeModalEvent.emit(false);
            }, error => {
                this.blockedPanel = false;
                this.toastr.error(error.error.message, 'Order Form');
                console.log('Error getstatus => ', error)
            });
        }
    }

    deleteOrderForm() {
        let message, status;
        status = this.selectedOrder.status === 1? 'In Progress': 'Done';

        if(this.selectedOrder.status !== 0 && this.selectedOrder.hasOwnProperty('status')){
            this.toastr.warning('Order form status '+status+'. So It can not be deleted', 'Order Form');
        }
        else{
            this.deleteOrder()
        }
    }
    getAvailableBookingOrderForms() {
        this.httpService.callApi('getAvailableOrderForms', {}).subscribe((response) => {
            this.formList = response[this.selectedOrder.orderType];
            this.blockedPanel = true;
        }, error => {
            this.blockedPanel = false;
            this.toastr.error(error.error.message, 'Order Form');
            console.log('Error getstatus => ', error)
        });
    }
    getSelectedFormName(form, index) {
        if (index !== null) {
            this.selectedFormType = form.formType;
            this.orderForm.get('formType').setValue(form.formType);

            this.clearFormArray(this.keywordsForm);
            form.keyword.forEach(element => {
                this.addKeywordToOrderForm(element);
            });
        } else {
            this.selectedFormType = form;
            this.clearFormArray(this.keywordsForm);
        }

        this.openFormList = false;
    }
    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    changeStatus() {
        if (this.selectedOrder.status === 2) {
            this.toastr.warning("Status Already Done.",'Order Form');
        }
        else if (confirm('Are you sure to change status of  order form?')) {
            let pathVariable = '?bookingId=' + this.lineId + '&orderType=' + this.selectedOrder.orderType;
            this.httpService.callApi('changeStatusOfOrderForm', { pathVariable: pathVariable }).subscribe((response) => {
                this.toastr.success("Status Successfully Changed.", 'Order Form');
               this.selectedOrder=response;
               this.closeModalEvent.emit(false);
            }, error => {
                this.blockedPanel = false;
                this.toastr.error(error.error.message, 'Order Form');
                console.log('Error getstatus => ', error)
            });
        }
    }
    
    
}
