import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../core/services/http.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss']
})
export class DigitalSignatureComponent implements OnInit, AfterViewInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('signaturediv') signatureDiv: ElementRef;
  signatureDataStack: any = [];
  signatureDataStackIndex: number = -1;
  digitalSignature: any;
  @Input() staffId: number;
  allowedExtensionsForPhoto = ['jpg', 'jpeg', 'png'];
  pictureUrl: string;
  @ViewChild('inputImage') inputImage: ElementRef;

  public signaturePadOptions: Object = {
    'minWidth': 0.8,
    'maxWidth': 1.5,
    'dotSize': 0.5,
    'throttle': 3
  };

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.signaturePad.set('canvasHeight', this.signatureDiv.nativeElement.offsetHeight);
    this.signaturePad.set('canvasWidth', this.signatureDiv.nativeElement.offsetWidth);
    this.signaturePad.clear();
    this.signaturePad.fromDataURL(this.signatureDataStack[this.signatureDataStackIndex]);
  }

  ngOnInit() {
    this.httpService.callApi('getDigitalSignature', { pathVariable: this.staffId }).subscribe((responce) => {
      this.digitalSignature = responce;
      if (this.digitalSignature.signatureByte) {
        if (this.digitalSignature.editable) {
          this.signaturePad.clear();
          this.signaturePad.fromDataURL('data:image/png;base64,' + atob(this.digitalSignature.signatureByte));
          this.signatureDataStack.push('data:image/png;base64,' + atob(this.digitalSignature.signatureByte));
          this.signatureDataStackIndex += 1;
        } else {
          this.pictureUrl = 'data:image/png;base64,' + atob(this.digitalSignature.signatureByte);
        }
      }
    }, error => {
    });
  }

  closeModalDirect() {
    if ((!this.signaturePad.isEmpty() || this.pictureUrl) && this.signatureDataStackIndex > 0) {
      if (confirm('Do you want to save the changes?')) {
        this.saveDigitalSignature();
      }
    } else {
      this.closeModal();
    }
  }

  closeModal() {
    this.closeModalEvent.emit(false);
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    // this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    // console.log("ht ",this.signatureDiv.nativeElement.offsetHeight);
    // console.log("wst ",this.signatureDiv.nativeElement.offsetWidth);
    this.signaturePad.set('canvasHeight', this.signatureDiv.nativeElement.offsetHeight);
    this.signaturePad.set('canvasWidth', this.signatureDiv.nativeElement.offsetWidth);
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
    if (this.signatureDataStackIndex < this.signatureDataStack.length - 1) {
      while (this.signatureDataStackIndex < this.signatureDataStack.length - 1) {
        this.signatureDataStack.pop();
      }
    }
    this.signatureDataStack.push(this.signaturePad.toDataURL());
    this.signatureDataStackIndex += 1;
  }

  drawStart() {
  }

  @HostListener('window:keydown.control.z')
  onUndo() {
    // this.signatureDataStack.pop();
    if (this.signaturePad.isEmpty()) {
      this.signaturePad.fromDataURL(this.signatureDataStack[this.signatureDataStackIndex]);
      return;
    }
    this.signatureDataStackIndex = this.signatureDataStackIndex > -1 ? this.signatureDataStackIndex - 1 : -1;
    this.signaturePad.clear();
    if (this.signatureDataStackIndex > -1) {
      this.signaturePad.fromDataURL(this.signatureDataStack[this.signatureDataStackIndex]);
    }
  }

  @HostListener('window:keydown.control.y')
  onRedo() {
    // this.signatureDataStack.pop();
    this.signatureDataStackIndex = this.signatureDataStackIndex < this.signatureDataStack.length - 1 ? this.signatureDataStackIndex + 1 : this.signatureDataStack.length - 1;
    this.signaturePad.clear();
    this.signaturePad.fromDataURL(this.signatureDataStack[this.signatureDataStackIndex]);
  }

  onClear() {
    if (this.signatureDataStackIndex < this.signatureDataStack.length - 1) {
      while (this.signatureDataStackIndex < this.signatureDataStack.length - 1) {
        this.signatureDataStack.pop();
      }
    }
    this.signaturePad.clear();
  }

  saveDigitalSignature() {
    if (!this.signaturePad.isEmpty() && this.pictureUrl) {
      this.toastr.warning('Please either sign or upload digital signature', 'Digital Signature');
      return;
    } else if (this.signaturePad.isEmpty() && !this.pictureUrl) {
      this.toastr.warning('Please either sign or upload digital signature', 'Digital Signature');
      return;
    } else if (!this.signaturePad.isEmpty()) {
      this.digitalSignature.signatureByte = btoa(this.signaturePad.toDataURL().split(',')[1]);
      this.digitalSignature.editable = true;
    } else {
      this.digitalSignature.signatureByte = btoa(this.pictureUrl.split(',')[1]);
      this.digitalSignature.editable = false;
    }
    this.httpService.callApi('saveDigitalSignature', { body: this.digitalSignature }).subscribe((responce) => {
      this.digitalSignature = responce;
      this.toastr.success('Successfully Saved', 'Digital Signature');
    }, error => {
      this.toastr.error(error.error.message, 'Digital Signature');
    });

    this.closeModal();
  }

  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();
      if (this.isInArray(this.allowedExtensionsForPhoto, fileExtension)) {
        if (file.size > 2097152) {
          this.inputImage.nativeElement.value = '';
          this.toastr.warning('File size should not be greater than 2MB.', 'Digital Signature');
          return;
        }
        var reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event) => {
          let target: any = event.target;
          this.pictureUrl = target.result;
        }
      } else {
        this.inputImage.nativeElement.value = '';
        this.toastr.warning('Only jpeg, jpg or png format allowed!!', 'Digital Signature');
        return;
      }
    }

  }

  removeImage() {
    this.pictureUrl = null;
    this.inputImage.nativeElement.value = '';
  }

  deleteSignature() {
    if (confirm('Are you sure to delete the Digital Signature?')) {
      this.removeImage();
      this.onClear();
      this.digitalSignature.signatureByte = '';
      this.digitalSignature.editable = true;
      this.httpService.callApi('saveDigitalSignature', { body: this.digitalSignature }).subscribe((responce) => {
        this.digitalSignature = responce;
        this.toastr.success('Successfully Deleted', 'Digital Signature');
        this.closeModal();
      }, error => {
        this.toastr.error(error.error.message, 'Digital Signature');
      });
    }

  }


}
