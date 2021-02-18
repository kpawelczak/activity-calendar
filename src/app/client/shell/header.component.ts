import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FirebaseAuthenticationService } from '../../firebase/entry/firebase-authentication.service';
import { RouteNames } from '../../route-names';
import { Router } from '@angular/router';
import { acLinks } from './ac-links';
import { AcLink } from './ac-link';

@Component({
	selector: 'ac-header',
	template: `
		<div class="ac-header">
			<h2>{{activeLink.name}}</h2>

			<button mat-icon-button color="primary"
					[matMenuTriggerFor]="settingsMenu">

				<mat-icon aria-hidden="false"
						  aria-label="menu icon"
						  class="client-menu-icon">
					menu
				</mat-icon>

			</button>

		</div>

		<mat-menu #settingsMenu>

			<button *ngFor="let link of links"
					mat-menu-item
					[class.ac-route-active]="isLinkActive(link.route)"
					(click)="navigate(link)">
				<mat-icon>{{link.icon}}</mat-icon>
				{{link.name}}
			</button>

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

	links: Array<AcLink> = acLinks;

	activeLink: AcLink = this.getInitialLink();

	RouteNames = RouteNames;

	constructor(private readonly authService: FirebaseAuthenticationService,
				private readonly router: Router) {
	}

	logout() {
		this.authService.logout();
	}

	navigate(acLink: AcLink): void {
		this.activeLink = acLink;
		this.router.navigate([`${RouteNames.CLIENT}/${acLink.route}`]);
	}

	isLinkActive(routeName: RouteNames): boolean {
		return this.activeLink.route === routeName;
	}

	private getInitialLink(): AcLink {
		return this.links.filter((acLinK: AcLink) => acLinK.route === RouteNames.CALENDAR)[0];
	}
}
