import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Reactive } from '../../common/cdk/reactive';
import { TemplatesRepository } from '../../templates/store/templates/templates.repository';

@Component({
	template: `
		<templates-root></templates-root>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientTemplatesRootComponent extends Reactive implements OnInit {

	constructor(private readonly weekdayTemplatesRepository: TemplatesRepository,
				private readonly authenticationService: AuthenticationService) {
		super();
	}

	ngOnInit() {
		this.authenticationService
			.onLoggedIn()
			.pipe(
				filter((loggedIn: boolean) => !loggedIn),
				this.takeUntil()
			)
			.subscribe(() => {
				this.weekdayTemplatesRepository.reset();
			});
	}
}
