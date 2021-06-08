import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../../common/cdk/reactive';
import { AuthenticationService } from '../../authentication/authentication.service';
import { take } from 'rxjs/operators';

@Component({
	template: `
		<router-outlet></router-outlet>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryRootComponent extends Reactive implements OnInit {

	constructor(private readonly authenticationService: AuthenticationService) {
		super();
	}

	ngOnInit() {
		this.authenticationService
			.onLoggedIn()
			.pipe(
				take(1),
				this.takeUntil())
			.subscribe((loggedIn: boolean) => {
				if (loggedIn) {
					this.authenticationService.logout();
				}
			});
	}
}
