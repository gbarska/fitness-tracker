import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];
  private mockedExercises: Exercise[];
  finishedExercises: Exercise[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>,
    private _snackBar: MatSnackBar

  ) {
    this.mockedExercises = [
      { id: 'crunches', name: 'Crunches', duration: 5, calories: 8, muscle: 'abdomen', imageURL: 'crunches.jpg' },
      { id: 'touch-toes', name: 'Touch Toes', duration: 20, calories: 15, muscle: 'abdomen', imageURL: 'touch-toes.jpg' },
      { id: 'side-lunges', name: 'Side Lunges', duration: 80, calories: 18, muscle: 'leg', imageURL: 'side-lunges.jpg'  },
      { id: 'lunges', name: 'Lunges', duration: 100, calories: 20, muscle: 'leg', imageURL: 'lunges.jpg'  },
      { id: 'squats', name: 'Squats', duration: 150, calories: 22, muscle: 'leg',imageURL: 'squats.png'  },
      { id: 'wide-push-up', name: 'Wide Push Up', duration: 10, calories: 15, muscle: 'chest', imageURL: 'push-up.jpg'  },
      { id: 'onearm-push-up', name: 'One-Arm Push Up', duration: 160, calories: 20, muscle: 'chest', imageURL: 'onearm-push-up.jpg'  },
      { id: 'burpees', name: 'Burpees', duration: 60, calories: 8, muscle: 'whole', imageURL: 'burpees.jpg' }
    ];

    this.store.dispatch(new UI.StopLoading());
    this.store.dispatch(new Training.SetAvailableTrainings(this.mockedExercises));
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());

    //FIREBASE
    // this.fbSubs.push(
    //   this.db
    //     .collection('availableExercises')
    //     .snapshotChanges()
    //     .pipe(map(docArray => {
    //       // throw(new Error());
    //       return docArray.map(doc => {
    //         return {
    //           id: doc.payload.doc.id,
    //           name: doc.payload.doc.data().name,
    //           duration: doc.payload.doc.data().duration,
    //           calories: doc.payload.doc.data().calories
    //         };
    //       });
    //     }))
    //     .subscribe(
    //       (exercises: Exercise[]) => {
    //         this.store.dispatch(new UI.StopLoading());
    //         this.store.dispatch(new Training.SetAvailableTrainings(exercises));
    //       },
    //       error => {
    //         this.store.dispatch(new UI.StopLoading());
    //         this.uiService.showSnackbar(
    //           'Fetching Exercises failed, please try again later',
    //           null,
    //           3000
    //         );
    //       }
    //     )
    // );

    // mocked
    this.store.dispatch(new Training.SetAvailableTrainings(this.mockedExercises));
    this.store.dispatch(new UI.StopLoading());

  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this._snackBar.open('Congratulations', ex.name + ' completed !', {
        duration: 2000,
      });
      this.store.dispatch(new Training.StopTraining());
    });

  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
    //FIREBASE
    // this.fbSubs.push(
    //   this.db
    //     .collection('finishedExercises')
    //     .valueChanges()
    //     .subscribe((exercises: Exercise[]) => {
    //       this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    //     })
    // );

    // mocking begin
    this.store.dispatch(new Training.SetFinishedTrainings([...this.finishedExercises]));
    // mocking end

  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.finishedExercises = Object.assign([], this.finishedExercises);
    this.finishedExercises.push(exercise);
  }
}
