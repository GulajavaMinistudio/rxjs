import { expect } from 'chai';
import { hot, cold, expectObservable, expectSubscriptions } from '../helpers/marble-testing';
import { of, Observable } from 'rxjs';
import { defaultIfEmpty, mergeMap, take } from 'rxjs/operators';

/** @test {defaultIfEmpty} */
describe('Observable.prototype.defaultIfEmpty', () => {
  it('should return the Observable if not empty with a default value', () => {
    const e1 =   hot('--------|');
    const expected = '--------(x|)';

    // TODO: Fix `defaultIfEmpty` typings
    expectObservable(e1.pipe(defaultIfEmpty(42) as any)).toBe(expected, { x: 42 });
  });

  it('should return the argument if Observable is empty', () => {
    const e1 =  cold('|');
    const e1subs =   '(^!)';
    const expected = '(x|)';

    expectObservable(e1.pipe(defaultIfEmpty('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should return null if the Observable is empty and no arguments', () => {
    const e1 =  cold('|');
    const e1subs =   '(^!)';
    const expected = '(x|)';

    expectObservable(e1.pipe(defaultIfEmpty())).toBe(expected, { x: null });
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should return the Observable if not empty with a default value', () => {
    const e1 =   hot('--a--b--|');
    const e1subs =   '^       !';
    const expected = '--a--b--|';

    expectObservable(e1.pipe(defaultIfEmpty('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should return the Observable if not empty with no default value', () => {
    const e1 =   hot('--a--b--|');
    const e1subs =   '^       !';
    const expected = '--a--b--|';

    expectObservable(e1.pipe(defaultIfEmpty())).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should allow unsubscribing early and explicitly', () => {
    const e1 =   hot('--a--b--|');
    const e1subs =   '^   !    ';
    const expected = '--a--    ';
    const unsub =    '    !    ';

    const result = e1.pipe(defaultIfEmpty('x'));

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not break unsubscription chains when unsubscribed explicitly', () => {
    const e1 =   hot('--a--b--|');
    const e1subs =   '^   !    ';
    const expected = '--a--    ';
    const unsub =    '    !    ';

    const result = e1.pipe(
      mergeMap(x => of(x)),
      defaultIfEmpty('x'),
      mergeMap(x => of(x)),
    );

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should error if the Observable errors', () => {
    const e1 =  cold('#');
    const e1subs =   '(^!)';
    const expected = '#';

    expectObservable(e1.pipe(defaultIfEmpty('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should stop listening to a synchronous observable when unsubscribed', () => {
    const sideEffects: number[] = [];
    const synchronousObservable = new Observable(subscriber => {
      // This will check to see if the subscriber was closed on each loop
      // when the unsubscribe hits (from the `take`), it should be closed
      for (let i = 0; !subscriber.closed && i < 10; i++) {
        sideEffects.push(i);
        subscriber.next(i);
      }
    });

    synchronousObservable.pipe(
      defaultIfEmpty(0),
      take(3),
    ).subscribe(() => { /* noop */ });

    expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
