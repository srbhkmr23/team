export class CheckBox {
    label: string;
    value: string;
    checked: boolean;

    constructor(label: string, value: any, checked: boolean) {
        this.label = label;
        this.value = value;
        this.checked = checked;
    }
}
