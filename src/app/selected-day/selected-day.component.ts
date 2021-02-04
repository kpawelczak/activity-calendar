import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../common/reactive';
import { skip } from 'rxjs/operators';

@Component({
	selector: 'act-selected-day',
	template: `
		<ng-container *ngIf="selectedDay">
			Selected Date: {{selectedDay | date:'EEEE, MMMM d, y'}}
		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.selectedDayService
			.observeSelectedDate()
			.pipe(
				skip(1),
				this.takeUntil())
			.subscribe((selectedDate: Date) => {
				this.selectedDay = selectedDate;
				this.changeDetectorRef.detectChanges();
			});
	}
}
