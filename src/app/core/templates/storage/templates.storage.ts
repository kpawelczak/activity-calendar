import { Injectable } from '@angular/core';
import { StorageArchive } from '../../../common/cdk/storage-archive';
import { LocalTemplates, LocalTemplatesBySetName, LocalWeekdayTemplate } from './local-templates';
import { TemplatesConverter } from './templates.converter';
import { WeekdayTemplate } from '../store/weekday-template';

@Injectable()
export class TemplatesStorage extends StorageArchive<LocalTemplates> {

	private static readonly LOCAL = 'LOCAL';

	private static readonly USER = 'USER';

	getStorageKey(): string {
		return 'ac-templates';
	}

	constructor(private readonly templatesConverter: TemplatesConverter) {
		super();
	}

	getStoredChangesId(): string {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(true))?.changesId
			? this.getStoredValue(this.getActivitiesExtendedKey(true)).changesId
			: '-1';
	}

	getStoredTemplates(templateSetName: string, loggedIn: boolean): Array<WeekdayTemplate> | null {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.templatesBySetName
			? this.getTemplateBySetName(
				templateSetName,
				this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.templatesBySetName
			)
			: null;
	}

	storeTemplates(templateSetName: string, templates: Array<WeekdayTemplate>, loggedIn: boolean): void {
		const key = this.getActivitiesExtendedKey(loggedIn);

		let templatesBySetName = this.getStoredValue(key)?.templatesBySetName ? this.getStoredValue(key)?.templatesBySetName : [];

		const templateBySetName = templatesBySetName.find((_templateBySetName) => _templateBySetName.templateSetName === templateSetName);

		if (templateBySetName) {
			templatesBySetName = templatesBySetName.map((_templateBySetName: LocalTemplatesBySetName) => {
				return _templateBySetName.templateSetName === templateSetName
					? { templateSetName, templates } as any
					: _templateBySetName;
			});
		} else {
			templatesBySetName.push({ templateSetName, templates } as any);
		}

		const newStoredValues: LocalTemplates = {
			...this.getStoredValue(key),
			templatesBySetName: templatesBySetName
		};
		this.store(newStoredValues, key);
	}

	updateChangesId(changesId: string): void {
		const key = this.getActivitiesExtendedKey(true),
			newStoredValues = { ...this.getStoredValue(key), changesId };
		this.store(newStoredValues, key);
	}

	private getActivitiesExtendedKey(loggedIn: boolean): string {
		return loggedIn ? TemplatesStorage.USER : TemplatesStorage.LOCAL;
	}

	private transformTemplates(localActivityConfigs: Array<LocalWeekdayTemplate>): Array<WeekdayTemplate> {
		return this.templatesConverter.convertTemplates(localActivityConfigs);
	}

	private getTemplateBySetName(templateSetName: string,
								 localTemplatesBySetName: Array<LocalTemplatesBySetName>): Array<WeekdayTemplate> {
		const templatesBySetName
			= localTemplatesBySetName
			.find((templateBySetName: LocalTemplatesBySetName) => {
				return templateBySetName.templateSetName === templateSetName;
			});

		return templatesBySetName
			? this.transformTemplates(templatesBySetName.templates)
			: null;
	}
}
