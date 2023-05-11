import Head from 'next/head';
import { ChatHeader } from '../components/ChatHeader';
import { SendMessageBox } from '../components/SendMessageBox';
import { useSession } from 'next-auth/react';
import { LoginRequestNotification } from '../components/LoginRequestNotification';
import { Main } from '../layout/Main';
import { Messages } from '../components/Messages';
import { CurrentlyTyping } from '../components/CurrentlyTyping';

export default function IndexPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name;

  return (
    <>
      <Head>
        <title>Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <div className="flex p-4 sm:p-6 lg:p-8 h-screen">
          <div className="m-auto max-w-3xl bg-red-50 rounded-xl shadow-2xl px-4 pt-4 pb-5 flex-1 flex flex-col justify-between">
            <ChatHeader />
            <Messages />
            <div className="border-t-2 border-red-100 px-4 pt-4 mb-2 sm:mb-0">
              {!userName ? (
                <LoginRequestNotification />
              ) : (
                <>
                  <CurrentlyTyping />
                  <SendMessageBox />
                </>
              )}
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}
