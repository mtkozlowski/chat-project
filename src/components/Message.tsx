import Image from 'next/image';
import userPic from '../../public/user-1-avatar.png';
import convPic from '../../public/user-2-avatar.png';

export interface MessageProps {
  message: string;
  author: string;
  userIsAuthor?: boolean;
}

export function Message(props: MessageProps) {
  const { message, userIsAuthor = false } = props;
  return (
    <div className="chat-message">
      <div className={`flex items-end ${userIsAuthor ? 'justify-end' : ''}`}>
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <span
              className={`px-4 py-2 rounded-lg inline-block rounded-bl-none ${
                userIsAuthor
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {message}
            </span>
          </div>
        </div>
        <Image
          src={userIsAuthor ? userPic : convPic}
          alt="My profile"
          priority={true}
          className={`w-6 h-6 rounded-full order-${userIsAuthor ? 2 : 1}`}
        />
      </div>
    </div>
  );
}
