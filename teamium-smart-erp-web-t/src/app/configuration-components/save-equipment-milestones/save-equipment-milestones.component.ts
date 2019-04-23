import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-save-equipment-milestones',
  templateUrl: './save-equipment-milestones.component.html',
  styleUrls: ['./save-equipment-milestones.component.scss']
})
export class SaveEquipmentMilestonesComponent implements OnInit {
  @Input() componentName='Equipment Milestone';
  @Input() selectedEquipmentMilestone: any;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  equipmentMilestoneForm: FormGroup;
  blockedPanel: boolean = false;
  modalText: string = '';
  showDeleteModal:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) {
    this.equipmentMilestoneForm = this.createEquipmentMilestoneForm();
  }

  ngOnInit() {
    this.setEquipmentMilestoneFormData();
    this.modalText = "Create Equipment Milestone";
    if (this.selectedEquipmentMilestone.hasOwnProperty('id')) {
      this.modalText = "Edit Equipment Milestone";
    }
  }

  createEquipmentMilestoneForm() {
    return this.formBuilder.group({
      equipmentMilestoneName: [null, Validators.required]
    });
  }

  setEquipmentMilestoneFormData = () => {
    try {
      // set contact data
      let selectedEquipmentMilestone = this.selectedEquipmentMilestone;
      if (selectedEquipmentMilestone && selectedEquipmentMilestone.hasOwnProperty('id')) {
        this.equipmentMilestoneForm.get('equipmentMilestoneName').setValue(selectedEquipmentMilestone.name);
      }
    }
    catch (err) {
      console.log(err)
    }
  }


  saveEquipmentMilestone() {
    let equipmentMilestoneForm = this.equipmentMilestoneForm;
    let name = equipmentMilestoneForm.get('equipmentMilestoneName').value;
    if (name == undefined || name == null || name == "") {
      this.toastr.warning("Equipment milestone name can not be empty.", 'Equipment Milestone');
      return;
    }

    let body = this.getJSONToSaveEquipmentMilestone();
    console.log("body", body)
    this.blockedPanel = true;
    this.httpService.callApi('saveEquipmentMilestone', { body: body }).subscribe((response) => {
      this.blockedPanel = false;
      this.toastr.success("Successfully Saved", 'Equipment Milestone');
      this.closeModalEvent.emit(false);
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Equipment Milestone');
      console.log('Error getstatus => ', error)
    });
  }


  getJSONToSaveEquipmentMilestone = () => {
    try {
      let equipmentMilestoneForm = this.equipmentMilestoneForm;
      let name = equipmentMilestoneForm.get('equipmentMilestoneName').value;
      let equipmentMilestoneData = {
        "name": name || null,
        "discriminator": "equipment"
      }
      let selectedEquipmentMilestone = this.selectedEquipmentMilestone;
      if (selectedEquipmentMilestone && selectedEquipmentMilestone.hasOwnProperty('id')) {
        equipmentMilestoneData["id"] = selectedEquipmentMilestone["id"];
      }
      return equipmentMilestoneData;
    }
    catch (err) {
      console.log(err)
    }
  }


  deleteEquipmentMilestone = ($event) => {
    if ($event) {
      let selectedEquipmentMilestone = this.selectedEquipmentMilestone;
      if (selectedEquipmentMilestone && selectedEquipmentMilestone.hasOwnProperty('id')) {
        let id = selectedEquipmentMilestone.id;
        let pathVariable = "/" + id;
        this.blockedPanel = true;
        this.httpService.callApi('deleteEquipmentMilestone', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel = false;
          this.toastr.success("Successfully Deleted", 'Equipment Milestone');
          this.closeModalEvent.emit(false);
        },
          error => {
            this.blockedPanel = false;
            this.toastr.error(error.error.message, 'Equipment Milestone');
            console.log('Error getstatus => ', error)
          });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
}
  hideEquipmentMilestoneModal() {
    this.closeModalEvent.emit(false);
  }

}
