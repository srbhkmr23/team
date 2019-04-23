import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material';
import {MatSliderModule} from '@angular/material/slider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {TranslateModule} from '@ngx-translate/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ColorPickerModule } from 'ngx-color-picker';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
 
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    ColorPickerModule, 
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ],
  declarations: [],
  exports: [ 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    MatCheckboxModule,
    ColorPickerModule, 
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ]
})
export class SharedModule { }
