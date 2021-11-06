import { QuantifiedActivity } from '../../../common/ui/quantified-activity/quantified-activity';

export interface LocalActivity {
	day: number;
	name: string;
	quantifiedActivities: Array<QuantifiedActivity>;
	options?: {
		activityUUID?: string,
		assignedTemplateUUID?: string
	};
}
