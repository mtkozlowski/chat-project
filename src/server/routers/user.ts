import { authedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { currentlyTyping } from '../currentlyIsTyping';
import { ee } from './eventEmitter';
import { observable } from '@trpc/server/observable';
import { prisma } from '../prisma';

const RegisterUserSchema = z.object({
  name: z.string(),
  email: z.string().email()
});

export const userRouter = router({
  isTyping: authedProcedure
    .input(z.object({ typing: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const { name } = ctx.user;
      if (!input.typing) {
        delete currentlyTyping[name];
      } else {
        currentlyTyping[name] = {
          lastTyped: new Date()
        };
      }
      ee.emit('isTypingUpdate');
    }),

  whoIsTyping: publicProcedure.subscription(() => {
    let prev: string[] | null = null;
    return observable<string[]>((emit) => {
      const onIsTypingUpdate = () => {
        const newData = Object.keys(currentlyTyping);

        if (!prev || prev.toString() !== newData.toString()) {
          emit.next(newData);
        }
        prev = newData;
      };
      ee.on('isTypingUpdate', onIsTypingUpdate);
      return () => {
        ee.off('isTypingUpdate', onIsTypingUpdate);
      };
    });
  }),

  register: authedProcedure
    .input(RegisterUserSchema)
    .mutation(async ({ input }) => {
      return await prisma.user.create({
        data: {
          ...input
        }
      });
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: {
          id: input.id
        }
      });
    })
});
