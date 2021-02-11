import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	template: `
		<h1 style="color: white">REGISTRATION</h1>
		<form [formGroup]="form">
			<mat-form-field class="example-form-field">

				<mat-label>Email</mat-label>
				<input matInput type="text" formControlName="email" style="color: white">

				<button *ngIf="hasValue('email')"
						(click)="clearFormItem('email')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<mat-form-field class="example-form-field">

				<mat-label>Password</mat-label>

				<input matInput type="password" formControlName="password" style="color: white">

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
export class RegistrationComponent {
	form: FormGroup;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly firestore: AngularFirestore,
				private readonly fireAuth: AngularFireAuth) {
		this.form = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	clearFormItem(formControlValue: string): void {
		this.form.controls[formControlValue].reset();
	}

	hasValue(formControlName: string): boolean {
		return !!this.form.controls[formControlName].value;
	}

	register() {
		if (this.form.valid) {
			const email = this.form.controls['email'].value,
				password = this.form.controls['password'].value;

			this.fireAuth
				.createUserWithEmailAndPassword(email, password)
				.then(() => {

				});
		}
	}
}
