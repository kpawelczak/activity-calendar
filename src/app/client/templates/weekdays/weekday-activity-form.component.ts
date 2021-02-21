import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivityForm } from '../../../common/form/activity-form';
import { FormBuilder } from '@angular/forms';
import { TemplateActivity } from '../../../common/models/template-activity';
import { WeekdayTemplate } from '../../../repositories/templates/weekday-template';
import { WeekdayTemplateService } from './weekday-template.service';

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

				<mat-label>Reps</mat-label>

				<input matInput type="text" formControlName="reps">

				<button *ngIf="hasValue('reps')"
						type="button"
						(click)="clearFormItem('reps')"
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
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayActivityFormComponent extends ActivityForm implements OnChanges {

	@Input()
	templateActivity: TemplateActivity;

	@Input()
	weekdayTemplate: WeekdayTemplate;

	loading: boolean;

	constructor(private readonly weekdayTemplateService: WeekdayTemplateService,
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
			const name = this.form.controls['name'].value,
				reps = this.form.controls['reps'].value,
				uuid = this.templateActivity.templateUUID ? this.templateActivity.templateUUID : '',
				templateActivity = new TemplateActivity(name, reps, uuid);

			this.weekdayTemplateService.saveActivityToTemplate(this.weekdayTemplate, templateActivity);
		}
	}

	deleteTemplateActivity(): void {
		this.weekdayTemplateService.deleteTemplateActivity(this.weekdayTemplate, this.templateActivity);
	}
}
