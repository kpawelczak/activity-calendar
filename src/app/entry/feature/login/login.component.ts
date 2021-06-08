import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { RouteName } from '../../../route-name';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivityCalendarForm } from '../../../common/utils/form/activity-calendar-form';
import { AuthenticationService } from '../../../authentication/authentication.service';

@Component({
	selector: 'ac-login',
	template: `
		<h1>LOGIN</h1>

		<form [formGroup]="form">

			<mat-form-field class="example-form-field">

				<mat-label>Email</mat-label>

				<input matInput
					   type="text"
					   formControlName="email">

				<button *ngIf="hasValue('email')"
						mat-button
						matSuffix
						mat-icon-button
						aria-label="Clear"
						type="button"
						(click)="clearFormItem('email')">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<mat-form-field class="example-form-field">

				<mat-label>Password</mat-label>

				<input matInput
					   formControlName="password"
					   type="password">

				<button *ngIf="hasValue('password')"
						mat-button matSuffix
						mat-icon-button
						aria-label="Clear"
						type="button"
						(click)="clearFormItem('password')">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<div class="entry-login-buttons-wrapper">
				<ac-button [type]="'submit'"
						   [loading]="loadingUser"
						   (click)="login()">
					Login
				</ac-button>

				<div>or</div>

				<ac-button [type]="'button'"
						   [loading]="loadingAnonymous"
						   (click)="loginAnonymously()">
					Login anonymously
				</ac-button>
			</div>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends ActivityCalendarForm {

	RouteNames = RouteName;

	loadingUser: boolean;

	loadingAnonymous: boolean;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly authenticationService: AuthenticationService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
		this.form = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}

	login(): void {
		if (this.form.valid) {
			this.loadingUser = true;
			const email = this.form.controls['email'].value,
				password = this.form.controls['password'].value;

			this.authenticationService
				.login({ email, password })
				.then(() => {
					this.loadingUser = false;
					this.changeDetectorRef.detectChanges();
				});
		}
	}

	loginAnonymously(): void {
		this.loadingAnonymous = true;

		this.authenticationService
			.loginAnonymously()
			.then(() => {
				this.loadingAnonymous = false;
				this.changeDetectorRef.detectChanges();
			});
	}

	logout(): void {
		this.authenticationService.logout();
	}
}
