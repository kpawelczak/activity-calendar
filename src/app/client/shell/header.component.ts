import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FirebaseAuthenticationService } from '../../firebase/entry/firebase-authentication.service';

@Component({
	selector: 'ac-header',
	template: `
		<button mat-icon-button color="primary"
				[matMenuTriggerFor]="settingsMenu">

			<mat-icon aria-hidden="false"
					  aria-label="menu icon"
					  class="client-menu-icon">
				menu
			</mat-icon>

		</button>

		<mat-menu #settingsMenu>

			<button mat-menu-item (click)="logout()">
				<mat-icon>power_settings_new</mat-icon>
				<span>Logout</span>
			</button>

		</mat-menu>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

	constructor(private readonly authService: FirebaseAuthenticationService) {
	}

	logout() {
		this.authService.logout();
	}
}
