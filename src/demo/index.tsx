import { useEffect, useMemo, useRef, useState } from 'react';
import items, { Item } from './items';

import styles from './styles.module.scss';

const ItemComp = (item: Item) => {
  return (
    <div className={styles.item} data-index={item.id}>
      {item.label}
    </div>
  );
};

const AMOUNT = 5;
const INC = 3;

export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const [range, setRange] = useState([0, AMOUNT]);

  // console.log("range", range);

  console.log(
    Math.max(0, range[0] - INC),
    Math.min(range[1] + INC, items.length)
  );

  const itemsSliced = useMemo(() => {
    return items.slice(
      Math.max(0, range[0] - INC),
      Math.min(range[1] + INC, items.length)
    );
  }, [range]);

  useEffect(() => {
    let observerDown: IntersectionObserver;
    let observerTop: IntersectionObserver;
    const currentBottom = bottomRef?.current;
    const currentTop = topRef?.current;
    
    if (currentBottom) {
      observerDown = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("El elemento bottom es visible en el viewport");
            setRange((prev) => {
              const newRangeDown = [prev[1], prev[1] + AMOUNT];
              console.log("prevDown", newRangeDown);
              return newRangeDown;
            });
          } else {
            console.log("El elemento bottom no es visible en el viewport");
          }
        });
      });

      observerDown.observe(currentBottom);
    }

    if (currentTop) {
      observerTop = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("El elemento top es visible en el viewport");
            setRange((prev) => {
              const newRange = [
                Math.max(prev[0] - AMOUNT, 0),
                Math.max(prev[0], AMOUNT),
              ];
              console.log("prevTop", newRange);
              return newRange;
            });
          } else {
            console.log("El elemento top no es visible en el viewport");
          }
        });
      });

      observerTop.observe(currentTop);
    }

    return () => {
      if (observerDown && currentBottom) {
        observerDown.unobserve(currentBottom);
      }

      if (observerTop && currentTop) {
        observerTop.unobserve(currentTop);
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>Intersection Observer demo</h1>
      <div ref={ref} className={styles.container}>
        <div className={styles.item} ref={topRef} />
        {itemsSliced.map((item) => (
          <ItemComp key={item.id} {...item} />
        ))}
        <div className={styles.item} ref={bottomRef} />
      </div>
    </div>
  );
}
