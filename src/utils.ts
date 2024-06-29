// @experimental
export const handleDataVirtualList = <T>(data: T[][], position: number): T[] => {
  const next = position + 1;
  const prev = Math.max(position - 1, 0);
  return [
    ...(prev !== 0 && data.length ? data.at(prev)! : []),
    ...(data[position] ?? []),
    ...(data.at(next) ?? []),
  ];
};
