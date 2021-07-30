import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DefinedActivitiesRepository } from '../../store/defined-activities/defined-activities.repository';
import { Reactive } from '../../../common/cdk/reactive';
import { ActivityConfig } from '../../store/activity-config';
import { ActivityEntry } from '../../store/activity-entry';
import { DefinedActivityService } from '../../store/defined-activities/defined-activity.service';

@Component({
	selector: 'ac-defined-activities-list',
	templateUrl: './defined-activities-list.component.html',
	host: {
		'[class.ac-templates-set-list]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinedActivitiesListComponent extends Reactive implements OnInit {

	@Output()
	onDefinedActivitySelection = new EventEmitter();

	definedActivities: Array<ActivityConfig>;

	constructor(private readonly definedActivitiesRepository: DefinedActivitiesRepository,
				private readonly definedActivityService: DefinedActivityService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.definedActivitiesRepository
			.onValues()
			.pipe(
				this.takeUntil()
			)
			.subscribe((definedActivities: Array<ActivityConfig>) => {
				this.definedActivities = definedActivities;
				this.changeDetectorRef.detectChanges();
			});
	}

	openDefinedActivityDialog(activityConfig: ActivityConfig): void {
		this.onDefinedActivitySelection.emit(activityConfig);
	}

	deleteDefinedActivity(activityConfig: ActivityConfig): void {
		event.preventDefault();
		event.stopPropagation();
		this.definedActivityService.deleteActivityConfig(activityConfig).subscribe();
	}

	getEntryUnits(getEntryUnits: ActivityConfig): string {
		return getEntryUnits.entries.map((activityEntry: ActivityEntry) => activityEntry.entryUnit).join(', ');
	}
}
