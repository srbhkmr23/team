import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
    { path: "", component: SigninComponent}
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})
export class SigninRoutingModule {}