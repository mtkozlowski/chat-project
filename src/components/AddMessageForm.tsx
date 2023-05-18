import { trpc } from '../utils/trpc';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

export function AddMessageForm({
  onMessagePost
}: {
  onMessagePost: () => void;
}) {
  const addPost = trpc.post.add.useMutation();
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);

  async function postMessage() {
    const input = {
      text: message
    };
    try {
      await addPost.mutateAsync(input);
      setMessage('');
      onMessagePost();
    } catch {}
  }

  const isTyping = trpc.user.isTyping.useMutation();

  const userName = session?.user?.name;
  if (!userName) {
    return (
      <div className="flex w-full justify-between rounded bg-gray-800 px-3 py-2 text-lg text-gray-200">
        <p className="font-bold">
          You have to{' '}
          <button
            className="inline font-bold underline"
            onClick={() => signIn()}
          >
            sign in
          </button>{' '}
          to write.
        </p>
        <button
          onClick={() => signIn()}
          data-testid="signin"
          className="h-full rounded bg-indigo-500 px-4"
        >
          Sign In
        </button>
      </div>
    );
  }
  return (
    <>
      <form
        onSubmit={async (e) => {
          await postMessage();
        }}
      >
        <fieldset disabled={addPost.isLoading} className="min-w-0">
          <div className="flex w-full items-end rounded bg-gray-500 px-3 py-2 text-lg text-gray-200">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent outline-0"
              rows={message.split(/[\r\n]/).length}
              id="text"
              name="text"
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === 'Shift') {
                  setEnterToPostMessage(false);
                }
                if (e.key === 'Enter' && enterToPostMessage) {
                  void postMessage();
                }
                isTyping.mutate({ typing: true });
              }}
              onKeyUp={(e) => {
                if (e.key === 'Shift') {
                  setEnterToPostMessage(true);
                }
              }}
              onBlur={() => {
                setEnterToPostMessage(true);
                isTyping.mutate({ typing: false });
              }}
            />
            <div>
              <button type="submit" className="rounded bg-indigo-500 px-4 py-1">
                Submit
              </button>
            </div>
          </div>
        </fieldset>
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
    </>
  );
}
