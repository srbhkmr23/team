import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public isFirstTimeLogIn: boolean = false;
  public isLoggedIn: boolean = false;
  private submenuSource = new BehaviorSubject('');
  openSubmenuItem = this.submenuSource.asObservable();

  private submenuSourceForBack = new BehaviorSubject('');
  submenuSourceForBackItem = this.submenuSourceForBack.asObservable();

  public pathVariable: any;
  private selectedPersonnel: any;
  public currentId : any;
  
  private selectedReel = new BehaviorSubject(null);
  currentSelectedReel = this.selectedReel.asObservable();

  private dropDownValue = new BehaviorSubject(null);
  dropDownValueChange = this.dropDownValue.asObservable();
  
  constructor(private router: Router, private httpService: HttpService, private toastr: ToastrService) {

  }

  isUserLoggedIn = () => {
    return this.isLoggedIn;
  }

  isUserFirstTimeLogIn = () => {
    return this.isFirstTimeLogIn;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['signin']);
  }

  addPathvariables(pathVariable: any) {
    this.pathVariable = pathVariable;
  }

  saveEquipment(obj: any) {
    this.httpService.callApi('saveEquipment', { body: obj }).subscribe((response) => {
      this.toastr.success('Successfully Saved', 'Equipment');
    }, error => {
      this.toastr.error(error.error.message, 'Equipment');
      console.log('Error getstatus => ', error)
    });
  }

  getSelectedPersonnel(personnelId: number,cb) {
    console.log('personnelId ',personnelId,' this.selectedPersonnel ',this.selectedPersonnel)
    if (this.selectedPersonnel) {
      cb(this.selectedPersonnel);
    } else {
      this.httpService.callApi('getPersonalById', { pathVariable: '/' + personnelId }).subscribe(response => {
        this.selectedPersonnel=response;
        console.log(response)
        cb(this.selectedPersonnel);
      }, error => {
        console.log('Error ', error)
      })
    }
  }

  set setSelectedPersonnel(selectedPersonnel: any) {
    this.selectedPersonnel = selectedPersonnel;
  }

  changeReel(reel: any) {
    this.selectedReel.next(reel) 
  }

  dropDownChange(value: any) {
    this.dropDownValue.next(value) 
  }

  openSubmenu(message?:any) {
    this.submenuSource.next(message);
  }

  checkSubmenu(message?:any) {
    this.submenuSourceForBack.next(message);
  }

  
}