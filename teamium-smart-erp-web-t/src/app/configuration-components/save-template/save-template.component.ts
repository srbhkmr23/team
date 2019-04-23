import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-save-template',
  templateUrl: './save-template.component.html',
  styleUrls: ['./save-template.component.scss']
})
export class SaveTemplate implements OnInit {
  @Input()componentName='Template';
  @Input() selectedTemplate: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  templateForm: FormGroup;
  blockedPanel:boolean=false;
  showDeleteModal:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { 
    this.templateForm = this.createTemplateForm();
  }

  ngOnInit() {
    this.setTemplateName();
  }

  createTemplateForm(){
    return this.formBuilder.group({
      templateName: [null,Validators.required]
    });
  }

  setTemplateName(){
    let templateForm = this.templateForm; 
    templateForm.get('templateName').setValue(this.selectedTemplate.templateName);
  }

  saveTemplate(){
    let body;
    let templateForm = this.templateForm; 
    let name = templateForm.get('templateName').value;
    if(name == undefined || name == null || name ==""){
      this.toastr.warning("Template name can not be empty.", 'Template');
      return;
    }

    if(this.selectedTemplate && this.selectedTemplate.hasOwnProperty('id')){
      body = {
        "id":this.selectedTemplate.id,
        "templateName":name
      };
    }
    else{
      body = {
        "templateName":name
      }
    }

    console.log("body",body)
    this.blockedPanel=true;
    this.httpService.callApi('saveEditionTemplate', { body: body }).subscribe((response) => {
      this.blockedPanel=false;
      this.toastr.success("Successfully Saved", 'Template');
      this.closeModalEvent.emit(false);
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Template');
      console.log('Error getstatus => ', error)
    });
  }

  deleteTemplate($event) {
    if($event){
      let selectedTemplate = this.selectedTemplate;
      if(selectedTemplate && selectedTemplate.hasOwnProperty('id')){
       let id = selectedTemplate.id;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deleteEditionTemplates', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Template');
          this.closeModalEvent.emit(false);
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Template');
          console.log('Error getstatus => ', error)
        });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
}
  hideTemplateModal=()=>{
    this.closeModalEvent.emit(false);
  }
  
}