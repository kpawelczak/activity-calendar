import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../../../common/cdk/reactive';
import { TemplateSetsRepository } from '../../store/sets/template-sets.repository';
import { ActiveTemplateSetService } from '../../store/sets/active-template-set.service';
import { combineLatest } from 'rxjs';

@Component({
	template: `
		<div class="ac-templates-title">
			<h2>
				<mat-icon [routerLink]="'../'">west</mat-icon>
				Templates settings
			</h2>
		</div>

		<div class="ac-templates-set-list">

			<div *ngFor="let set of templateSets">
				{{set}}
			</div>

		</div>
	`,
	host: {
		'[class.templates-settings]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesSettingsComponent extends Reactive implements OnInit {

	activeTemplateSet: string;

	templateSets: string[];

	constructor(private readonly templateSetsRepository: TemplateSetsRepository,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		combineLatest([
			this.templateSetsRepository.onValues(),
			this.activeTemplateSetService.onValues()
		])
			.pipe(
				this.takeUntil()
			)
			.subscribe(([templateSets, activeTemplateSet]) => {
				this.templateSets = templateSets;
				this.activeTemplateSet = activeTemplateSet;
				this.changeDetectorRef.detectChanges();
			});
	}
}
