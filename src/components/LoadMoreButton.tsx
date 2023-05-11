import { PropsWithChildren } from 'react';

export interface LoadMoreButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

export function LoadMoreButton(props: PropsWithChildren<LoadMoreButtonProps>) {
  const { onClick, isDisabled, children } = props;

  return (
    <button
      data-testid="loadMore"
      onClick={onClick}
      disabled={isDisabled}
      className="rounded bg-violet-500 px-4 py-1 text-white disabled:opacity-40"
    >
      {children}
    </button>
  );
}
