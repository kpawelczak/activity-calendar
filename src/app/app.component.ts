import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from './common/reactive';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { AuthenticationService } from './firebase/authentication/authentication.service';
import { FirebaseProfileService } from './firebase/profile/firebase-profile.service';
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
				private readonly profileService: FirebaseProfileService) {
		super();
	}

	ngOnInit() {
		this.fireAuth
			.authState
			.pipe(this.takeUntil())
			.subscribe((user: User | null) => {

				switch (true) {

					case user?.isAnonymous: {
						this.setProfileAndLoginStatus('public');
						break;
					}

					case !!user && !user.isAnonymous: {
						this.setProfileAndLoginStatus(user.email);
						break;
					}

					case !user: {
						this.setProfileAndLoginStatus('');
					}
				}
			});
	}

	private setProfileAndLoginStatus(profile: string): void {
		this.profileService.next(profile);
		this.authService.next(!!profile);
	}
}
