import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseRegistrationService } from './firebase-registration.service';
import { FirebaseAuthenticationService } from './firebase-authentication.service';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirebaseRegistrationService,
		FirebaseAuthenticationService
	]
})
export class FirebaseEntryModule {

}
