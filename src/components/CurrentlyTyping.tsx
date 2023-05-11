import { useState } from 'react';
import { trpc } from '../utils/trpc';

export function CurrentlyTyping() {
  const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);
  trpc.post.whoIsTyping.useSubscription(undefined, {
    onData(data) {
      setCurrentlyTyping(data);
    }
  });
  return (
    <p className="pb-2 h-8 italic text-gray-400">
      {currentlyTyping.length ? `${currentlyTyping.join(', ')} typing...` : ''}
    </p>
  );
}
