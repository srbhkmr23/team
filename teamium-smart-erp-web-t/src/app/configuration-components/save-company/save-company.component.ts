import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-save-company',
  templateUrl: './save-company.component.html',
  styleUrls: ['./save-company.component.scss']
})
export class SaveCompanyComponent implements OnInit {
  @Input()componentName='Company';
  @Input() selectedCompany: any;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  companyForm: FormGroup;

  file: any;
  logoName: any;
  invalidPhotoFormatError: string = null;
  pictureUrl: string;
  allowedExtensionsForPhoto = ['jpg', 'jpeg'];
  blockedPanel: boolean = false;
  modalText: string = '';
  showError: boolean = false;
  condition: boolean;
  showDeleteModal:boolean=false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) {
    this.companyForm = this.createCompanyForm();
  }

  ngOnInit() {
    this.setCompanyFormData();
    this.modalText = "Create Company";
    if (this.selectedCompany.hasOwnProperty('id')) {
      this.modalText = "Edit Company";
    }

    this.companyForm.get('companyName').valueChanges.subscribe((value) => {
      if (value &&  value.trimLeft().length>0) {
        this.showError = false;
      } else {
        this.showError = true;
      }
    });
  }

  createCompanyForm() {
    return this.formBuilder.group({
      companyName: [null,Validators.compose([Validators.required])],
      taxId: [null],
      address: [null],
      bAddress: [null],
      header: [null],
      footer: [null]
    });
  }

  setCompanyFormData = () => {
    try {
      // set contact data
      let selectedCompany = this.selectedCompany;
      let address = null;
      let billingAddress = null;

      if (selectedCompany && selectedCompany.hasOwnProperty('id')) {

        if (selectedCompany.address && selectedCompany.address.hasOwnProperty('line1')) {
          address = selectedCompany.address['line1'];
        }

        if (selectedCompany.billingAddress && selectedCompany.billingAddress.hasOwnProperty('line1')) {
          billingAddress = selectedCompany.billingAddress['line1'];
        }



        this.companyForm.get('companyName').setValue(selectedCompany.name);
        this.companyForm.get('taxId').setValue(selectedCompany.vatNumber);
        this.companyForm.get('address').setValue(address);
        this.companyForm.get('bAddress').setValue(billingAddress);
        this.companyForm.get('header').setValue(selectedCompany.header);
        this.companyForm.get('footer').setValue(selectedCompany.footer);
        this.pictureUrl = this.selectedCompany.logo != null ? this.selectedCompany.logo.url : '';
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  saveCompany() {
    let body = this.getJSONToSaveCompany();
    console.log("body", body)
    this.blockedPanel = true;
    this.httpService.callApi('saveCompany', { body: body }).subscribe((response) => {
      this.uploadPicture(response.id, () => {
        this.blockedPanel = false;
        this.toastr.success("Successfully Saved", 'company');
        this.closeModalEvent.emit(false);
      });
    }, error => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'company');
      console.log('Error getstatus => ', error)
    });
  }


  getJSONToSaveCompany = () => {
    try {
      let companyForm = this.companyForm;
      let companyData = {
        "name": companyForm.get('companyName').value || null,
        "vatNumber": companyForm.get('taxId').value || null,
        "address": {
          "line1": companyForm.get('address').value || null
        },
        "billingAddress": {
          "line1": companyForm.get('bAddress').value || null
        },
        "header": companyForm.get('header').value || null,
        "footer": companyForm.get('footer').value || null
      }

      let selectedCompany = this.selectedCompany;
      if (selectedCompany && selectedCompany.hasOwnProperty('id')) {
        companyData["id"] = selectedCompany["id"];
      }

      return companyData;
    }
    catch (err) {
      console.log(err)
    }
  }
  deleteCompany = ($event) => {
    if ($event) {
      let selectedCompany = this.selectedCompany;
      if (selectedCompany && selectedCompany.hasOwnProperty('id')) {
        let id = selectedCompany.id;
        let pathVariable = "/" + id;
        this.blockedPanel = true;
        this.httpService.callApi('deleteCompany', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel = false;
          this.toastr.success("Successfully Deleted", 'Company');
          this.closeModalEvent.emit(false);
        },
          error => {
            this.blockedPanel = false;
            this.toastr.error(error.error.message, 'Company');
            console.log('Error getstatus => ', error)
          });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  uploadPicture(vendorId: number, cb) {
    try {
      if (this.file != undefined && this.file != null) {
        let body = new FormData();
        body.append('discriminator', 'company');
        body.append('fileContent', this.file);
        this.httpService.callApi("uploadPicture", { body: body, pathVariable: vendorId }).subscribe((respone) => {
          cb();
        }, (error) => {
          console.log('error ', error)
          cb();
        });
      }
      else {
        cb();
      }
    }
    catch (err) {
      console.log('error ', err)
      cb();
    }

  }



  onLogoPictureChange(event) {
    try {
      if (event.target.files.length > 0) {
        let file = event.target.files[0];
        let fileExtension = file.name.split('.').pop().toLowerCase();

        if (this.isInArray(this.allowedExtensionsForPhoto, fileExtension) && file.size < 2097152) {
          this.logoName = "Successfully added File:" + file.name;
          this.file = file;
          this.invalidPhotoFormatError = null;
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]); // read file as data url
          reader.onload = (event) => { // called once readAsDataURL is completed
            let target: any = event.target; //<-- This (any) will tell compiler to shut up!
            this.pictureUrl = target.result;
          }
        }
        else if (file.size > 2097152) {
          this.logoName = null;
          this.file = null;
          this.invalidPhotoFormatError = "File size should not be greater than 2MB."
        } else {
          this.logoName = null;
          this.file = null;
          this.invalidPhotoFormatError = "Only jpeg or jpg format allowed!!"
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }


  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  hideCompanyModal() {
    this.closeModalEvent.emit(false);
  }


  clearSpace(form, fieldName) {
    form.get(fieldName).setValue(form.get(fieldName).value.trim());
  }

}


