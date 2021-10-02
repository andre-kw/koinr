export const pullToReleaseConfig = {
  mainElement: '#app',
  triggerElement: '#tokens > div',
  instructionsPullToRefresh: 'Pull to refresh',
  shouldPullToRefresh: () => !document.querySelector('#tokens > div').scrollTop,
  resistanceFunction: t => Math.min(1, t / 2.75),
  // distIgnore: 50,
  distThreshold: 50,
  // distReload: 75,
  instructionsRefreshing: 'Fetching tokens'
};
