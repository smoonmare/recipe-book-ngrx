import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertComponent } from '../shared/alert/alert.component';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subject, Subscription } from 'rxjs';
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
  @ViewChild(
    PlaceholderDirective,
    {static: false}
  ) alertHost?: PlaceholderDirective;
  // error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
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
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage) => {
        console.log(errorMessage);
        // this.error = errorMessage;
        this.showAlert(errorMessage);
        this.isLoading = false;
      }
    });
    form.reset();
  }

  // onHandleAlert() {
  //   this.error = '';
  // }

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
