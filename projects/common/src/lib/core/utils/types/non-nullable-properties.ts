/** Transform object with nullable properties to non nullable. */
export type NonNullableProperties<
	T extends Record<string, unknown>,
	K extends keyof T,
> = Readonly<
{
	[k in K]-?: NonNullable<T[k]>;
} & {
	[k in Exclude<keyof T, K>]: T[k];
}
>;
