import { MessageParams, WorkerMessageType } from './messages';
import { postTypedMessage } from './utils';
import { handleMessageFromMainThread } from './workers/worker-utils';

export abstract class WorkersService {
  protected workers: Worker[] = [];
  protected currentWorkerIndex = 0;
  protected workerIdCounter = 0;
  protected savedMessages: {
    message: string;
    params: Record<string, unknown>;
    shouldWaitForResponse?: boolean;
  }[] = [];

  constructor(private maxWorkers: number) {}

  protected abstract createWorker(): Promise<Worker>;

  protected registerWorker(worker: Worker) {
    this.workers.push(worker);
  }

  public async broadcastMessage<TMessage extends WorkerMessageType>(
    message: TMessage,
    params: MessageParams<TMessage>,
    saveMessage: boolean = false,
    waitForResponses: boolean = false,
  ) {
    if (saveMessage) {
      this.savedMessages.push({
        message,
        params,
        shouldWaitForResponse: waitForResponses,
      });
    }

    if (waitForResponses) {
      const responsePromises = [];

      for (const worker of this.workers) {
        responsePromises.push(
          handleMessageFromMainThread(worker, message, params),
        );
      }

      return await Promise.all(responsePromises);
    }

    for (const worker of this.workers) {
      postTypedMessage(worker, message, params);
    }
  }

  public async getWorker(): Promise<Worker> {
    if (this.workers.length < this.maxWorkers) {
      const worker = await this.createWorker();
      this.currentWorkerIndex = this.workers.length - 1;
      return worker;
    }

    const worker = this.workers[this.currentWorkerIndex];
    this.currentWorkerIndex =
      (this.currentWorkerIndex + 1) % this.workers.length;

    return worker;
  }

  protected async getNewId() {
    return (++this.workerIdCounter).toString();
  }
}
