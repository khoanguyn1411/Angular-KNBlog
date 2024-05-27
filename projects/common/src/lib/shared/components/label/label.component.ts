import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl, ValidationErrors } from '@angular/forms';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { listenControlTouched } from '@knb/core/utils/rxjs/listen-control-touched';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  distinct,
  map,
  merge,
  switchMap,
  tap,
} from 'rxjs';

/** Label component. */
@Component({
  selector: 'knc-label',
  standalone: true,
  templateUrl: './label.component.html',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./label.component.css'],
})
export class LabelComponent implements OnInit {
  public label = input.required<string>();
  public isRequired = input<boolean>(false);

  private readonly control$ = new BehaviorSubject<NgControl | null>(null);
  private readonly destroyRef = inject(DestroyRef);

  /** Errors. */
  protected readonly errors$ = new BehaviorSubject<ValidationErrors | null>(
    null
  );

  /** @inheritDoc */
  public ngOnInit(): void {
    this.initErrorStreamSideEffect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /** Catch inner input by form control directive. */
  @ContentChild(NgControl)
  public set control(i: NgControl) {
    if (i) {
      this.control$.next(i);
    }
  }

  private initErrorStreamSideEffect(): Observable<ValidationErrors | null> {
    return this.control$.pipe(
      distinct(),
      filterNull(),
      switchMap((input) =>
        merge(
          input.statusChanges ?? EMPTY,
          input.control ? listenControlTouched(input.control) : EMPTY
        ).pipe(map(() => input))
      ),
      tap((input) => this.errors$.next(input.errors))
    );
  }
}
