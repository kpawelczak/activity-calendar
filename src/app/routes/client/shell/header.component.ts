import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouteName } from '../../../route-name';
import { Router } from '@angular/router';
import { activityCalendarLinks } from './activity-calendar-links';
import { ActivityCalendarLink } from './activity-calendar-link';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthenticationService } from '../../../authentication/authentication.service';

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

	@ViewChild(MatMenuTrigger)
	trigger: MatMenuTrigger;

	links: Array<ActivityCalendarLink> = activityCalendarLinks;

	activeLink: ActivityCalendarLink = this.getInitialLink();

	RouteNames = RouteName;

	constructor(private readonly authenticationService: AuthenticationService,
				private readonly router: Router) {
	}

	logout(): void {
		this.authenticationService.logout();
	}

	navigate(acLink: ActivityCalendarLink): void {
		this.activeLink = acLink;
		this.router
			.navigate([`${RouteName.CLIENT}/${acLink.route}`])
			.then(() => {
				this.trigger.closeMenu();
			});
	}

	isLinkActive(routeName: RouteName): boolean {
		return this.activeLink.route === routeName;
	}

	private getInitialLink(): ActivityCalendarLink {
		const routeName = this.router.url.includes(RouteName.TEMPLATES) ? RouteName.TEMPLATES : RouteName.CALENDAR;
		return this.links.filter((acLinK: ActivityCalendarLink) => acLinK.route === routeName)[0];
	}
}
