import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityCalendarLoadingScreenData } from './activity-calendar-loading-options';

@Component({
	selector: 'ac-loading-blanket',
	template: `
		<div>
			<h1>{{loadingScreenData?.text}}</h1>

			<mat-spinner color="primary"></mat-spinner>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarLoadingScreenComponent {

	constructor(@Inject(MAT_DIALOG_DATA) public readonly loadingScreenData: ActivityCalendarLoadingScreenData) {

	}
}
