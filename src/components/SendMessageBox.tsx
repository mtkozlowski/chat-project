import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const MessageSchema = z.object({
  message: z.string().min(1).max(1000)
});

type MessageForm = z.infer<typeof MessageSchema>;

export const SendMessageBox = () => {
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);
  const isTyping = trpc.post.isTyping.useMutation();
  const addPost = trpc.post.add.useMutation();

  const { register, handleSubmit, watch, setValue } = useForm<MessageForm>({
    defaultValues: {
      message: ''
    },
    resolver: zodResolver(MessageSchema)
  });

  const onSubmit = async (data: MessageForm) => {
    const input = {
      text: data.message
    };
    try {
      await addPost.mutateAsync(input);
      setValue('message', '');
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex">
        <textarea
          placeholder="Write your message!"
          className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-6 bg-gray-200 rounded-md py-3 min-h-min"
          autoFocus={true}
          rows={watch('message')?.split(/[\r\n]/).length}
          {...register('message', { required: true })}
          onKeyDown={async (e) => {
            if (e.key === 'Shift') {
              setEnterToPostMessage(false);
            }
            if (e.key === 'Enter' && enterToPostMessage) {
              await handleSubmit(onSubmit)();
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
        <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
            style={{ background: '#f90044' }}
          >
            <span className="font-bold">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6 ml-2 transform rotate-90"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};
