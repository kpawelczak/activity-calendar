import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionStatusService } from './connection-status.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		ConnectionStatusService
	]
})
export class ConnectionsStatusModule {

}
