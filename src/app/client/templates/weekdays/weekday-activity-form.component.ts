import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import { ActivityForm } from '../../../common/form/activity-form';
import { FormBuilder } from '@angular/forms';
import { FirebaseTemplatesService } from '../../../firebase/templates/firebase-templates.service';
import { Activity } from '../activity';

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

			<button mat-icon-button (click)="onDeletion.emit()">
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
	templateActivity: Activity;

	@Input()
	weekday: string;

	@Output()
	onDeletion = new EventEmitter;

	loading: boolean;

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
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
			this.firebaseTemplatesService.saveActivityToTemplate(this.weekday, this.form.value);
		}
	}
}
