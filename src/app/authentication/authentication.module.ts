import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from './authentication.service';
import { ClientRootGuard } from './client-root.guard';
import { FirebaseAuthenticationService } from './infrastructure/firebase-authentication.service';

const rootGuards = [
	ClientRootGuard
];


@NgModule({
	imports: [
		CommonModule
	]
})
export class AuthenticationModule {

	static forRoot(): ModuleWithProviders<AuthenticationModule> {
		return {
			ngModule: AuthenticationModule,
			providers: [
				AuthenticationService,
				FirebaseAuthenticationService,
				...rootGuards
			]
		};
	}

	static forFeature(): ModuleWithProviders<AuthenticationModule> {
		return {
			ngModule: AuthenticationModule,
			providers: []
		};
	}
}
