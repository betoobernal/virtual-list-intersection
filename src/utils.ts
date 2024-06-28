export const validateTextBoxKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>): boolean => {
  const settings = {
    maxLen: 100,
  };

  const keys = {
    backspace: 8,
    shift: 16,
    ctrl: 17,
    alt: 18,
    delete: 46,
    // 'cmd':
    leftArrow: 37,
    upArrow: 38,
    rightArrow: 39,
    downArrow: 40,
  };

  const utils: Record<string, any> = {
    special: {},
    navigational: {},
    isSpecial(e: any) {
      return typeof this.special[e.keyCode] !== 'undefined';
    },
    isNavigational(e: any) {
      return typeof this.navigational[e.keyCode] !== 'undefined';
    },
  };

  utils.special[keys['backspace']] = true;
  utils.special[keys['shift']] = true;
  utils.special[keys['ctrl']] = true;
  utils.special[keys['alt']] = true;
  utils.special[keys['delete']] = true;

  utils.navigational[keys['upArrow']] = true;
  utils.navigational[keys['downArrow']] = true;
  utils.navigational[keys['leftArrow']] = true;
  utils.navigational[keys['rightArrow']] = true;

  const len = evt.currentTarget.innerText.trim().length ?? 0;
  let hasSelection = false;
  const selection = window.getSelection();
  const isSpecial = utils.isSpecial(evt);
  const isNavigational = utils.isNavigational(evt);

  if (selection) {
    hasSelection = !!selection.toString();
  }

  if (isSpecial || isNavigational) {
    return true;
  }

  if (len >= settings.maxLen && !hasSelection) {
    evt.preventDefault();
    return false;
  }

  return true;
};

// @experimental
export const handleDataVirtualList = <T>(data: T[][], position: number, size: number): any[] => {
  const next = position + 1;
  const prev = Math.max(position - 1, 0);
  return [
    ...(prev !== 0 && data.length ? data.at(prev)! : []),
    ...(data[position] ?? []),
    ...(data.at(next) ?? []),
  ];
};
