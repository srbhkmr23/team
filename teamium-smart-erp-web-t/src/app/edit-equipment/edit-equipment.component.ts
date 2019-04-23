import { Component, OnInit, HostListener } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from '../core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserDetailsService } from '../core/services/user-details.service';


@Component({
  selector: 'app-edit-equipment',
  templateUrl: './edit-equipment.component.html',
  styleUrls: ['./edit-equipment.component.scss']
})
export class EditEquipmentComponent implements OnInit {
  showSaveEquipmentModal: boolean = false;
  equipmentDetail: any;
  equipmentId: number;
  loggedInUser: any;
  isEquipmentManager: boolean = false;
  packegeEquipmentList: any = [];
  showFeactureIndex: number;
  blockedPanel:any;
  recentBookings : any;

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService, private userDetailsService: UserDetailsService, private router: Router) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.route.params.subscribe(params => this.equipmentId = params.id);
    let pathVariable: any = new Array();
    // pathVariable.push(this.equipmentId);
    pathVariable.push({ "equipmentId": this.equipmentId });
    this.dataService.addPathvariables(pathVariable);

    this.getEquipmentDetailById();
    this.userDetailsService.isValidateUserRoleForModule('Equipment Manager', (res) => {
      this.isEquipmentManager = res;

    });




  }

  /*-To get equipment by id -*/
  getEquipmentDetailById() {
    this.blockedPanel=true;
    this.httpService.callApi('getEquipmentById', { pathVariable: this.equipmentId }).subscribe(reaponse => {
      this.equipmentDetail = reaponse;
      this.recentBookings = this.equipmentDetail.recentBooking;
      this.getEquipmentForSeletedPacakge(this.equipmentDetail.resource.id).subscribe(reaponse => {

        this.packegeEquipmentList = reaponse;
        this.blockedPanel=false;
      }, error => {
        console.log(error);
        this.blockedPanel=false;
      });
    }, error => {
      console.log(error);
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Equipment');
    });
  }


  /*-To close create-equipment component and refresh it. -*/
  closeModal($event) {
    this.showSaveEquipmentModal = $event;
    this.ngOnInit();
  }


  getEquipmentForSeletedPacakge(resourceId: number): Observable<any> {
    return this.httpService.callApi('getEquipmentForSeletedPacakge', { pathVariable: resourceId });
  }


  getAttachmentImage(attachment) {
    let imageUrl = '';
    if (attachment.feedByUrl.toString() == 'true') {
      imageUrl = '../../assets/img/url.png';
    } else if (attachment.extension == 'pdf') {
      imageUrl = '../../assets/img/pdf_logo.jpg';
    } else {
      imageUrl = '../../assets/img/image_icon.png';
    }
    return imageUrl;
  }

  showFeature(id) {
    if (this.showFeactureIndex) {
      if (this.showFeactureIndex == id) {
        this.showFeactureIndex = null;
        return;
      }
    }
    this.showFeactureIndex = id;
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#feature-id')) {
      this.showFeactureIndex = null;
    }
  }
}
