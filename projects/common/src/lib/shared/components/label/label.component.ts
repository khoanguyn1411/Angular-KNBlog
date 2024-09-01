import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, DestroyRef, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl, ValidationErrors } from '@angular/forms';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { listenControlTouched } from '@knb/core/utils/rxjs/listen-control-touched';
import { BehaviorSubject, EMPTY, Observable, combineLatest, distinct, map, of, startWith, switchMap, tap } from 'rxjs';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';

/** Label component. */
@Component({
  selector: 'knc-label',
  standalone: true,
  templateUrl: './label.component.html',
  imports: [AsyncPipe, NgIf, NgTemplateOutlet, ValidationMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent implements OnInit {
  public label = input<string>('');
  public isRequired = input<boolean>(false);
  public hasLabel = input<boolean>(true);
  public isErrorShown = input<boolean>(false);

  private readonly control$ = new BehaviorSubject<NgControl | null>(null);
  private readonly destroyRef = inject(DestroyRef);

  /** Errors. */
  protected readonly errors$ = new BehaviorSubject<ValidationErrors | null>(null);

  /** @inheritDoc */
  public ngOnInit(): void {
    this.initErrorStreamSideEffect().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
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
        combineLatest([
          (input.statusChanges ?? EMPTY).pipe(startWith(null)),
          input.control ? listenControlTouched(input.control) : of(null),
        ]).pipe(map(([, isControlTouched]) => ({ input, isControlTouched }))),
      ),
      tap(({ input, isControlTouched }) => {
        if (isControlTouched) {
          this.errors$.next(input.errors);
          return;
        }
        this.errors$.next(null);
      }),
    );
  }
}
