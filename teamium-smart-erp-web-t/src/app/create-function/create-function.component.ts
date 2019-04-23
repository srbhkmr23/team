
import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from '../../../node_modules/primeng/components/common/api';
import { HttpService } from '../core/services/http.service';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { forkJoin } from "rxjs/observable/forkJoin";
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { DataService } from '../core/services/data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-function',
    templateUrl: './create-function.component.html',
    styleUrls: ['./create-function.component.scss']
})
export class CreateFunctionComponent implements OnInit {
    @Input() componentName='Function'
    functionForm: FormGroup;
    functionDropdownData: any;
    selectedNode: TreeNode;
    treeNode: TreeNode[] = [];
    treeNode1: TreeNode[];
    functionNodeList = new Array<TreeNode[]>();
    details: any;
    openFunctionModal: boolean = false;
    checkedList: any = [];
    checkedValue: string;
    functionNameError: string = null;
    accoutingCode: any = [];
    accountDropdownData: any;
    editableModeOn: boolean = false;
    selectedColor: string = '#161514';
    blockedPanel: boolean = false;
    functionListApi: any;
    previousTax: string;
    showDeleteModal:boolean=false;

    constructor(private dataService: DataService, private router: Router, private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { }

    ngOnInit() {
        this.dataService.checkSubmenu(this.router);

        this.blockedPanel = true;
        this.functionForm = this.generateFunctionForm();
        let functionDropdownDataApi = this.httpService.callApi('getFunctionDropdown', {});
        this.functionListApi = this.httpService.callApi('getFunctionList', {});

        forkJoin([this.functionListApi, functionDropdownDataApi]).subscribe(resultList => {
            this.functionDropdownData = resultList[1];
            this.accountDropdownData = [];
            this.accountDropdownData = JSON.parse(JSON.stringify(this.functionDropdownData.accountingCodes));
            // this.accountDropdownData= ;
            resultList[0].forEach(element => {
                let treeNode: any = [this.getTreeNode(element, null)];
                this.functionNodeList.push(treeNode);
            });
            this.blockedPanel = false;
        }, (errorList) => {
            console.log('Error[0] ', errorList[0]);
            console.log('Error[1] ', errorList[1]);
        });



        // console.log('treeNode', this.treeNode)

        // this.functionForm.valueChanges.subscribe(console.log);

        this.functionForm.get('name').valueChanges.subscribe((value) => {
            this.functionNameError = value != null ? value.length == 0 ? (this.checkedValue == 'folder' ? 'Folder' : 'Function') + ' Name is Required' : this.functionForm.get('name').invalid ? 'Invalid ' + (this.checkedValue == 'folder' ? 'Folder' : 'Function') + ' Name.' : null : null;
        });
        // console.log(this.functionForm.get('tax').invalid)

        this.functionForm.get('tax').valueChanges.subscribe((value) => {

            if (value) {

                if (this.previousTax != value) {
                    value = value.replace('%', '');
                    this.previousTax = value.length == 0 ? null : value + "%";
                    this.functionForm.get('tax').setValue(this.previousTax);
                }

                // }
            }

        });
        this.functionForm.get("type").valueChanges.subscribe((value) => {
            if (value == 'Personnel') {
                this.functionForm.get("contract").enable();
            } else {
                this.functionForm.get("contract").disable();
                this.functionForm.get("contract").setValue(null);
            }
        });
    }

    getIcon(functionValue) {
        switch (functionValue.type) {
            case 'staff':
                return 'fa fa-users';
            case 'equipment':
                return 'fa fa-video-camera';
            case 'service':
                return 'fa fa-cog';
            case 'expenses':
                return 'fa fa-money';
            default:
                return 'fa fa-arrow-right';
        }
    }
    getTreeNode(functionValue, parentValue) {
        // fa fa-users
        // fa fa-video-camera
        // fa fa-money
        // fa fa-arrow-right
        let labelValue = functionValue.value;
        let expandedIcon = functionValue.type == 'folder' ? "fa fa-folder-open" : "";
        let collapsedIcon = functionValue.type == 'folder' ? "fa fa-folder" : "";
        let icon = functionValue.type != 'folder' ? this.getIcon(functionValue) : "";
        let chidrens = [];
        if (functionValue.childFunctions == null) {
            let fun = {
                label: labelValue,
                expandedIcon: expandedIcon,
                collapsedIcon: collapsedIcon,
                icon: icon,
                data: {
                    functionValue: functionValue,
                    parentValue: parentValue
                },
                children: chidrens
            }
            return fun;
        }

        functionValue.childFunctions.forEach(element => {
            chidrens.push(this.getTreeNode(element, functionValue));
        });
        return {
            label: labelValue,
            expandedIcon: expandedIcon,
            collapsedIcon: collapsedIcon,
            icon: icon,
            data: {
                functionValue: functionValue,
                parentValue: parentValue
            },
            children: chidrens,
        }
    }

    generateFunctionForm(): FormGroup {

        return this.formBuilder.group({
            id: null,
            parentId: null,
            name: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
            type: [null, Validators.required],
            basis: [null, Validators.required],
            origin: ['internal'],
            group: [null],
            contract: [{ value: null, disabled: true }],
            keyword: [null],
            tax: [null, Validators.compose([Validators.pattern('^([0-9]{1,2})?(\\.[0-9]{1,2})?%$|^(100)%$')])],
            display: [null, Validators.pattern('^[0-9]*$')],
            description: [null],
            accoutingCode: this.formBuilder.group({
                code: [null, Validators.required],
                value: [null, Validators.required],
            }),
        });
    }

    nodeSelect() {
        console.log(' this.selectedNode ', this.selectedNode)
    }

    openModal(edit?: boolean) {
        this.checkedList = [];
        this.openFunctionModal = true;
        this.accoutingCode = [];
        this.accountDropdownData = [];
        this.editableModeOn = false;
        this.selectedColor = '#161514';
        if (this.selectedNode) {
            this.accountDropdownData = JSON.parse(JSON.stringify(this.functionDropdownData.accountingCodes));
            this.selectedNode.data.functionValue.accoutingCode.forEach(element => {
                this.addAccountData(element.type, element.value);
            });
        } else {
            this.accountDropdownData = JSON.parse(JSON.stringify(this.functionDropdownData.accountingCodes));
        }

        if (edit) {

            this.editableModeOn = true;
            this.checkedList.push(this.selectedNode.data.functionValue.type == 'folder' ? 'folder' : 'function');
            this.checkedValue = this.checkedList[0];

            this.selectedColor = this.selectedNode.data.functionValue.theme != null ? this.selectedNode.data.functionValue.theme : '#161514';
            this.functionForm.get('id').setValue(this.selectedNode.data.functionValue.id);
            this.functionForm.get('parentId').setValue(this.selectedNode.data.parentValue != null ? this.selectedNode.data.parentValue.id : null);
            this.functionForm.get('name').setValue(this.selectedNode.label);
            this.functionForm.get('basis').setValue(this.selectedNode.data.functionValue.basis || null);
            this.functionForm.get('contract').setValue(this.selectedNode.data.functionValue.contract || null);
            this.functionForm.get('description').setValue(this.selectedNode.data.functionValue.description || null);
            this.functionForm.get('keyword').setValue(this.selectedNode.data.functionValue.keyword || null);
            this.functionForm.get('origin').setValue(this.selectedNode.data.functionValue.origine || 'internal');
            this.functionForm.get('display').setValue(this.selectedNode.data.functionValue.display || null);
            this.functionForm.get('type').setValue(this.selectedNode.data.functionValue.type || null);
            if (this.selectedNode.data.functionValue.vat) {
                this.functionForm.get('tax').setValue(this.selectedNode.data.functionValue.vat.key || null)
            } else {
                this.functionForm.get('tax').setValue(null)
            }

        } else {
            if (this.selectedNode) {
                this.functionForm.get('parentId').setValue(this.selectedNode.data.functionValue.id);
                if (this.selectedNode.data.parentValue) {
                    this.checkedList.push('function');
                    this.checkedValue = this.checkedList[0];
                    return;
                }
            }
            this.checkedList.push('folder');
            this.checkedList.push('function');
            this.checkedValue = this.checkedList[0];
        }
    }

    closeModal() {
        this.functionForm.reset({ 'origin': 'internal' });
        this.openFunctionModal = false;
    }

    saveFunction() {
        // console
        this.blockedPanel = true;
        let body;
        if (this.checkedValue == 'folder') {
            body = {
                id: this.functionForm.get('id').value,
                value: this.functionForm.get('name').value,
                type: this.checkedValue == 'folder' ? 'folder' : this.functionForm.get('type').value,
                theme: this.selectedColor,
                parent: {
                    id: this.functionForm.get('parentId').value
                }
            }
        } else {
            body = {
                id: this.functionForm.get('id').value,
                value: this.functionForm.get('name').value,
                type: this.checkedValue == 'folder' ? 'folder' : this.functionForm.get('type').value,
                basis: this.functionForm.get('basis').value,
                display: this.functionForm.get('display').value,
                description: this.functionForm.get('description').value,
                keyword: this.functionForm.get('keyword').value,
                origine: this.functionForm.get('origin').value,
                contract: this.functionForm.get('contract').value,
                theme: this.selectedColor,
                vat: {
                    key: this.functionForm.get('tax').value ? this.functionForm.get('tax').value.replace('%', '') : null
                },
                accoutingCode: this.accoutingCode,
                parent: {
                    id: this.functionForm.get('parentId').value
                }
            }
        }


        this.httpService.callApi('saveFunction', { body }).subscribe((respose) => {
            if (this.selectedNode) {
                if (this.functionForm.get('id').value) {
                    this.selectedNode.label = respose.value;
                    this.selectedNode.icon = respose.type != 'folder' ? this.getIcon(respose) : "";
                    this.selectedNode.data.functionValue = respose;

                    this.selectedNode.children.forEach(dt => {
                        dt.data.parentValue = respose;
                    });
                    this.toastr.success('Successfully Saved', this.checkedValue == 'folder' ? 'Folder' : 'Function');
                } else {
                    this.selectedNode.children.push(this.getTreeNode(respose, this.selectedNode.data.functionValue));
                    this.toastr.success('Successfully Saved', this.checkedValue == 'folder' ? 'Folder' : 'Function');
                }
            } else {
                this.functionNodeList.push([this.getTreeNode(respose, null)]);
                console.log('  this.checkedList ', this.checkedValue)
                this.toastr.success('Successfully Saved', this.checkedValue == 'folder' ? 'Folder' : 'Function');
            }
            this.blockedPanel = false;
            this.closeModal();
        }, (error) => {
            console.log('Error while saving ', error)
            this.toastr.error(error.error.message, this.checkedValue == 'folder' ? 'Folder' : 'Function');
            this.blockedPanel = false;
        });
    }

    clearSpace(formname, fieldName) {
        let value = formname.get(fieldName).value;
        if (value) {
            formname.get(fieldName).setValue(value.trim());
        }
    }
    checkLenght() {
        let name = this.functionForm.get('accoutingCode').get('value').value
        return (name && name.trim().length == 0);
    }

    addAccounting() {
        const accountForm = this.functionForm.get('accoutingCode');
        let accountingCode = accountForm.get('code').value;
        let accountingValue = accountForm.get('value').value
        this.addAccountData(accountingCode, accountingValue);
        accountForm.reset();
    }

    addAccountData(accountingCode, accountingValue) {
        this.accoutingCode.push({
            type: accountingCode,
            value: accountingValue
        });
        this.accountDropdownData.splice(this.accountDropdownData.indexOf(accountingCode), 1);
    }

    removeAccounting(accounting: any) {
        this.accoutingCode.splice(this.accoutingCode.indexOf(accounting), 1);
        this.accountDropdownData.push(accounting.type);
    }

    disableSaveButton() {
        if (this.checkedValue) {
            let name = this.functionForm.get('name').value
            if (!name || name.trim().length == 0) {
                return true;
            }
            if (this.checkedValue == 'function') {
                if (this.functionForm.get('type').invalid) {
                    return true;
                }
                if (this.functionForm.get('basis').invalid) {
                    return true;
                }
                if (this.functionForm.get('display').invalid) {
                    return true;
                }
                if (this.functionForm.get('tax').invalid) {
                    return true;
                }
            }


        }
        return false;
    }

    deleteFunction($event) {
        if($event){
            this.httpService.callApi('deleteFunction', { pathVariable: '/' + this.selectedNode.data.functionValue.id }).subscribe((response => {
                this.toastr.success('Successfully Deleted', this.selectedNode.data.functionValue.type == 'folder' ? 'Folder' : 'Function');
                this.functionListApi.subscribe((response) => {
                    this.functionNodeList = [];
    
                    response.forEach(element => {
                        let treeNode: any = [this.getTreeNode(element, null)];
                        this.functionNodeList.push(treeNode);
                    });
    
                    this.selectedNode = null;
                    this.showDeleteModal=false;
                });
    
            }), (error) => {
                console.log('Deleting Error ', error);
                this.toastr.error(error.error.message, 'Function');
    
            })
    
        }
    }
    hideDeleteModal($event){
        this.showDeleteModal=$event;
    }
    changeCheckedValue(checkedValue) {
        this.checkedValue = checkedValue;
        this.functionNameError = null
    }

}
