import { handleDataVirtualList } from './utils';
import { Observable } from './observable';
import { useEffect, useRef, useCallback, useMemo } from 'react';

const positionObs = new Observable<number>(0);

// @experimental
const useVirtualList = <T extends HTMLElement, K>({
  position,
  loadCount,
  pages,
}: {
  position: number;
  loadCount: (position: number) => Promise<K[]> | undefined;
  pages: K[][] | undefined;
}) => {
  const containerRef = useRef<T>(null);
  const sentinelUpRef = useRef<T>(null);
  const sentinelDownRef = useRef<T>(null);

  useEffect(() => {
    const fn = async (position: number) => {
      await loadCount(position);
    };

    positionObs.subscribe(fn);
    positionObs.notify(position);

    return () => {
      positionObs.unsubscribe(fn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callbackFunction = useCallback(async (entries: IntersectionObserverEntry[]) => {
    const lastItem = entries[0];
    const element = lastItem.target as HTMLDivElement;

    const isSentinelUp = element.dataset.sentinel === 'up';
    const isSentinelDown = element.dataset.sentinel === 'down';

    if (isSentinelUp) {
      const currentPosition = positionObs.$value ?? 0;
      const nextPosition = lastItem.isIntersecting ? currentPosition + 1 : currentPosition;
      positionObs.notify(nextPosition);
    }

    if (isSentinelDown) {
      const currentPosition = positionObs.$value ?? 0;

      const nextPosition = lastItem.isIntersecting
        ? Math.max(currentPosition - 1, 0)
        : currentPosition;
      positionObs.notify(nextPosition);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0,
    });

    const sentinelUp = sentinelUpRef.current;
    const sentinelDown = sentinelDownRef.current;

    if (sentinelUp) {
      observer.observe(sentinelUp);
    }

    if (sentinelDown) {
      observer.observe(sentinelDown);
    }

    return () => {
      if (sentinelUp) {
        observer.unobserve(sentinelUp);
      }

      if (sentinelDown) {
        observer.unobserve(sentinelDown);
      }
    };
  }, [callbackFunction]);

  const data = useMemo(() => {
    return pages ? handleDataVirtualList<K>(pages, positionObs.$value || 0) : [];
  }, [pages]);

  return {
    containerRef,
    sentinelUpRef,
    sentinelDownRef,
    position: positionObs.$value,
    data,
  };
};

export default useVirtualList;
