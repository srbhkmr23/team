import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-save-personnel-document',
  templateUrl: './save-personnel-document.component.html',
  styleUrls: ['./save-personnel-document.component.scss']
})
export class SavePersonnelDocumentComponent implements OnInit {
  @Input() componentName='Personnel Document';
  @Input() selectedPersonnelDocument: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  personnelDocumentForm: FormGroup;
  blockedPanel:boolean=false;
  showDeleteModal:boolean=false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { 
    this.personnelDocumentForm = this.createPersonnelDocumentForm();
  }

  ngOnInit() {
    this.setPersonnelDocumentFormData()
  }

  createPersonnelDocumentForm(){
    return this.formBuilder.group({
        personnelDocumentName: [null,Validators.required]
    });
  }

  setPersonnelDocumentFormData = () => {
    try{
      // set document type
      let selectedPersonnelDocument = this.selectedPersonnelDocument;

      if(selectedPersonnelDocument && selectedPersonnelDocument.hasOwnProperty('id')){
        this.personnelDocumentForm.get('personnelDocumentName').setValue(selectedPersonnelDocument.type);
      }
    }
    catch(err){
      console.log(err)
    }
  }


  savePersonnelDocument() {
    let personnelDocumentForm = this.personnelDocumentForm; 
    let name = personnelDocumentForm.get('personnelDocumentName').value;
    if(name == undefined || name == null || name == ""){
      this.toastr.warning("Document-Type can not be empty.", 'Personnel Document');
      return;
    }

    let body = this.getJSONToSaveFormat();
    console.log("body",body)
    this.blockedPanel=true;
    this.httpService.callApi('savePersonnelDocument', { body: body }).subscribe((response) => {
      this.blockedPanel=false;
      this.toastr.success(" Successfully Saved", 'Personnel Document');
      this.closeModalEvent.emit(false);
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Personnel Document');
      console.log('Error getstatus => ', error)
    });
  }


  getJSONToSaveFormat=()=>{
    try {
      let personnelDocumentForm = this.personnelDocumentForm; 
      let name = personnelDocumentForm.get('personnelDocumentName').value;
      let personnelDocumentData = {
        "type": name || null
      }
      let selectedPersonnelDocument = this.selectedPersonnelDocument ;
      if(selectedPersonnelDocument && selectedPersonnelDocument.hasOwnProperty('id')){
        personnelDocumentData["id"]=selectedPersonnelDocument["id"];
      }
      return personnelDocumentData;
    }
    catch(err) {
      console.log(err)
    }
  }

  deletePersonnelDocument=($event)=>{
    if($event){
      let selectedPersonnelDocument = this.selectedPersonnelDocument;
      if(selectedPersonnelDocument && selectedPersonnelDocument.hasOwnProperty('id')){
       let id = selectedPersonnelDocument.id;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deletePersonnelDocument', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Personnel Document');
          this.closeModalEvent.emit(false);
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Personnel Document');
          console.log('Error getstatus => ', error);
          this.closeModalEvent.emit(true);
        });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  hidePersonnelDocumentModal() {
    this.closeModalEvent.emit(false);
  }

}
 
