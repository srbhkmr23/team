import { Directive,Output, HostListener, ElementRef, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appOuterClick]'
})
export class OuterClickDirective {
  @Output() executeFunction=new EventEmitter<boolean>();
  constructor(private el: ElementRef) {   
  }
  @HostListener('click', ['$event'])
  clickout(event) {
    if (event.target !== event.currentTarget) {
    }
    else{
      this.executeFunction.emit();
    };
  }


}
