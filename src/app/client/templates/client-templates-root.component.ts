import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	template: `
		<templates-root></templates-root>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientTemplatesRootComponent {

}
