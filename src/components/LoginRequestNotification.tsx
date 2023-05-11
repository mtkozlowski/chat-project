import { signIn } from 'next-auth/react';

export const LoginRequestNotification = () => {
  return (
    <div className="flex w-full items-stretch justify-between rounded bg-gray-300 text-gray-600 px-3 py-2 text-lg">
      <p className="italic">
        You have to{' '}
        <button
          className="inline font-bold italic underline"
          onClick={() => signIn()}
        >
          sign in
        </button>{' '}
        to start writing.
      </p>
      <button
        onClick={() => signIn()}
        data-testid="signin"
        className="rounded bg-indigo-500 text-white px-4 text-sm"
      >
        Sign In
      </button>
    </div>
  );
};
