export const pullToReleaseConfig = {
  mainElement: 'body',
  triggerElement: '#tokens > div',
  instructionsPullToRefresh: 'Pull to refresh',
  resistanceFunction: t => Math.min(1, t / 2.75),
  // distIgnore: 20,
  distThreshold: 50,
  distReload: 0,
  instructionsRefreshing: ' '
};
