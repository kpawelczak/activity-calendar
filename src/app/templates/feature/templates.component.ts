import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Reactive } from '../../common/cdk/reactive';
import { TemplatesRepository } from '../store/templates/templates.repository';
import { WeekdayTemplate } from '../store/weekday-template';


@Component({
	selector: 'ac-templates',
	template: `
		<div class="ac-templates-title">
			<h2>Active templates</h2>
		</div>

		<template-settings></template-settings>

		<mat-accordion multi>

			<ac-weekday-template *ngFor="let weekdayTemplate of weekdayTemplates"
								 [weekdayTemplate]="weekdayTemplate"></ac-weekday-template>

		</mat-accordion>

	`,
	host: {
		'[class.ac-templates]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent extends Reactive implements OnInit {

	@ViewChild(MatAccordion)
	accordion: MatAccordion;

	weekdayTemplates: Array<WeekdayTemplate>;

	constructor(private readonly templatesRepository: TemplatesRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.templatesRepository
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((weekdayTemplates: Array<WeekdayTemplate>) => {
				this.weekdayTemplates = weekdayTemplates;
				this.changeDetectorRef.detectChanges();
			});
	}
}
