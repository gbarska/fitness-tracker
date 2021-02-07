import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import * as fromRoot from '../../app.reducer';
import { UIService } from 'src/app/shared/ui.service';
import * as UI from '../../shared/ui.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxDate;
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.isLoading$ = of(true);
    
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    //FIREBASE
    // this.authService.registerUser({
    //   email: form.value.email,
    //   password: form.value.password
    // });
    this.store.dispatch(new UI.StartLoading());

    setTimeout(() => { 
    
      for(var name in form.controls) {
        (<FormControl>form.controls[name]).setValue('');
        form.controls[name].setErrors(null);
        
        this.uiService.showSnackbar('Successfuly registered!', null, 3000);
        this.store.dispatch(new UI.StopLoading());
      }

    }, 2000);
  }
}
