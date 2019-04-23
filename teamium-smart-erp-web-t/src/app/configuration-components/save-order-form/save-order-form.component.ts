import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '../../../../node_modules/@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

@Component({
    selector: 'app-save-order',
    templateUrl: './save-order-form.component.html',
    styleUrls: ['./save-order-form.component.scss']
})
export class SaveOrderComponent implements OnInit {
    blockedPanel: boolean = false;
    @Input()componentName='Order Form';
    @Input() selectedOrder: any;
    @Output() closeModalEvent = new EventEmitter<boolean>();
    bookingOrderForm: FormGroup;
    showTemplateText: any;
    modalText: string = '';
    showDeleteModal:boolean=false;

    constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) {

    }
    ngOnInit() {
        this.bookingOrderForm = this.createFormGroup();
        this.modalText="Create Order Form";
        if (this.selectedOrder.keyword) {
            this.modalText="Edit Order Form";
            this.selectedOrder.keyword.forEach(element => {
                this.addKeywordsToOrderForm(element);
            });
        }
    }

    hideOrderModal() {
        this.closeModalEvent.emit(false);
    }

    createFormGroup(): FormGroup {
        if (this.selectedOrder) {
            let form = this.formBuilder.group({
                id: [this.selectedOrder.id],
                version: [this.selectedOrder.version],
                formType: [this.selectedOrder.formType],
                orderType: [this.selectedOrder.orderType],
                keyword: this.formBuilder.array([])
            });
            return form;
        }
        else {
            return this.formBuilder.group({
                formType: ['Select Order Type', Validators.required],
                orderType: [null, Validators.required],
                keyword: this.formBuilder.array([])
            });
        }

    }
    get keywordForm() {
        return this.bookingOrderForm.get('keyword') as FormArray;
    }

    addKeywordsToOrderForm(ex: any) {
        {
            const keword = this.formBuilder.group({
                id: [ex.id],
                key: [ex.key, Validators.required],
                version: [ex.version]

            });
            // console.log("orderLine",line);
            this.keywordForm.push(keword);
            //  console.log("main ",this.editOrderForm)
        }
    }

    addKeywordToOrderForm() {
        const keyword = this.formBuilder.group({
            key: [null, Validators.required],

        });
        this.keywordForm.push(keyword)
    }

    removeKeywordFromOrderForm(i: number) {
        this.keywordForm.removeAt(i)

    }

    saveOrderForm() {
        if (!this.bookingOrderForm.value.formType) {
            this.toastr.warning("Please provide a form type.");
        } else if (!this.bookingOrderForm.value.orderType || this.bookingOrderForm.value.orderType==='null') {
            this.toastr.warning("Please select a order type.");
        } else if (this.bookingOrderForm.value.keyword.length < 1) {
            this.toastr.warning("Atleast one Keyword required.");
        }
        else if (!this.bookingOrderForm.get('keyword').valid) {
            this.toastr.warning("Please fill the keyword name.");
        }
        else {
            let body = this.bookingOrderForm.value;
            this.httpService.callApi('saveBookingOrderForm', { body: body }).subscribe((response) => {
                this.toastr.success("Successfully Saved", 'Order Form');
                this.closeModalEvent.emit(false);
            }, error => {
                this.blockedPanel = false;
                this.toastr.error(error.error.message, 'Order Form');
                console.log('Error getstatus => ', error)
            });
        }

    }

    deleteOrderForm($event) {
        if ($event) {
            this.httpService.callApi('deleteBookingOrderFormById', { pathVariable: this.selectedOrder.id }).subscribe((response) => {
                this.toastr.success("Successfully Deleted", 'Order Form');
                this.closeModalEvent.emit(false);
            }, error => {
                this.blockedPanel = false;
                this.toastr.error(error.error.message, 'Order Form');
                console.log('Error getstatus => ', error)
            });
        }

    }
    closeDeleteConfirmModal($event){
        this.showDeleteModal=$event;
    }

}