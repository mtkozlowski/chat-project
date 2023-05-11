import Image from 'next/image';
import userPic from '../../public/user-1-avatar.png';
import { Inter } from 'next/font/google';
import { signOut, useSession } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export function ChatHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Anonymous';
  if (session) {
    return (
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-red-100">
        <div className="relative flex flex-1 items-center justify-between space-x-4">
          <div className="relative">
            <span className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <Image
              src={userPic}
              alt=""
              priority={true}
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
            />
          </div>
          <div className="flex flex-1 leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className={`text-gray-700 mr-3 ${inter.className}`}>
                {userName}
              </span>
            </div>
          </div>
          <button
            className={
              'py-0.5 px-4 border-2 border-violet-950 rounded-2xl text-violet-950 font-semibold hover:bg-violet-950 hover:text-white transition duration-200 ease-in-out'
            }
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
