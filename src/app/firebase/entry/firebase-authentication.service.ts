import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Credentials } from './credentials';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase';
import { Router } from '@angular/router';
import User = firebase.User;

@Injectable()
export class FirebaseAuthenticationService {

	constructor(private readonly fireAuth: AngularFireAuth,
				private readonly matSnackBar: MatSnackBar,
				private readonly router: Router) {
		this.fireAuth.authState.subscribe((user: User | null) => {
			if (user) {
				console.log(user);
				this.router.navigate(['client']);
			}
		});
	}

	login(credentials: Credentials) {
		this.fireAuth.signInWithEmailAndPassword(credentials.email, credentials.password)
			.then((response) => {
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
			this.router.navigate(['entry']);
		});
	}

}
