import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-bookingconflict-modal',
  templateUrl: './bookingconflict-modal.component.html',
  styleUrls: ['./bookingconflict-modal.component.scss']
})
export class BookingconflictModalComponent implements OnInit {
  @Input() bookingConflitList:any;
  @Output() closeModalEvent=new EventEmitter<boolean>();
  eventsList=[];
  currentTime:any;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.currentTime=new Date();
    this.currentTime=this.currentTime.toLocaleString();
    this.currentTime=this.currentTime.split(',');
    this.currentTime[1]=this.currentTime[1].slice(0,this.currentTime[1].length-2)
    let counter=0;
    this.bookingConflitList.forEach(element=>{
      counter++
      if(counter<4)
      element['events'].forEach(value=>{
        this.eventsList.push(value);
      })
    })
  }
  downloadSheet(){

  }
  goToSchedule(line) {
    let pathVariable: any = new Array();
    pathVariable.push(line);
    this.dataService.addPathvariables(pathVariable);
    this.dataService.openSubmenu('/teamium/schedule-timeline');
  }
  hideBookingConflictModal() {
    this.closeModalEvent.emit(false);
  }

}
