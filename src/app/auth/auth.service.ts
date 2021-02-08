import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    //FIREBASE
    // this.afAuth.authState.subscribe(user => {

     const isAuth = localStorage.getItem('isAuth');

     if (isAuth == 'true') {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/']);
      }
    // });
  }

  registerUser(authData: AuthData) {

    //FIREBASE
    // this.afAuth.auth
    //   .createUserWithEmailAndPassword(authData.email, authData.password)
    //   .then(result => {
    //       this.store.dispatch(new UI.StopLoading());
    //   })
    //   .catch(error => {
    //     this.store.dispatch(new UI.StopLoading());
    //     this.uiService.showSnackbar(error.message, null, 3000);
    //   });

    //mockado
    this.store.dispatch(new UI.StartLoading());
    setTimeout(() => { this.store.dispatch(new UI.StopLoading()); }, 2000);
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    //FIREBASE
    // this.afAuth.auth
    //   .signInWithEmailAndPassword(authData.email, authData.password)
    //   .then(result => {
    //     this.store.dispatch(new UI.StopLoading());
    //   })
    //   .catch(error => {
    //     this.store.dispatch(new UI.StopLoading());
    //     this.uiService.showSnackbar(error.message, null, 3000);
    //   });

    //mockado
    this.store.dispatch(new Auth.SetAuthenticated());
    this.router.navigate(['/training']);
    localStorage.setItem('isAuth', 'true');
    this.store.dispatch(new UI.StopLoading()); 
  }

  logout() {
    //mockado
    localStorage.setItem('isAuth', 'false');
    this.trainingService.cancelSubscriptions();
    this.store.dispatch(new Auth.SetUnauthenticated());
    this.router.navigate(['/login']);

    //FIREBASE
    //this.afAuth.auth.signOut();
  }
}
