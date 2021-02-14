import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { RouteNames } from '../../route-names';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthenticationService } from '../../firebase/entry/firebase-authentication.service';

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

			<ac-button [type]="'submit'"
					   [loading]="loadingUser"
					   (click)="login()">
				login
			</ac-button>

			<ac-button [type]="'submit'"
					   [loading]="loadingAnonymous"
					   (click)="loginAnonymously()">
				Login anonymously
			</ac-button>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

	RouteNames = RouteNames;

	form: FormGroup;

	loadingUser: boolean;

	loadingAnonymous: boolean;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly firebaseService: FirebaseAuthenticationService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
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
		if (this.form.valid) {
			this.loadingUser = true;
			const email = this.form.controls['email'].value,
				password = this.form.controls['password'].value;

			this.firebaseService
				.login({ email, password })
				.finally(() => {
					this.loadingUser = false;
					this.changeDetectorRef.detectChanges();
				});
		}
	}

	loginAnonymously(): void {
		this.loadingAnonymous = true;

		this.firebaseService
			.loginAnonymously()
			.finally(() => {
				this.loadingAnonymous = false;
				this.changeDetectorRef.detectChanges();
			});
	}

	logout(): void {
		this.firebaseService.logout();
	}
}
