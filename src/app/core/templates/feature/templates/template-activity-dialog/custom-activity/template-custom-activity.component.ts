import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import { TemplateActivityForm } from '../template-activity-form';
import { TemplateActivity } from '../../../../template-activity';

@Component({
	selector: 'ac-dialog-custom-activity',
	template: `
		<form [formGroup]="activityForm">

			<mat-form-field>

				<mat-label>Activity</mat-label>
				<input matInput type="text" formControlName="name">

				<button *ngIf="hasValue('name')"
						type="button"
						(click)="clearFormItem('name')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<div *ngIf="getFormEntries()"
				 [formArrayName]="'entries'">
				<!--TODO getFormEntries not needed ?-->
				<div *ngFor="let item of getFormEntries().controls; let i = index"
					 [formGroupName]="i">

					<div style="display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 16px">

						<mat-form-field>

							<mat-label>Value</mat-label>
							<input matInput type="text" [formControlName]="'value'">

							<button *ngIf="hasValue('value')"
									type="button"
									(click)="clearFormItem('value')"
									mat-button matSuffix mat-icon-button aria-label="Clear">
								<mat-icon>close</mat-icon>
							</button>

						</mat-form-field>

						<mat-form-field>

							<mat-label>Unit</mat-label>

							<mat-select [formControlName]="'unit'">
								<mat-option *ngFor="let unit of units"
											[value]="unit">
									{{unit}}
								</mat-option>
							</mat-select>

							<button *ngIf="hasValue(i.toString())"
									type="button"
									(click)="clearFormItem(i.toString())"
									mat-button matSuffix mat-icon-button aria-label="Clear">
								<mat-icon>close</mat-icon>
							</button>

						</mat-form-field>
					</div>
				</div>

			</div>

			<button mat-button (click)="addEntry()">
				Add entry
			</button>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateCustomActivityComponent extends TemplateActivityForm implements OnChanges, OnInit {

	@Input()
	units: Array<string>;

	@Input()
	templateActivity: TemplateActivity;

	@Output()
	onCalendarActivity = new EventEmitter();

	constructor() {
		super();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.templateActivity) {
			this.initForm(this.templateActivity);
		}
	}

	ngOnInit() {
		this.activityForm
			.valueChanges
			.pipe(this.takeUntil())
			.subscribe((value: any) => {
				this.onCalendarActivity.emit(value);
			});
	}
}
