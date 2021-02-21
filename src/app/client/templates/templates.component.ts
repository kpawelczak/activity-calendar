import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Reactive } from '../../common/reactive';
import { WeekdayTemplatesRepository } from '../../services/repositories/templates/weekday-templates.repository';
import { WeekdayTemplate } from '../../services/repositories/templates/weekday-template';
import { take } from 'rxjs/operators';

@Component({
	selector: 'ac-templates',
	template: `
		<mat-accordion multi>

			<ac-weekday-template *ngFor="let weekdayTemplate of weekdayTemplates"
								 [weekday]="weekdayTemplate.weekday"></ac-weekday-template>

		</mat-accordion>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent extends Reactive implements OnInit {

	@ViewChild(MatAccordion)
	accordion: MatAccordion;

	weekdayTemplates: Array<WeekdayTemplate>;

	constructor(private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.weekdayTemplatesRepository
			.onTemplates()
			.pipe(
				take(1),
				this.takeUntil())
			.subscribe((weekdayTemplates: Array<WeekdayTemplate>) => {
				this.weekdayTemplates = weekdayTemplates;
				this.changeDetectorRef.detectChanges();
			});
	}
}
