/** The original Omit utility type can accept any key to omit even if it is not exist in the type. */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
