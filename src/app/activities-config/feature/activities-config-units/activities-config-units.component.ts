import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UnitsRepository } from '../../store/units/units.repository';
import { Reactive } from '../../../common/cdk/reactive';

@Component({
	selector: 'ac-config-units',
	templateUrl: './activities-config-units.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesConfigUnitsComponent extends Reactive implements OnInit {

	constructor(private readonly unitsRepository: UnitsRepository) {
		super();
	}

	ngOnInit(): void {
		this.unitsRepository.onValues().subscribe(console.log);
	}

}
