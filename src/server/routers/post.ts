import { Post } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { prisma } from '../prisma';
import { z } from 'zod';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { AddPostSchema } from '../../types/AddPostSchema';
import { ee } from './eventEmitter';
import { currentlyTyping } from '../currentlyIsTyping';

export const postRouter = router({
  add: authedProcedure.input(AddPostSchema).mutation(async ({ input, ctx }) => {
    const { name } = ctx.user;
    const post = await prisma.post.create({
      data: {
        ...input,
        name,
        source: 'GITHUB'
      }
    });
    ee.emit('add', post);
    delete currentlyTyping[name];
    ee.emit('isTypingUpdate');
    return post;
  }),

  infinite: publicProcedure
    .input(
      z.object({
        cursor: z.date().nullish(),
        take: z.number().min(1).max(50).nullish()
      })
    )
    .query(async ({ input }) => {
      const take = input.take ?? 10;
      const cursor = input.cursor;

      const page = await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        cursor: cursor ? { createdAt: cursor } : undefined,
        take: take + 1,
        skip: 0
      });
      const items = page.reverse();
      let prevCursor: null | typeof cursor = null;
      if (items.length > take) {
        const prev = items.shift();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        prevCursor = prev!.createdAt;
      }
      return {
        items,
        prevCursor
      };
    }),

  onAdd: publicProcedure.subscription(() => {
    return observable<Post>((emit) => {
      const onAdd = (data: Post) => emit.next(data);
      ee.on('add', onAdd);
      return () => {
        ee.off('add', onAdd);
      };
    });
  })
});
