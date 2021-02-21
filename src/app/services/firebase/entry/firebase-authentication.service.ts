import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Credentials } from './credentials';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../authentication/authentication.service';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;

@Injectable()
export class FirebaseAuthenticationService {

	constructor(private readonly fireAuth: AngularFireAuth,
				private readonly authService: AuthenticationService,
				private readonly matSnackBar: MatSnackBar) {
	}

	login(credentials: Credentials): Promise<void> {
		return this.fireAuth.signInWithEmailAndPassword(credentials.email, credentials.password)
				   .then(() => {
					   this.matSnackBar.open('Login success', '', {
						   duration: 5000
					   });
				   }, (error) => {
					   this.matSnackBar.open(error, '', {
						   duration: 5000
					   });
				   });
	}

	logout() {
		this.fireAuth.signOut().then(() => {
		}, () => {
			this.authService.next(false);
		});
	}

	loginAnonymously(): Promise<UserCredential> {
		return this.fireAuth.signInAnonymously();
	}

}
