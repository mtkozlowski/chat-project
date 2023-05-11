import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LoadMoreButton } from './LoadMoreButton';
import { Message } from './Message';

export function Messages() {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  const userName = session?.user?.name;
  const postsQuery = trpc.post.infinite.useInfiniteQuery(
    {},
    {
      getPreviousPageParam: (d) => d.prevCursor
    }
  );
  const { hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage } =
    postsQuery;

  const [messages, setMessages] = useState(() => {
    return postsQuery.data?.pages.map((page) => page.items).flat();
  });

  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current == null) {
      return;
    }

    scrollTargetRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }, [scrollTargetRef]);

  useEffect(() => {
    scrollToBottomOfList();
  }, [scrollToBottomOfList]);

  type Post = NonNullable<typeof messages>[number];

  const addMessages = useCallback((incoming?: Post[]) => {
    setMessages((current) => {
      const map: Record<Post['id'], Post> = {};
      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
  }, []);

  useEffect(() => {
    const messages = postsQuery.data?.pages.map((page) => page.items).flat();
    addMessages(messages);
    scrollToBottomOfList();
  }, [postsQuery.data?.pages, addMessages, scrollToBottomOfList]);

  trpc.post.onAdd.useSubscription(undefined, {
    onData(post) {
      addMessages([post]);
    },
    onError(err) {
      console.error('Subscription error:', err);
      utils.post.infinite.invalidate();
    }
  });

  return (
    <div
      id="messages"
      className={`flex flex-col space-y-4 p-3 mt-auto overflow-y-auto max-h-128 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch ${
        !userName && 'cursor-not-allowed opacity-40'
      }`}
    >
      <div className="self-center pb-4">
        <LoadMoreButton
          onClick={fetchPreviousPage}
          isDisabled={!hasPreviousPage || isFetchingPreviousPage}
        >
          {isFetchingPreviousPage
            ? 'Loading more...'
            : hasPreviousPage
            ? 'Load More'
            : 'Nothing more to load'}
        </LoadMoreButton>
      </div>
      {messages?.map((msg) => (
        <Message
          key={msg.id}
          message={msg.text}
          author={msg.name}
          userIsAuthor={msg.name === userName}
        />
      ))}
      <div className="pt-4" ref={scrollTargetRef}></div>
    </div>
  );
}
