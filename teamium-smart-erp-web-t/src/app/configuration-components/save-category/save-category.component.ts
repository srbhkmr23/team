import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-save-category',
  templateUrl: './save-category.component.html',
  styleUrls: ['./save-category.component.scss']
})
export class SaveCategoryComponent implements OnInit {
  @Input() componentName='Project Category';
  @Input() selectedCategory: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  categoryForm: FormGroup;
  blockedPanel:boolean=false;
  modalText: string = '';
  showDeleteModal:boolean=false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { 
    this.categoryForm = this.createCategoryForm();
  }

  ngOnInit() {
    this.setCategoryFormData();
    this.modalText = "Create Project Category";
    if (this.selectedCategory.hasOwnProperty('id')) {
      this.modalText = "Edit Project Category";
    }
  }

  createCategoryForm(){
    return this.formBuilder.group({
        categoryName: [null,Validators.required]
    });
  }

  setCategoryFormData = () => {
    try{
      // set contact data
      let selectedCategory = this.selectedCategory;
      if(selectedCategory && selectedCategory.hasOwnProperty('id')){
        this.categoryForm.get('categoryName').setValue(selectedCategory.name);
      }
    }
    catch(err){
      console.log(err)
    }
  }

  saveCategory() {
    let categoryForm = this.categoryForm; 
    let name = categoryForm.get('categoryName').value;
    if(name == undefined || name == null || name ==""){
      this.toastr.warning("Project Category name can not be empty.", 'Category');
      return;
    }

    let body = this.getJSONToSaveCategory();
    console.log("body",body)
    this.blockedPanel=true;
    this.httpService.callApi('saveCategory', { body: body }).subscribe((response) => {
      this.blockedPanel=false;
      this.toastr.success("Successfully Saved", 'Project Category');
      this.closeModalEvent.emit(false);
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Project Category');
      console.log('Error getstatus => ', error)
    });
  }


  getJSONToSaveCategory=()=>{
    try {
      let categoryForm = this.categoryForm; 
      let name = categoryForm.get('categoryName').value;
      let categoryData = {
        "name": name || null
      }
      let selectedCategory = this.selectedCategory ;
      if(selectedCategory && selectedCategory.hasOwnProperty('id')){
        categoryData["id"]=selectedCategory["id"];
      }
      return categoryData;
    }
    catch(err) {
      console.log(err)
    }
  }

  deleteCategory=($event)=>{
    if($event){
      let selectedCategory = this.selectedCategory;
      if(selectedCategory && selectedCategory.hasOwnProperty('id')){
       let id = selectedCategory.id;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deleteCategory', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Project Category');
          this.closeModalEvent.emit(false);
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Project Category');
          console.log('Error getstatus => ', error)
        });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  hideCategoryModal() {
    this.closeModalEvent.emit(false);
  }

}
 