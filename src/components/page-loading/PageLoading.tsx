import styles from './style.module.less';
import React, { useEffect, useRef, useReducer } from 'react';
import { pubsub } from '@utils/pubsub';
import { Progress } from '@douyinfe/semi-ui';

export interface ProgressData {
  progress: number; // Manually pass in progress: ?: number | undefined
  start: boolean; // Start ?: boolean
  end: boolean; // End ?: boolean
  time: number; // Default loading time interval
}

/**
 * Usage:
 * pubsub.publish('pageLoading', {
      start: true
   });
   pubsub.publish('pageLoading', {
      end: true
    });
 */
export default function PageLoading() {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const val = useRef<any>(null);
  const reRender = useRef(0);
  const timer = useRef<any>();

  const autoLoading = (time = 50) => {
    timer.current = setTimeout(() => {
      val.current = val.current + (90 - val.current) / 10;
      forceUpdate();
      autoLoading();
    }, time);
  };

  useEffect(() => {
    /**
     * data: {
     * progress: undefined,  // Manually pass in progress: ?: number | undefined
     * start,  // Start ?: boolean
     * end,  // End ?: boolean
     * time: 1000 // Default loading time interval
     * }
     */
    pubsub.subscribe('pageLoading', (_eventName, data: ProgressData) => {
      console.log('data--->', data);
      if (timer.current) {
        reRender.current++;
        clearTimeout(timer.current);
        timer.current = null;
      }

      if (data.progress !== undefined) {
        val.current = data.progress;
        forceUpdate();
      } else if (data.start) {
        val.current = 0;
        forceUpdate();
        autoLoading(data.time);
      } else if (data.end) {
        val.current = 100;
        forceUpdate();
        timer.current = setTimeout(() => {
          val.current = null;
          forceUpdate();
        }, 400);
      }
    });
    return () => {
      clearTimeout(timer.current);
      pubsub.unsubscribe('pageLoading');
    };
  }, []);

  if (val.current === null) {
    return null;
  }

  return (
    <div className={styles.loading}>
      <Progress
        key={reRender.current}
        showInfo={false}
        strokeWidth={3}
        percent={val.current}
        // strokeColor="#FF7900"
        // trailColor="#ffd7b4"
        size="small"
      />
    </div>
  );
}
