import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from './common/cdk/reactive';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { AuthenticationService } from './authentication/authentication.service';
import { ProfileService } from './profile/profile.service';
import { ActivityCalendarLoadingScreenService } from './common/ui/activity-calendar-loading-screen/activity-calendar-loading-screen.service';
import { ConnectionStatusService } from './connection/connection-status.service';
import { filter, switchMap } from 'rxjs/operators';
import User = firebase.User;

@Component({
	selector: 'app-root',
	template: `
		<div class="container">
			<router-outlet></router-outlet>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends Reactive implements OnInit {

	constructor(private readonly fireAuth: AngularFireAuth,
				private readonly authService: AuthenticationService,
				private readonly loadingScreenService: ActivityCalendarLoadingScreenService,
				private readonly connectionStatusService: ConnectionStatusService,
				private readonly profileService: ProfileService) {
		super();
	}

	ngOnInit() {
		this.connectionStatusService
			.onConnectedStatus()
			.pipe(
				filter((connected: boolean) => connected),
				switchMap(() => {
					this.loadingScreenService.setLoading(true, 'Checking authentication, please wait');

					return this.fireAuth.authState;
				}),
				this.takeUntil()
			)
			.subscribe((user: User | null) => {
				this.manageAuthenticationStatus(user);
			});
	}

	private manageAuthenticationStatus(user: User | null): void {
		const anonymousIsLoggedIn = user?.isAnonymous,
			userIsLoggedIn = !!user && !user.isAnonymous,
			loggedOut = !user;

		switch (true) {

			case anonymousIsLoggedIn: {
				this.setProfileAndLoginStatus('public');
				break;
			}

			case userIsLoggedIn: {
				this.setProfileAndLoginStatus(user.email);
				break;
			}

			case loggedOut: {
				this.setProfileAndLoginStatus('');
			}
		}
	}

	private setProfileAndLoginStatus(profile: string): void {
		const isLoggedIn = !!profile;

		this.profileService.next(profile);
		this.authService.next(isLoggedIn);

		this.loadingScreenService.setLoading(false);
	}
}
