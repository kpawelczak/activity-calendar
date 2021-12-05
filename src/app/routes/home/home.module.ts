import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRootComponent } from './feature/home-root.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeNewsComponent } from './feature/home-news.component';


@NgModule({
	imports: [
		CommonModule,
		HomeRoutingModule
	],
	declarations: [
		HomeRootComponent,
		HomeNewsComponent
	],
	exports: []
})
export class HomeModule {

}
