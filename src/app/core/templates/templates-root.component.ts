import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'templates-root',
	template: `
		<router-outlet></router-outlet>
	`,
	host: {
		'[class.ac-templates-root]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesRootComponent {

}
