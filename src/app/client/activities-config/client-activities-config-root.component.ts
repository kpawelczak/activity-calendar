import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	template: `
		<ac-activities-config></ac-activities-config>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientActivitiesConfigRootComponent {

}
