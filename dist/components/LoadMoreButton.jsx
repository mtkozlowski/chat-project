"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMoreButton = void 0;
function LoadMoreButton(props) {
    const { onClick, isDisabled, children } = props;
    return (<button data-testid="loadMore" onClick={onClick} disabled={isDisabled} className="rounded bg-indigo-500 px-4 py-2 text-white disabled:opacity-40">
      {children}
    </button>);
}
exports.LoadMoreButton = LoadMoreButton;
