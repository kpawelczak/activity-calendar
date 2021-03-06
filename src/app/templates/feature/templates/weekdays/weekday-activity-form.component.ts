import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivityForm } from '../../../../common/utils/form/activity-form';
import { FormBuilder } from '@angular/forms';
import { TemplateActivity } from '../../../template-activity';
import { TemplateService } from '../../../store/template/template.service';
import { WeekdayTemplate } from '../../../store/weekday-template';

@Component({
	selector: 'ac-template-activity-form',
	template: `
		<form [formGroup]="form">

			<mat-form-field class="example-form-field">

				<mat-label>Activity</mat-label>
				<input matInput type="text" formControlName="name">

				<button *ngIf="hasValue('name')"
						type="button"
						(click)="clearFormItem('name')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<mat-form-field class="example-form-field">

				<mat-label>Amount</mat-label>

				<input matInput type="text" formControlName="amount">

				<button *ngIf="hasValue('amount')"
						type="button"
						(click)="clearFormItem('amount')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<button mat-icon-button
					[type]="'submit'"
					(click)="saveActivity()">
				<mat-icon>
					save
				</mat-icon>
			</button>

			<button mat-icon-button (click)="deleteTemplateActivity()">
				<mat-icon>
					delete
				</mat-icon>
			</button>

		</form>
	`,
	host: {
		'[class.ac-template-activity-form]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayActivityFormComponent extends ActivityForm implements OnChanges {

	@Input()
	templateActivity: TemplateActivity;

	@Input()
	weekdayTemplate: WeekdayTemplate;

	loading: boolean;

	constructor(private readonly weekdayTemplateService: TemplateService,
				formBuilder: FormBuilder) {
		super(formBuilder);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.templateActivity) {
			if (this.templateActivity) {
				this.fillForm(this.templateActivity);
			}
		}
	}

	saveActivity(): void {
		if (this.form.valid) {
			this.loading = true;

			const newTemplate = !this.templateActivity.name;

			const name = this.form.controls['name'].value,
				amount = this.form.controls['amount'].value,
				uuid = this.templateActivity.templateUUID,
				weekday = this.weekdayTemplate.getWeekday(),
				templateActivity = new TemplateActivity(weekday, name, amount, uuid);

			if (newTemplate) {
				this.weekdayTemplateService.addActivityToTemplate(this.weekdayTemplate, templateActivity);
			} else {
				this.weekdayTemplateService.saveActivityToTemplate(this.weekdayTemplate, templateActivity).subscribe();
			}
		}
	}

	deleteTemplateActivity(): void {
		this.weekdayTemplateService.deleteTemplateActivity(this.weekdayTemplate, this.templateActivity);
	}
}
