import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class FirebaseRegistrationService {

	constructor(private readonly fireAuth: AngularFireAuth) {
	}

	registerNewUser(email: string, password: string): void {
		this.fireAuth
			.createUserWithEmailAndPassword(email, password)
			.then(() => {

			});
	}
}
