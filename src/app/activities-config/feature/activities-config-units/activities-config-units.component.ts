import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UnitsRepository } from '../../store/units/units.repository';
import { Reactive } from '../../../common/cdk/reactive';
import { UnitsService } from '../../store/units/units.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesConfigUnitDialogComponent } from './activities-config-unit-dialog.component';

@Component({
	selector: 'ac-config-units',
	templateUrl: './activities-config-units.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesConfigUnitsComponent extends Reactive implements OnInit {

	units: Array<string>;

	constructor(private readonly unitsRepository: UnitsRepository,
				private readonly unitsService: UnitsService,
				private readonly matDialog: MatDialog,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit(): void {
		this.unitsRepository
			.onValues()
			.subscribe((units: Array<string>) => {
				this.units = units;
				this.changeDetectorRef.detectChanges();
			});
	}

	deleteUnit(unit: string): void {
		this.unitsService.deleteUnit(unit);
	}

	openUnitDialog(): void {
		this.matDialog
			.open(ActivitiesConfigUnitDialogComponent, {
				panelClass: 'activity-calendar-dialog'
			});
	}
}
