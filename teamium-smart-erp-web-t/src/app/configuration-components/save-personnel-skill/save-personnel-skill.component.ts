import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-save-personnel-skill',
  templateUrl: './save-personnel-skill.component.html',
  styleUrls: ['./save-personnel-skill.component.scss']
})
export class SavePersonnelSkillComponent implements OnInit {
  @Input() componentName='Personnel Skill'
  @Input() selectedPersonnelSkill: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  personnelSkillForm: FormGroup;
  blockedPanel:boolean=false;
  showDeleteModal:boolean=false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { 
    this.personnelSkillForm = this.createPersonnelSkillForm();
  }

  ngOnInit() {
    this.setPersonnelSkillFormData()
  }

  createPersonnelSkillForm(){
    return this.formBuilder.group({
        personnelSkillName: [null,Validators.required]
    });
  }

  setPersonnelSkillFormData = () => {
    try{
      // set personnel skill data
      let selectedPersonnelSkill = this.selectedPersonnelSkill;

      if(selectedPersonnelSkill && selectedPersonnelSkill.hasOwnProperty('id')){
        this.personnelSkillForm.get('personnelSkillName').setValue(selectedPersonnelSkill.name);
      }
    }
    catch(err){
      console.log(err)
    }
  }


  savePersonnelSkill() {
    let personnelSkillForm = this.personnelSkillForm; 
    let name = personnelSkillForm.get('personnelSkillName').value;
    if(name == undefined || name == null || name ==""){
      this.toastr.warning("Personnel skill name can not be empty.", 'Personnel Skill');
      return;
    }

    let body = this.getJSONToSavePersonnelSkill();
    console.log("body",body)
    this.blockedPanel=true;
    this.httpService.callApi('savePersonnelSkill', { body: body }).subscribe((response) => {
      this.blockedPanel=false;
      this.toastr.success("Successfully Saved", 'Personnel Skill');
      this.closeModalEvent.emit(false);
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Personnel Skill');
      console.log('Error getstatus => ', error)
    });
  }


  getJSONToSavePersonnelSkill=()=>{
    try {
      let personnelSkillForm = this.personnelSkillForm; 
      let name = personnelSkillForm.get('personnelSkillName').value;
      let personnelSkillData = {
        "name": name || null
      }
      let selectedPersonnelSkill = this.selectedPersonnelSkill ;
      if(selectedPersonnelSkill && selectedPersonnelSkill.hasOwnProperty('id')){
        personnelSkillData["id"]=selectedPersonnelSkill["id"];
      }
      return personnelSkillData;
    }
    catch(err) {
      console.log(err)
    }
  }

  deletePersonnelSkill=($event)=>{
    if($event){
      let selectedPersonnelSkill = this.selectedPersonnelSkill;
      if(selectedPersonnelSkill && selectedPersonnelSkill.hasOwnProperty('id')){
       let id = selectedPersonnelSkill.id;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deletePersonnelSkill', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Personnel Skill');
          this.closeModalEvent.emit(false);
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Personnel Skill');
          console.log('Error getstatus => ', error)
        });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  hidePersonnelSkillModal() {
    this.closeModalEvent.emit(false);
  }

}