import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoadingComponent } from './loading-spinner/loading/loading.component';
import { DropdownDirective } from './dropdown.directive';
import { PlaceholderDirective } from './alert/placeholder.directive';
// import { LoggingService } from '../logging.service';



@NgModule({
  declarations: [
    DropdownDirective,
    LoadingComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    DropdownDirective,
    LoadingComponent,
    AlertComponent,
    PlaceholderDirective
  ]
  // Provides the new instance of the service 
  // each time the new lazy loaded module is laoded
  // providers: [LoggingService]
})
export class SharedModule { }
