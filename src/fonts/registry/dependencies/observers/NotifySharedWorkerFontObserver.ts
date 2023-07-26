/* eslint-disable @typescript-eslint/no-unused-vars */

import { Broadcaster } from '../../../../webworkers/types';

import { FontObserver } from './FontObserver';

/**
 * This observer will react to loaded fonts and let the web worker know so it can also register them.
 */
export class NotifyWorkersObserver implements FontObserver {
  constructor(private broadcaster: Broadcaster) {}

  loaded(
    fontName: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
  ): void {
    this.broadcaster('fontLoaded', {
      fontName,
      url,
      isBold,
      isItalic,
    });

    // sharedWorker.port.onmessage = (event: MessageEvent<WorkerMessage>) => {
    //   if (isMessageOfType(event, 'fontLoaded:result')) {
    //     if (event.data.params.status === 'error') {
    //       console.log(
    //         `DocumentAdderFontObserver: error loading font ${fontName} from ${url}`,
    //       );
    //     }
    //   }
    // };
    // sharedWorker.onerror = (error) => {
    //   console.log('DocumentAdderFontObserver: error from shared worker', error);
    // };
  }
}
