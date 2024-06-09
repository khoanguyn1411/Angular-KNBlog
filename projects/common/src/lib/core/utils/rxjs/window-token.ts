import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { assertNonNull } from './assert-non-null';

/**
 * Injection token to use instead of global window object.
 */
export const WINDOW_TOKEN = new InjectionToken<Window | null>('An abstraction over global window object', {
  factory() {
    const { defaultView } = inject(DOCUMENT);
    assertNonNull(defaultView);
    return defaultView;
  },
});
