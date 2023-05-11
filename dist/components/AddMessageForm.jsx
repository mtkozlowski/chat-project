"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMessageForm = void 0;
const trpc_1 = require("../utils/trpc");
const react_1 = require("next-auth/react");
const react_2 = require("react");
function AddMessageForm({ onMessagePost }) {
    var _a;
    const addPost = trpc_1.trpc.post.add.useMutation();
    const { data: session } = (0, react_1.useSession)();
    const [message, setMessage] = (0, react_2.useState)('');
    const [enterToPostMessage, setEnterToPostMessage] = (0, react_2.useState)(true);
    async function postMessage() {
        const input = {
            text: message
        };
        try {
            await addPost.mutateAsync(input);
            setMessage('');
            onMessagePost();
        }
        catch { }
    }
    const isTyping = trpc_1.trpc.post.isTyping.useMutation();
    const userName = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name;
    if (!userName) {
        return (<div className="flex w-full justify-between rounded bg-gray-800 px-3 py-2 text-lg text-gray-200">
        <p className="font-bold">
          You have to{' '}
          <button className="inline font-bold underline" onClick={() => (0, react_1.signIn)()}>
            sign in
          </button>{' '}
          to write.
        </p>
        <button onClick={() => (0, react_1.signIn)()} data-testid="signin" className="h-full rounded bg-indigo-500 px-4">
          Sign In
        </button>
      </div>);
    }
    return (<>
      <form onSubmit={async (e) => {
            e.preventDefault();
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             */
            await postMessage();
        }}>
        <fieldset disabled={addPost.isLoading} className="min-w-0">
          <div className="flex w-full items-end rounded bg-gray-500 px-3 py-2 text-lg text-gray-200">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 bg-transparent outline-0" rows={message.split(/\r|\n/).length} id="text" name="text" autoFocus onKeyDown={async (e) => {
            if (e.key === 'Shift') {
                setEnterToPostMessage(false);
            }
            if (e.key === 'Enter' && enterToPostMessage) {
                void postMessage();
            }
            isTyping.mutate({ typing: true });
        }} onKeyUp={(e) => {
            if (e.key === 'Shift') {
                setEnterToPostMessage(true);
            }
        }} onBlur={() => {
            setEnterToPostMessage(true);
            isTyping.mutate({ typing: false });
        }}/>
            <div>
              <button type="submit" className="rounded bg-indigo-500 px-4 py-1">
                Submit
              </button>
            </div>
          </div>
        </fieldset>
        {addPost.error && (<p style={{ color: 'red' }}>{addPost.error.message}</p>)}
      </form>
    </>);
}
exports.AddMessageForm = AddMessageForm;
