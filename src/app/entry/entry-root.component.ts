import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	template: `
		<router-outlet></router-outlet>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryRootComponent {

}
