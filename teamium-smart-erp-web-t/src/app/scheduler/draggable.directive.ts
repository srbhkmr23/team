import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';

@Directive({ selector: '[draggableToScheduler]' })
export class DraggableDirective implements AfterViewInit {

  @Input('draggableToScheduler') options: any;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.options.element = this.el.nativeElement;
    DayPilot.Scheduler.makeDraggable(this.options);
  }
}
