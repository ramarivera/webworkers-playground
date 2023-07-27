import { postUntypedMessage } from '../../utils';
import { WorkersService } from '../../WorkersService';
import {
  handleMessageFromMainThread,
  handleMessageFromMainThreadUntyped,
} from '../worker-utils';

export class TextMeasurerWorkersService extends WorkersService {
  protected async createWorker(): Promise<Worker> {
    const workerId = await this.getNewId();

    const worker = new Worker(
      new URL('./TextMeasurerWebWorker.ts', import.meta.url),
      { type: 'module' },
    );

    await handleMessageFromMainThread(worker, 'initialize', { id: workerId });

    for (const message of this.savedMessages) {
      if (message.shouldWaitForResponse) {
        await handleMessageFromMainThreadUntyped(
          worker,
          message.message,
          message.params,
        );
        continue;
      }

      postUntypedMessage(worker, message.message, message.params);
    }

    this.registerWorker(worker);

    return worker;
  }
}
