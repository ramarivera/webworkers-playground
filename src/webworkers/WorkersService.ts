import { AllMessages, MessagePayloads } from './messages';
import { postTypedMessage } from './utils';

export abstract class WorkersService {
  protected workers: Worker[] = [];
  protected currentWorkerIndex = 0;
  protected workerIdCounter = 0;
  protected savedMessages: {
    message: string;
    params: Record<string, unknown>;
  }[] = [];

  constructor(private maxWorkers: number) {}

  protected abstract createWorker(): Worker;

  protected registerWorker(worker: Worker) {
    this.workers.push(worker);
  }

  public broadcastMessage<TMessage extends AllMessages>(
    message: TMessage,
    params: MessagePayloads[TMessage]['params'],
    saveMessage: boolean = false,
  ) {
    if (saveMessage) {
      this.savedMessages.push({ message, params });
    }

    for (const worker of this.workers) {
      postTypedMessage(worker, message, params);
    }
  }

  public getWorker(): Worker {
    if (this.workers.length < this.maxWorkers) {
      const worker = this.createWorker();
      this.currentWorkerIndex = this.workers.length - 1;
      return worker;
    }

    const worker = this.workers[this.currentWorkerIndex];
    this.currentWorkerIndex =
      (this.currentWorkerIndex + 1) % this.workers.length;
    return worker;
  }

  protected getNewId() {
    return (++this.workerIdCounter).toString();
  }
}
