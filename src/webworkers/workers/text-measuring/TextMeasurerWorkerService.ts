import { postTypedMessage, postUntypedMessage } from '../../utils';
import { WorkersService } from '../../WorkersService';

export class TextMeasurerWorkersService extends WorkersService {
  protected createWorker(): Worker {
    const workerId = this.getNewId();

    const worker = new Worker(
      new URL('./TextMeasurerWebWorker.ts', import.meta.url),
      { type: 'module' },
    );

    postTypedMessage(worker, 'initialize', { id: workerId });

    for (const message of this.savedMessages) {
      postUntypedMessage(worker, message.message, message.params);
    }

    this.registerWorker(worker);

    return worker;
  }
}
