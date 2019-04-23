import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-save-color',
  templateUrl: './save-color.component.html',
  styleUrls: ['./save-color.component.scss']
})
export class SaveColorComponent implements OnInit {
  @Input() selectedColor: any='#fff';
  @Output() closeModalEvent=new EventEmitter<boolean>();
  
  blockedPanel:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) {
    
  }

  ngOnInit() {
  }

  hideColorModal() {
    this.closeModalEvent.emit(false);
  }


}


