import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Direction } from './direction';


@Component({
	selector: 'gui-arrow-icon',
	template: `
		<svg [style.transform]="'rotate(' + direction + 'deg)'"
			 xmlns="http://www.w3.org/2000/svg" width="6.081" height="10.661" viewBox="0 0 6.081 10.661">
			<path d="M.75.75,5.02,5.02.75,9.29"
				  transform="translate(0.311 0.311)"
				  fill="none"
				  stroke-linecap="round"
				  stroke-linejoin="round"
				  stroke-width="1.5"/>
		</svg>
	`,
	styleUrls: ['./fabric-arrow-icon.ngx.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.gui-arrow-icon]': 'true',
		'[class.gui-icon]': 'true'
	}
})
export class FabricArrowIconComponent {

	@Input()
	direction: Direction = Direction.RIGHT;

}
