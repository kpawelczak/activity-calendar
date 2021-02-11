import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseRegistrationService } from './firebase-registration.service';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
	imports: [
		CommonModule,
		MatSnackBarModule
	],
	providers: [
		FirebaseRegistrationService,
		FirebaseAuthenticationService
	]
})
export class FirebaseEntryModule {

}
