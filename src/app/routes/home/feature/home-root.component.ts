import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'home-root',
	template: `
		<div style="color: white">
			<p>Activity calendar</p>
			<p>SHORT DESCRIPTION</p>
			<p>get started</p>
			<p>news</p>
			<p>help</p>
			<p>trainings</p>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeRootComponent {

}
