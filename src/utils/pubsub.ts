/* eslint-disable prettier/prettier */
/**
 * Publish/Subscribe pattern
 * https://www.npmjs.com/package/PubSub
 *
 *
.subscribe(topic, callback, [once]) ⇒ number
.subscribeOnce(topic, callback) ⇒ number
.publish(topic, [...data]) ⇒ boolean
.publishSync(topic, [...data]) ⇒ boolean
.unsubscribe(topic) ⇒ boolean | string
.unsubscribeAll() ⇒ PubSub
.hasSubscribers([topic]) ⇒ boolean
.subscribers() ⇒ object
.subscribersByTopic(topic) ⇒ array
.alias(aliasMap) ⇒ PubSub
 */
import pubsub from 'pubsub-js';

export { pubsub };
