import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from '../core/services/common-data.service';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.scss']
})
export class ProfilePicComponent implements OnInit {
  profilePicUrl: string = "";
  constructor(public router: Router,public commonDataService: CommonDataService) { }

  ngOnInit() {
    let userData=this.commonDataService.getLoggedInUserData();
    if(userData.hasOwnProperty('profileUrl')){
      this.profilePicUrl=userData['profileUrl'] || "";
    }

    
  }

  goTOProfile=()=>{
    this.router.navigate(['/teamium/personal-edit']);
  }

}
