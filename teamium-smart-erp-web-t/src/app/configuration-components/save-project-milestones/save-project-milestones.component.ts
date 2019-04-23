import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-save-project-milestones',
  templateUrl: './save-project-milestones.component.html',
  styleUrls: ['./save-project-milestones.component.scss']
})
export class SaveProjectMilestonesComponent implements OnInit {
  @Input() componentName='Project Milestone';
  @Input() selectedProjectMilestone: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  projectMilestoneForm: FormGroup;
  blockedPanel:boolean=false;
  modalText: string = '';
  showDeleteModal:boolean=false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { 
    this.projectMilestoneForm = this.createProjectMilestoneForm();
  }

  ngOnInit() {
    this.setProjectMilestoneFormData();
    this.modalText = "Create Project Milestone";
    if (this.selectedProjectMilestone.hasOwnProperty('id')) {
      this.modalText = "Edit Project Milestone";
    }
  }

  createProjectMilestoneForm(){
    return this.formBuilder.group({
      projectMilestoneName: [null,Validators.required]
    });
  }

  setProjectMilestoneFormData = () => {
    try{
      // set contact data
      let selectedProjectMilestone = this.selectedProjectMilestone;
      if(selectedProjectMilestone && selectedProjectMilestone.hasOwnProperty('id')){
        this.projectMilestoneForm.get('projectMilestoneName').setValue(selectedProjectMilestone.name);
      }
    }
    catch(err){
      console.log(err)
    }
  }

  saveProjectMilestone() {
    let projectMilestoneForm = this.projectMilestoneForm; 
    let name = projectMilestoneForm.get('projectMilestoneName').value;
    if(name == undefined || name == null || name ==""){
      this.toastr.warning("Project milestone name can not be empty.", 'Project Milestone');
      return;
    }

    let body = this.getJSONToSaveProjectMilestone();
    console.log("body",body)
    this.blockedPanel=true;
    this.httpService.callApi('saveProjectMilestone', { body: body }).subscribe((response) => {
      this.blockedPanel=false;
      this.toastr.success("Successfully Saved", 'Project Milestone');
      this.closeModalEvent.emit(false);
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Project Milestone');
      console.log('Error getstatus => ', error)
    });
  }


  getJSONToSaveProjectMilestone=()=>{
    try {
      let projectMilestoneForm = this.projectMilestoneForm; 
      let name = projectMilestoneForm.get('projectMilestoneName').value;
      let projectMilestoneData = {
        "name": name || null,
        "discriminator" : "project"
      }
      let selectedProjectMilestone = this.selectedProjectMilestone ;
      if(selectedProjectMilestone && selectedProjectMilestone.hasOwnProperty('id')){
        projectMilestoneData["id"]=selectedProjectMilestone["id"];
      }
      return projectMilestoneData;
    }
    catch(err) {
      console.log(err)
    }
  }


  deleteProjectMilestone=($event)=>{
    if($event){
      let selectedProjectMilestone = this.selectedProjectMilestone;
      if(selectedProjectMilestone && selectedProjectMilestone.hasOwnProperty('id')){
       let id = selectedProjectMilestone.id;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deleteProjectMilestone', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Project Milestone');
          this.closeModalEvent.emit(false);
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Project Milestone');
          console.log('Error getstatus => ', error)
        });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  hideProjectMilestoneModal() {
    this.closeModalEvent.emit(false);
  }

}
