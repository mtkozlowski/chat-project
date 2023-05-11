import { PropsWithChildren } from 'react';

export const Main = (props: PropsWithChildren) => {
  return (
    <main
      style={{
        background: 'url(/main-bg.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
      className="h-screen"
    >
      {props.children}
    </main>
  );
};
