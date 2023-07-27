import { FontFaceObserverFontAwaiter } from './fonts/registry/dependencies/awaiters/FontFaceObserverFontAwaiter';
import { DocumentAdderFontObserver } from './fonts/registry/dependencies/observers/DocumentAdderFontObserver';
import { NotifyWorkersObserver } from './fonts/registry/dependencies/observers/NotifySharedWorkerFontObserver';
import { FontRegistry } from './fonts/registry/FontRegistry';
import { TextMeasurerWorkersService } from './webworkers/workers/text-measuring/TextMeasurerWorkerService';

const textMeasurerWorkersService = new TextMeasurerWorkersService(1);

const fontRegistry = new FontRegistry({
  fontAwaiter: new FontFaceObserverFontAwaiter(),
  observers: [
    new DocumentAdderFontObserver(),
    new NotifyWorkersObserver(
      textMeasurerWorkersService.broadcastMessage.bind(
        textMeasurerWorkersService,
      ),
    ),
  ],
});

export const Services = {
  FontRegistry: fontRegistry,
  TextMeasurerWorkersService: textMeasurerWorkersService,
};
