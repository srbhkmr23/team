import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-save-keyword',
  templateUrl: './save-keyword.component.html',
  styleUrls: ['./save-keyword.component.scss']
})
export class SaveKeywordComponent implements OnInit {
  blockedPanel: boolean = false;
  @Input()componentName='Keyword';
  @Input() selectedKeyword: any;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  keywordForm: any;
  modalText: string = '';
  validateKeyword = false;
  validateKey = false;
  showDeleteModal:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { }

  ngOnInit() {
    this.keywordForm = this.createFormGroup();
    this.modalText = "Create keyword";
    if (this.selectedKeyword.keyword) {
      this.modalText = "Edit keyword";
      this.selectedKeyword.keysList.forEach(element => {
        this.addKeyToKeysList(element);
      });
    }
  }

  hideKeywordModal() {
    this.closeModalEvent.emit(false);
    this.validateKeyword = false;
    this.validateKey = false;
  }

  createFormGroup() {
    if (this.selectedKeyword) {
      return this.formBuilder.group({
        id: [this.selectedKeyword.id],
        version: [this.selectedKeyword.version],
        keyword: [this.selectedKeyword.keyword, [Validators.required, Validators.pattern(/(?!^\d+$)^.+$/)]],
        keysList: this.formBuilder.array([])
      });
    } else {
      return this.formBuilder.group({
        keyword: [null, [Validators.required, Validators.pattern(/(?!^\d+$)^.+$/)]],
        keysList: this.formBuilder.array([])
      });
    }
  }

  get keysListForm() {
    return this.keywordForm.get('keysList') as FormArray;
  }

  addKeyToKeysList(key: any) {
    var newKey;
    if (!key) {
      newKey = this.formBuilder.group({
        keyValue: [null, [Validators.required, Validators.pattern(/(?!^\d+$)^.+$/)]],
      });
    } else {
      newKey = this.formBuilder.group({
        id: [key.id],
        keyValue: [key.keyValue, [Validators.required, Validators.pattern(/(?!^\d+$)^.+$/)]],
        version: [key.version]
      });
    }
    this.keysListForm.push(newKey)
  }

  removeKeyFromKeysList(id: number) {
    this.keysListForm.removeAt(id);
  }

  saveKeyword() {
    this.blockedPanel = true;
    this.validateKeyword = true;
    this.validateKey = true;
    if (this.keywordForm.invalid || this.keysListForm.invalid) {
      return;
    } else {
      this.httpService.callApi('saveKeyword', { body: this.keywordForm.value }).subscribe((response) => {
        this.toastr.success("Successfully Saved", 'Keyword');
        this.closeModalEvent.emit(false);
        this.validateKeyword = false;
        this.validateKey = false;
      }, error => {
        this.toastr.error(error.error.message, 'Keyword');
        console.log('Error getstatus => ', error)
      });
      this.blockedPanel = false;
    }
  }

  deleteKeyword($event) {
    this.blockedPanel = true;
    if (this.selectedKeyword.id) {
      if ($event) {
        this.httpService.callApi('deleteKeywordById', { pathVariable: this.selectedKeyword.id }).subscribe((response) => {
          this.toastr.success("Successfully Deleted", 'Keyword');
          this.closeModalEvent.emit(false);
        }, error => {
          this.toastr.error(error.error.message, 'Keyword');
        });
        this.blockedPanel = false;
      }
    }

  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }

}
