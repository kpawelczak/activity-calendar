import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouteNames } from '../../route-names';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthenticationService } from '../../firebase/entry/firebase-authentication.service';

@Component({
	selector: 'ac-login',
	template: `
		<div [routerLink]="'../' + RouteNames.CLIENT" style="color: red">calendar</div>
		<div [routerLink]="'./' + RouteNames.REGISTRATION" style="color: red">registration</div>
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

				<input matInput formControlName="password">

				<button *ngIf="hasValue('password')"
						(click)="clearFormItem('password')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<button mat-raised-button color="primary"
					(click)="login()">login
			</button>
		</form>

		<button (click)="logout()"> logout</button>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
	RouteNames = RouteNames;
	form: FormGroup;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly authenticationService: FirebaseAuthenticationService) {
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

	login(): void {
		const email = this.form.controls['email'].value,
			password = this.form.controls['password'].value;

		this.authenticationService.login({ email, password });
	}

	logout(): void {
		this.authenticationService.logout();
	}
}
