import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Type } from '@angular/core';
import { Reactive } from './reactive';

export abstract class AbstractFormArray<T> extends Reactive {

	private form: FormGroup;

	private formArray = new FormArray([]);

	protected constructor() {
		super();
		this.form = new FormGroup({
			formArray: this.formArray
		});
	}

	abstract getType(): Type<T>;

	getFormArray(): FormArray {
		return <FormArray> this.form.controls['formArray'];
	}

	selected(i: number, value: any): void {
		const item = this.getFormArray().controls[i];
		item.patchValue(value);
	}

	protected createFormArray(itemsArray: Array<T>): FormArray {

		itemsArray.forEach((arrayItem: T) => {
			this.addToFormArray(arrayItem);
		});
		return this.getFormArray();
	}

	protected addToFormArray(arrayItem: T): void {
		const keys = Object.keys(arrayItem),
			itemControls = {};

		keys.forEach((key: string, i: number) => {
			const obj = { [key]: new FormControl(Object.values(arrayItem)[i]) };
			Object.assign(itemControls, obj);
		});

		const formItem = new FormGroup({
			...itemControls
		});

		this.formArray.push(formItem);
	}

	protected clearFormArray(): void {
		if (this.getFormArray()) {
			this.getFormArray().clear();
		}
	}
}
