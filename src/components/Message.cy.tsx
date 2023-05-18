import React from 'react';
import { Message } from './Message';
import type { ImageProps } from 'next/image';
import * as ImageComponent from 'next/image';

describe('<Message />', () => {
  describe('mock image with component override', () => {
    const OriginalImageComponent = ImageComponent.default;

    beforeEach(() => {
      // This block could be extracted into the component testing support file, so
      // it is applied to all component tests
      Object.defineProperty(ImageComponent, 'default', {
        configurable: true,
        value: (props: ImageProps) => {
          return <OriginalImageComponent {...props} unoptimized />;
        }
      });
    });

    it('renders', () => {
      cy.mount(
        <div
          id="messages"
          className={
            'flex flex-col space-y-4 p-3 mt-auto overflow-y-auto max-h-128 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch '
          }
        >
          <Message message={'Override!'} author={'Master'} />
        </div>
      );
    });
    it('renders with userIsAuthor', () => {
      cy.mount(
        <div
          id="messages"
          className={
            'flex flex-col space-y-4 p-3 mt-auto overflow-y-auto max-h-128 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch '
          }
        >
          <Message
            message={'Override!'}
            author={'Master'}
            userIsAuthor={true}
          />
        </div>
      );
    });

    afterEach(() => {
      Object.defineProperty(ImageComponent, 'default', {
        configurable: true,
        value: OriginalImageComponent
      });
    });
  });
});
