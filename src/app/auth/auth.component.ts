import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from './store/auth.actions';
import { AlertComponent } from '../shared/alert/alert.component';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlaceholderDirective } from '../shared/alert/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  isLoginModeOn = true;
  isLoading = false;
  error: string = '';
  @ViewChild(
    PlaceholderDirective,
    { static: false }
  ) alertHost?: PlaceholderDirective;

  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showAlert(this.error);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSwithMode() {
    this.isLoginModeOn = !this.isLoginModeOn;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) { return; }

    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginModeOn) {
      this.store.dispatch(AuthAction.loginStart({ email: email, password: password }));
    } else {
      authObs = this.authService.signUp(email, password);
    }
    form.reset();
  }

  private showAlert(errorMessage: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost?.viewContainerRef;

    hostViewContainerRef?.clear();
    const componentRef = hostViewContainerRef?.createComponent(alertCmpFactory);
    componentRef!.instance.message = errorMessage;
    this.subscriptions.push(
      componentRef!.instance.close.subscribe(() => {
        hostViewContainerRef?.clear();
      })
    );

  }

}
