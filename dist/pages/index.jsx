'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const trpc_1 = require('../utils/trpc');
const react_query_devtools_1 = require('@tanstack/react-query-devtools');
const head_1 = __importDefault(require('next/head'));
const react_1 = require('react');
const ChatHeader_1 = require('../components/ChatHeader');
const AddMessageForm_1 = require('../components/AddMessageForm');
const SendMessageBox_1 = require('../components/SendMessageBox');
const Message_1 = require('../components/Message');
const LoadMoreButton_1 = require('../components/LoadMoreButton');

function IndexPage() {
  var _a;
  const utils = trpc_1.trpc.useContext();
  const postsQuery = trpc_1.trpc.post.infinite.useInfiniteQuery(
    {},
    {
      getPreviousPageParam: (d) => d.prevCursor
    }
  );
  const { hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage } =
    postsQuery;
  const [messages, setMessages] = (0, react_1.useState)(() => {
    var _a;
    const msgs =
      (_a = postsQuery.data) === null || _a === void 0
        ? void 0
        : _a.pages.map((page) => page.items).flat();
    return msgs;
  });
  const scrollTargetRef = (0, react_1.useRef)(null);
  // fn to add and dedupe new messages onto state
  const addMessages = (0, react_1.useCallback)((incoming) => {
    setMessages((current) => {
      const map = {};
      for (const msg of current !== null && current !== void 0 ? current : []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming !== null && incoming !== void 0
        ? incoming
        : []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
  }, []);
  // when new data from `useInfiniteQuery`, merge with current state
  (0, react_1.useEffect)(() => {
    var _a;
    const msgs =
      (_a = postsQuery.data) === null || _a === void 0
        ? void 0
        : _a.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [
    (_a = postsQuery.data) === null || _a === void 0 ? void 0 : _a.pages,
    addMessages
  ]);
  const scrollToBottomOfList = (0, react_1.useCallback)(() => {
    if (scrollTargetRef.current == null) {
      return;
    }
    scrollTargetRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }, [scrollTargetRef]);
  // useEffect(() => {
  //   scrollToBottomOfList();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // subscribe to new posts and add
  trpc_1.trpc.post.onAdd.useSubscription(undefined, {
    onData(post) {
      addMessages([post]);
    },
    onError(err) {
      console.error('Subscription error:', err);
      // we might have missed a message - invalidate cache
      utils.post.infinite.invalidate();
    }
  });
  const [currentlyTyping, setCurrentlyTyping] = (0, react_1.useState)([]);
  trpc_1.trpc.post.whoIsTyping.useSubscription(undefined, {
    onData(data) {
      setCurrentlyTyping(data);
    }
  });
  return (
    <>
      <head_1.default>
        <title>Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </head_1.default>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl bg-red-50">
          <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <ChatHeader_1.ChatHeader />
            <div
              id="messages"
              className="flex flex-col  space-y-4 p-3 mt-auto overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            >
              {messages === null || messages === void 0
                ? void 0
                : messages.map((msg) => (
                    <Message_1.Message
                      key={msg.id}
                      message={msg.text}
                      author={msg.name}
                      userIsAuthor={false}
                    />
                  ))}

              <Message_1.Message message={'Lolololo'} author="Mati" />
              <Message_1.Message
                message={'lalalalala'}
                author="John"
                userIsAuthor={true}
              />
            </div>
            <SendMessageBox_1.SendMessageBox />
          </div>
        </div>
      </div>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="flex-1 overflow-y-hidden md:h-screen">
          <section className="flex h-full flex-col justify-end space-y-4 bg-gray-700 p-4">
            <div className="space-y-4 overflow-y-auto">
              <LoadMoreButton_1.LoadMoreButton
                onClick={() => fetchPreviousPage()}
                isDisabled={!hasPreviousPage || isFetchingPreviousPage}
              >
                {isFetchingPreviousPage
                  ? 'Loading more...'
                  : hasPreviousPage
                  ? 'Load More'
                  : 'Nothing more to load'}
              </LoadMoreButton_1.LoadMoreButton>
              <div className="space-y-4">
                {messages === null || messages === void 0
                  ? void 0
                  : messages.map((item) => (
                      <article key={item.id} className=" text-gray-50">
                        <header className="flex space-x-2 text-sm">
                          <h3 className="text-base">
                            {item.source === 'RAW' ? (
                              item.name
                            ) : (
                              <a
                                href={`https://github.com/${item.name}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {item.name}
                              </a>
                            )}
                          </h3>
                          <span className="text-gray-500">
                            {new Intl.DateTimeFormat('en-GB', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            }).format(item.createdAt)}
                          </span>
                        </header>
                        <p className="whitespace-pre-line text-xl leading-tight">
                          {item.text}
                        </p>
                      </article>
                    ))}
                <div ref={scrollTargetRef}></div>
              </div>
            </div>
            <div className="w-full">
              <AddMessageForm_1.AddMessageForm
                onMessagePost={() => scrollToBottomOfList()}
              />
              <p className="h-2 italic text-gray-400">
                {currentlyTyping.length
                  ? `${currentlyTyping.join(', ')} typing...`
                  : ''}
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && (
              <div className="hidden md:block">
                <react_query_devtools_1.ReactQueryDevtools
                  initialIsOpen={false}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

exports.default = IndexPage;
