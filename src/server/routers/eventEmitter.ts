import { EventEmitter } from 'events';
import { Post } from '@prisma/client';

interface MyEvents {
  add: (data: Post) => void;
  isTypingUpdate: () => void;
}

declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;

  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;

  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;

  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

export const ee = new MyEventEmitter();
