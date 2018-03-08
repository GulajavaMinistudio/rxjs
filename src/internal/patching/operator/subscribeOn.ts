
import { SchedulerLike } from '../../types';
import { Observable } from '../../Observable';
import { subscribeOn as higherOrder } from '../../operators/subscribeOn';

/**
 * Asynchronously subscribes Observers to this Observable on the specified IScheduler.
 *
 * <img src="./img/subscribeOn.png" width="100%">
 *
 * @param {Scheduler} scheduler - The IScheduler to perform subscription actions on.
 * @return {Observable<T>} The source Observable modified so that its subscriptions happen on the specified IScheduler.
 .
 * @method subscribeOn
 * @owner Observable
 */
export function subscribeOn<T>(this: Observable<T>, scheduler: SchedulerLike, delay: number = 0): Observable<T> {
  return higherOrder(scheduler, delay)(this) as Observable<T>;
}
