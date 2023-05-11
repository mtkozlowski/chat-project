"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const image_1 = __importDefault(require("next/image"));
const user_1_avatar_png_1 = __importDefault(require("../../public/user-1-avatar.png"));
const user_2_avatar_png_1 = __importDefault(require("../../public/user-2-avatar.png"));
function Message(props) {
    const { message, author, userIsAuthor = false } = props;
    return (<div className="chat-message">
      <div className={`flex items-end ${userIsAuthor ? 'justify-end' : ''}`}>
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <span className={`px-4 py-2 rounded-lg inline-block rounded-bl-none ${userIsAuthor
            ? 'bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-600'}`}>
              {message}
            </span>
          </div>
        </div>
        <image_1.default src={userIsAuthor ? user_1_avatar_png_1.default : user_2_avatar_png_1.default} alt="My profile" priority={true} className={`w-6 h-6 rounded-full order-${userIsAuthor ? 2 : 1}`}/>
      </div>
    </div>);
}
exports.Message = Message;
