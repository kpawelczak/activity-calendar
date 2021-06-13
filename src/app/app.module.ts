import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './authentication/authentication.module';
import { ProfileModule } from './profile/profile.module';
import { ActivityCalendarSnackbarModule } from './common/ui/activity-calendar-snackbar/activity-calendar-snackbar.module';
import { ActivityCalendarLoadingScreenModule } from './common/ui/activity-calendar-loading-screen/activity-calendar-loading-screen.module';
import { ConnectionsStatusModule } from './connection/connections-status.module';


@NgModule({
	imports: [
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
		AppRoutes,
		HammerModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AuthenticationModule.forRoot(),
		ProfileModule,
		ConnectionsStatusModule,
		ActivityCalendarSnackbarModule,
		ActivityCalendarLoadingScreenModule,
		BrowserAnimationsModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {

}
