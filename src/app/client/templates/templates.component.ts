import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { FirebaseTemplatesService } from '../../firebase/templates/firebase-templates.service';
import { Reactive } from '../../common/reactive';
import { WeekdayTemplatesRepository } from '../../repositories/templates/weekday-templates.repository';
import { WeekdayTemplate } from '../../repositories/templates/weekday-template';
import { take } from 'rxjs/operators';

@Component({
	selector: 'ac-templates',
	template: `
		<mat-accordion multi>

			<mat-expansion-panel *ngFor="let weekdayTemplate of weekdayTemplates">

				<mat-expansion-panel-header (click)="getTemplates(weekdayTemplate.weekday)">
					<mat-panel-title>
						{{weekdayTemplate.weekday}}
					</mat-panel-title>
				</mat-expansion-panel-header>

				<ac-weekday-template [weekday]="weekdayTemplate.weekday"></ac-weekday-template>

			</mat-expansion-panel>

		</mat-accordion>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent extends Reactive implements OnInit {

	@ViewChild(MatAccordion)
	accordion: MatAccordion;

	weekdayTemplates: Array<WeekdayTemplate>;

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
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

	getTemplates(weekday: string): void {
		this.firebaseTemplatesService.getTemplate(weekday);
	}
}
