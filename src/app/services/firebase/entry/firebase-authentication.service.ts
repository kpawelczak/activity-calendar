import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Credentials } from './credentials';
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivityCalendarSnackbarService } from '../../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';

@Injectable()
export class FirebaseAuthenticationService {

	constructor(private readonly fireAuth: AngularFireAuth,
				private readonly authService: AuthenticationService,
				private readonly acSnackbar: ActivityCalendarSnackbarService) {
	}

	login(credentials: Credentials): Promise<void> {
		return this.fireAuth
				   .signInWithEmailAndPassword(credentials.email, credentials.password)
				   .then(() => {
					   this.acSnackbar.notify('Login success');
				   }, (error) => {
					   this.acSnackbar.notify(error, {
						   warn: true
					   });
				   });
	}

	logout() {
		this.fireAuth.signOut().then(() => {
		}, () => {
			this.authService.next(false);
		});
	}

	loginAnonymously(): Promise<void> {
		return this.fireAuth.signInAnonymously()
				   .then(() => {
					   this.acSnackbar.notify('Login success');
				   }, (error) => {
					   this.acSnackbar.notify(error, {
						   warn: true
					   });
				   });
	}

}
