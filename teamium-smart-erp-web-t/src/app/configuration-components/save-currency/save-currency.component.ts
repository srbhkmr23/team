import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-save-currency',
  templateUrl: './save-currency.component.html',
  styleUrls: ['./save-currency.component.scss']
})
export class SaveCurrencyComponent implements OnInit {

  blockedPanel: boolean = true;
  currencyList: any = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();
  searchText: string = "";
  searchText2: string = "";
  showCurrencyDropdown: boolean = true;
  selectedCurrency: any = null;
  selectedCurrencyCode: string = '';

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { }

  ngOnInit() {
    this.blockedPanel = true;
    this.getCurrencyData();
    this.blockedPanel = false;
  }

  hideCurrencyModal() {
    this.closeModalEvent.emit(false);
  }

  getCurrencyData() {
    this.blockedPanel = true;
    this.httpService.callApi('getCurrencyList', {}).subscribe((reponse) => {
      this.currencyList = reponse;
      this.blockedPanel = false;
    }, (error) => {
      this.toastr.error(error.error.message, 'Currency');
    });
  }

  selectCurrency(currency: any) {
    this.showCurrencyDropdown = false;
    this.selectedCurrency = currency;
    this.selectedCurrencyCode = this.selectedCurrency.code;
  }

  activeCurrency() {
    if(!this.selectedCurrencyCode){
      this.toastr.warning("No currency selected","Currency");
      return;
    }
    let curr = JSON.parse(JSON.stringify(this.selectedCurrency));
    curr.active = true;
    this.blockedPanel = true;
    this.httpService.callApi('saveCurrency', { body: curr }).subscribe((reponse) => {
      this.selectedCurrency.active = true;
      this.selectedCurrencyCode = '';
      this.toastr.success("Successfully Activated","Currency");
    }, (error) => {
      this.toastr.error(error.error.message, 'Currency');
    });
    this.blockedPanel = false;
  }

  deactiveCurrency(currency: any) {
    if(currency.defaultCurrency){
      this.toastr.warning("Default currency can't be deactivated","Currency");
      return;
    }
    this.blockedPanel = true;
    let curr = JSON.parse(JSON.stringify(currency));
    curr.active = false;
    this.httpService.callApi('saveCurrency', { body: curr }).subscribe((reponse) => {
      currency.active = false;
      this.toastr.success("Successfully Deactivated","Currency");
    }, (error) => {
      this.toastr.error(error.error.message, 'Currency');
    });
    this.blockedPanel = false;
  }

  changeDefaultCurrency(newDefaultcurrency: any) {
    if(newDefaultcurrency.defaultCurrency){
      return;
    }
    this.blockedPanel = true;
    let curr = JSON.parse(JSON.stringify(newDefaultcurrency));
    curr.defaultCurrency = true;
    curr.active = true;
    this.httpService.callApi('saveCurrency', { body: curr }).subscribe((reponse) => {
      this.currencyList.forEach(currency => {
        if (currency.defaultCurrency === true) {
          currency.defaultCurrency = false;
        }
      });
      newDefaultcurrency.defaultCurrency = true;
      newDefaultcurrency.active = true;
      this.toastr.success("Successfully Saved","Currency");
    }, (error) => {
      this.toastr.error(error.error.message, 'Currency');
    });
    this.blockedPanel = false;
  }

  filterActive(currencyList: Array<any>, active: boolean): Array<any> {
    return currencyList.filter(currency => {
      return currency.active == active;
    });
  }

  @HostListener('document:click', ['$event.target'])
  clickOutSide(target){
    if(!target.closest('#currency-dropdown'))
    this.showCurrencyDropdown = false;

  }
}
