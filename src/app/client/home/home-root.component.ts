import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'ac-home',
	template: `
		<ac-calendar></ac-calendar>

		<ac-selected-day></ac-selected-day>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeRootComponent {

}
