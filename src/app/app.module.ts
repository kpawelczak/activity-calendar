import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './services/firebase/authentication/authentication.module';
import { FirebaseEntryModule } from './services/firebase/entry/firebase-entry.module';
import { ProfileModule } from './services/profile/profile.module';


@NgModule({
	imports: [
		BrowserModule,
		AppRoutes,
		HammerModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AuthenticationModule,
		ProfileModule,
		FirebaseEntryModule,
		BrowserAnimationsModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {

}
