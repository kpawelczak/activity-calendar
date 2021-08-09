import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Credentials } from '../../routes/entry/infrastructure/credentials';

@Injectable()
export class FirebaseAuthenticationService {

	constructor(private readonly fireAuth: AngularFireAuth) {
	}

	login(credentials: Credentials): Promise<void> {
		return this.fireAuth
				   .signInWithEmailAndPassword(credentials.email, credentials.password)
				   .then();
	}

	loginAnonymously(): Promise<void> {
		return this.fireAuth
				   .signInAnonymously()
				   .then();
	}

	logout(): Promise<void> {
		return this.fireAuth.signOut();
	}

}
