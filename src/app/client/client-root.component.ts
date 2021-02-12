import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FirebaseAuthenticationService } from '../firebase/entry/firebase-authentication.service';

@Component({
	template: `
		<act-calendar></act-calendar>

		<act-selected-day></act-selected-day>

		<button mat-raised-button color="primary" (click)="logout()">logout</button>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientRootComponent {

	constructor(private readonly authService: FirebaseAuthenticationService) {
	}

	logout() {
		this.authService.logout()
	}
}
