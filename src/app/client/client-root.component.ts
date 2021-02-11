import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	template: `
		<act-calendar></act-calendar>

		<act-selected-day></act-selected-day>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientRootComponent {

}
