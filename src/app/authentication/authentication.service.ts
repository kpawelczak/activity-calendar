import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Reactive } from '../common/cdk/reactive';
import { FirebaseAuthenticationService } from './infrastructure/firebase-authentication.service';
import { Credentials } from '../entry/infrastructure/credentials';
import { Router } from '@angular/router';
import { RouteName } from '../route-name';
import { ActivityCalendarSnackbarService } from '../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';

@Injectable()
export class AuthenticationService extends Reactive {

	private readonly loggedIn$ = new ReplaySubject<boolean>(1);

	constructor(private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
				private readonly acSnackbar: ActivityCalendarSnackbarService,
				private readonly router: Router) {
		super();
	}

	onLoggedIn(): Observable<boolean> {
		return this.loggedIn$.asObservable();
	}

	next(loggedIn: boolean): void {
		this.loggedIn$.next(loggedIn);
	}

	login(credentials: Credentials): Promise<void> {
		return this.firebaseAuthenticationService
				   .login(credentials)
				   .then(() => {
					   this.acSnackbar.notify('Login success');
					   this.next(true);
					   this.redirectBasedOnStatus(true);
				   }, (error) => {
					   this.acSnackbar.notify(error, {
						   warn: true
					   });
				   });
	}

	loginAnonymously(): Promise<void> {
		return this.firebaseAuthenticationService
				   .loginAnonymously()
				   .then(() => {
					   this.acSnackbar.notify('Login success');
					   this.next(true);
					   this.redirectBasedOnStatus(true);
				   }, (error) => {
					   this.acSnackbar.notify(error, {
						   warn: true
					   });
				   });
	}

	logout(): void {
		this.firebaseAuthenticationService
			.logout()
			.then(() => {
				this.next(false);
				this.redirectBasedOnStatus(false);
			});
	}

	redirectBasedOnStatus(loggedIn: boolean): void {
		const route = loggedIn ? RouteName.CLIENT : RouteName.ENTRY;
		this.router.navigate([route]);
	}
}
