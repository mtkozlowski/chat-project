import { Context } from './context';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  }
});
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
const isAuthed = middleware(({ next, ctx }) => {
  const user = ctx.session?.user;

  if (!user?.name) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      user: {
        ...user,
        name: user.name
      }
    }
  });
});
export const authedProcedure = t.procedure.use(isAuthed);
