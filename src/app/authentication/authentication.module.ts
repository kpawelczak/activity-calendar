import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from './authentication.service';
import { AuthenticationGuard } from './authentication.guard';
import { FirebaseAuthenticationService } from './infrastructure/firebase-authentication.service';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		AuthenticationService,
		AuthenticationGuard,
		FirebaseAuthenticationService
	]
})
export class AuthenticationModule {

}
