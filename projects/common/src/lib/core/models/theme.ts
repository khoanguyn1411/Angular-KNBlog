import { enumToArray } from '../utils/enum-to-array';

export enum ThemeValue {
  blue = 'blue-theme',
  purple = 'purple-theme',
  orange = 'orange-theme',
  green = 'green-theme',
}

const THEME_VALUE_TO_READABLE: Readonly<Record<ThemeValue, string>> = {
  [ThemeValue.blue]: 'Blue',
  [ThemeValue.purple]: 'Purple',
  [ThemeValue.orange]: 'Orange',
  [ThemeValue.green]: 'Green',
};

export namespace ThemeValue {
  /** To theme value array. */
  export function toArray(): readonly ThemeValue[] {
    return enumToArray(ThemeValue);
  }

  /**
   * To readable theme.
   * @param theme Theme.
   */
  export function toReadable(theme: ThemeValue): string {
    return THEME_VALUE_TO_READABLE[theme];
  }
}
