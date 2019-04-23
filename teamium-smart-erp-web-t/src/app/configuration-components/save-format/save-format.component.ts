import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-save-format',
  templateUrl: './save-format.component.html',
  styleUrls: ['./save-format.component.scss']
})
export class SaveFormatComponent implements OnInit {
  @Input() componentName='Format';
  @Input() selectedFormat: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  formatForm: FormGroup;
  blockedPanel:boolean=false;
  modalText: string = '';
  showDeleteModal:boolean=false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { 
    this.formatForm = this.createFormatForm();
  }

  ngOnInit() {
    this.setFormatFormData()
    this.modalText = "Create Format";
    if (this.selectedFormat.hasOwnProperty('id')) {
      this.modalText = "Edit Format";
    }
  }

  createFormatForm(){
    return this.formBuilder.group({
        formatName: [null,Validators.required]
    });
  }

  setFormatFormData = () => {
    try{
      // set contact data
      let selectedFormat = this.selectedFormat;

      if(selectedFormat && selectedFormat.hasOwnProperty('id')){
        this.formatForm.get('formatName').setValue(selectedFormat.name);
      }
    }
    catch(err){
      console.log(err)
    }
  }


  saveFormat() {
    let formatForm = this.formatForm; 
    let name = formatForm.get('formatName').value;
    if(name == undefined || name == null || name ==""){
      this.toastr.warning("Format name can not be empty.", 'Format');
      return;
    }

    let body = this.getJSONToSaveFormat();
    console.log("body",body)
    this.blockedPanel=true;
    this.httpService.callApi('saveFormat', { body: body }).subscribe((response) => {
      this.blockedPanel=false;
      this.toastr.success("Successfully Saved", 'Format');
      this.closeModalEvent.emit(false);
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Format');
      console.log('Error getstatus => ', error)
    });
  }


  getJSONToSaveFormat=()=>{
    try {
      let formatForm = this.formatForm; 
      let name = formatForm.get('formatName').value;
      let formatData = {
        "name": name || null
      }
      let selectedFormat = this.selectedFormat ;
      if(selectedFormat && selectedFormat.hasOwnProperty('id')){
        formatData["id"]=selectedFormat["id"];
      }
      return formatData;
    }
    catch(err) {
      console.log(err)
    }
  }

  deleteFormat=($event)=>{
    if($event){
      let selectedFormat = this.selectedFormat;
      if(selectedFormat && selectedFormat.hasOwnProperty('id')){
       let id = selectedFormat.id;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deleteFormat', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Format');
          this.closeModalEvent.emit(false);
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Format');
          console.log('Error getstatus => ', error)
        });
      }
    }
    this.showDeleteModal=false;
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  hideFormatModal() {
    this.closeModalEvent.emit(false);
  }

}
 