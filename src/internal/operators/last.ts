/** @prettier */
import { Observable } from '../Observable';
import { EmptyError } from '../util/EmptyError';
import { OperatorFunction, TruthyTypesOf } from '../types';
import { filter } from './filter';
import { takeLast } from './takeLast';
import { throwIfEmpty } from './throwIfEmpty';
import { defaultIfEmpty } from './defaultIfEmpty';
import { identity } from '../util/identity';

export function last<T>(predicate: BooleanConstructor): OperatorFunction<T, TruthyTypesOf<T>>;
export function last<T, D>(predicate: BooleanConstructor, defaultValue: D): OperatorFunction<T, TruthyTypesOf<T> | D>;
export function last<T, D = T>(predicate?: null, defaultValue?: D): OperatorFunction<T, T | D>;
export function last<T, S extends T>(
  predicate: (value: T, index: number, source: Observable<T>) => value is S,
  defaultValue?: S
): OperatorFunction<T, S>;
export function last<T, D>(predicate: (value: T, index: number, source: Observable<T>) => false, defaultValue: D): OperatorFunction<T, D>;
export function last<T>(predicate: (value: T, index: number, source: Observable<T>) => false): OperatorFunction<T, never>;
export function last<T, D = T>(
  predicate: (value: T, index: number, source: Observable<T>) => boolean,
  defaultValue?: D
): OperatorFunction<T, T | D>;

/**
 * Returns an Observable that emits only the last item emitted by the source Observable.
 * It optionally takes a predicate function as a parameter, in which case, rather than emitting
 * the last item from the source Observable, the resulting Observable will emit the last item
 * from the source Observable that satisfies the predicate.
 *
 * ![](last.png)
 *
 * It will throw an error if the source completes without notification or one that matches the predicate. It
 * returns the last value or if a predicate is provided last value that matches the predicate. It returns the
 * given default value if no notification is emitted or matches the predicate.
 *
 * ## Example
 * Last alphabet from the sequence.
 * ```ts
 * import { from } from 'rxjs';
 * import { last } from 'rxjs/operators';
 *
 * const source = from(['x', 'y', 'z']);
 * const example = source.pipe(last());
 * //output: "Last alphabet: z"
 * example.subscribe(val => console.log(`Last alphabet: ${val}`));
 * ```
 *
 * Default value when the value in the predicate is not matched.
 * ```ts
 * import { from } from 'rxjs';
 * import { last } from 'rxjs/operators';
 *
 * const source = from(['x', 'y', 'z']);
 * const example = source.pipe(last(char => char === 'a','not exist'));
 * //output: "'a' is not exist."
 * example.subscribe(val => console.log(`'a' is ${val}.`));
 * ```
 *
 * @see {@link skip}
 * @see {@link skipUntil}
 * @see {@link skipLast}
 * @see {@link skipWhile}
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {function} [predicate] - The condition any source emitted item has to satisfy.
 * @param {any} [defaultValue] - An optional default value to provide if last
 * predicate isn't met or no values were emitted.
 * @return {Observable} An Observable that emits only the last item satisfying the given condition
 * from the source, or an NoSuchElementException if no such items are emitted.
 * @throws - Throws if no items that match the predicate are emitted by the source Observable.
 */
export function last<T, D>(
  predicate?: ((value: T, index: number, source: Observable<T>) => boolean) | null,
  defaultValue?: D
): OperatorFunction<T, T | D> {
  const hasDefaultValue = arguments.length >= 2;
  return (source: Observable<T>) =>
    source.pipe(
      predicate ? filter((v, i) => predicate(v, i, source)) : identity,
      takeLast(1),
      hasDefaultValue ? defaultIfEmpty<T, D>(defaultValue) : throwIfEmpty(() => new EmptyError())
    );
}
