import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from './common/reactive';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { AuthenticationService } from './services/firebase/authentication/authentication.service';
import { ProfileService } from './services/profile/profile.service';
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
				private readonly profileService: ProfileService) {
		super();
	}

	ngOnInit() {
		this.fireAuth
			.authState
			.pipe(this.takeUntil())
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
	}
}
