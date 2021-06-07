import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivityCalendarForm } from '../../../common/utils/form/activity-calendar-form';

@Component({
	selector: 'ac-registration',
	template: `
		<h1>REGISTRATION</h1>
		<form [formGroup]="form">
			<mat-form-field class="example-form-field">

				<mat-label>Email</mat-label>
				<input matInput type="text" formControlName="email">

				<button *ngIf="hasValue('email')"
						(click)="clearFormItem('email')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<mat-form-field class="example-form-field">

				<mat-label>Password</mat-label>

				<input matInput type="password" formControlName="password">

				<button *ngIf="hasValue('password')"
						(click)="clearFormItem('password')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<button mat-raised-button color="primary" (click)="register()">
				Register
			</button>
		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent extends ActivityCalendarForm {

	constructor(private readonly formBuilder: FormBuilder,
				private readonly firestore: AngularFirestore,
				private readonly fireAuth: AngularFireAuth) {
		super();
		this.form = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	register() {
		if (this.form.valid) {
			const email = this.form.controls['email'].value,
				password = this.form.controls['password'].value;

			// this.fireAuth
			// 	.createUserWithEmailAndPassword(email, password)
			// 	.then();
		}
	}
}
