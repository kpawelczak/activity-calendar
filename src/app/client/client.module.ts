import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';
import { HeaderModule } from './shell/header.module';
import { HomeModule } from './home/home.module';
import { ActivitiesModule } from '../services/repositories/activities/activities.module';
import { ActivitiesCountModule } from '../services/repositories/activities/count/activities-count.module';
import { TemplatesModule } from '../templates/templates.module';
import { FirebaseActivitiesCountModule } from '../services/firebase/activities/activities-count/firebase-activities-count.module';
import { FirebaseActivitiesModule } from '../services/firebase/activities/activities/firebase-activities.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		HomeModule,
		TemplatesModule,
		HeaderModule,
		ActivitiesModule,
		ActivitiesCountModule,
		FirebaseActivitiesModule,
		FirebaseActivitiesCountModule
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
