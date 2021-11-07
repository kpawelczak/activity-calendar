import { Injectable } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { WeekdayTemplate } from '../weekday-template';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { TemplatesRepository } from './templates.repository';
import { ActiveTemplateSetService } from '../sets/active-template-set.service';
import { combineLatest, Observable, of } from 'rxjs';
import { TemplatesStorage } from '../../storage/templates.storage';
import { DomainChangesService } from '../../../domain/changes/store/domain-changes.service';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { DomainChangesType } from '../../../domain/changes/domain-changes.type';
import { LocalTemplateChangesType } from '../../storage/local-template-changes-type';

@Injectable()
export class TemplatesService {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly templatesStorage: TemplatesStorage,
				private readonly domainChangesService: DomainChangesService,
				private readonly authService: AuthenticationService,
				private readonly templatesRepository: TemplatesRepository) {
	}

	loadTemplates(templateSetName: string): void {
		this.templatesRepository
			.onLoadTemplates(templateSetName)
			.pipe(take(1))
			.subscribe((weekdayTemplates: Array<WeekdayTemplate>) => {
				this.templatesRepository.next([...weekdayTemplates]);
			});
	}

	onNewTemplate(weekdayTemplate: WeekdayTemplate): Observable<void> {
		const newTemplates = this.replaceWeekdayTemplate(weekdayTemplate);

		this.templatesRepository.next(newTemplates);

		return combineLatest([
			this.authService.onLoggedIn(),
			this.activeTemplateSetService.onValues()
		])
			.pipe(
				switchMap(([loggedIn, templateSetName]: [boolean, string]) => {
					this.templatesStorage.storeTemplates(templateSetName, newTemplates, loggedIn);
					return loggedIn
						? this.domainChangesService.registerNewChange(DomainChangesType.TEMPLATES)
						: of(null);
				}),
				map((changesId: string) => {
					this.templatesStorage.updateChangesId(changesId, LocalTemplateChangesType.TEMPLATES);
					return;
				}),
				take(1)
			);
	}

	private replaceWeekdayTemplate(newTemplate: WeekdayTemplate): Array<WeekdayTemplate> {
		return this.templatesRepository.getValues()
				   .map((weekdayTemplate: WeekdayTemplate) => {
					   return newTemplate.getWeekday() === weekdayTemplate.getWeekday() ? newTemplate : weekdayTemplate;
				   });
	}
}
