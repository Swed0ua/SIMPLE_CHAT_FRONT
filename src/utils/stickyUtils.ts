export type StickTo = 'top' | 'bottom';

export function getStickyTranslateY(
  naturalY: number,
  stickyHeight: number,
  viewportTop: number,
  viewportBottom: number,
  stickyTo: StickTo,
  pusherTop: number | null,
  wrapperTop: number,
  wrapperBottom: number,
): number {
  const minTop = wrapperTop;
  const maxTop = wrapperBottom - stickyHeight;

  if (stickyTo === 'top') {
    let targetY = viewportTop;
    if (pusherTop != null && pusherTop - stickyHeight < targetY) {
      targetY = pusherTop - stickyHeight;
    }
    targetY = Math.max(minTop, Math.min(maxTop, targetY));
    return targetY - naturalY;
  }
  let targetY = viewportBottom - stickyHeight;
  if (pusherTop != null && pusherTop > targetY) {
    targetY = pusherTop - stickyHeight;
  }
  targetY = Math.max(minTop, Math.min(maxTop, targetY));
  // console.log('targetY : ', targetY);
  // console.log('naturalY : ', naturalY);
  // console.log('stickyHeight : ', stickyHeight);
  // console.log('viewportBottom : ', viewportBottom);

  return targetY - naturalY;
}
