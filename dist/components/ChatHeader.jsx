"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHeader = void 0;
const image_1 = __importDefault(require("next/image"));
const user_1_avatar_png_1 = __importDefault(require("../../public/user-1-avatar.png"));
const google_1 = require("next/font/google");
const react_1 = require("next-auth/react");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
function ChatHeader() {
    var _a, _b;
    const { data: session } = (0, react_1.useSession)();
    const userName = (_b = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Anonymous';
    return (<div className="flex sm:items-center justify-between py-3 border-b-2 border-red-100">
      <div className="relative flex items-center space-x-4">
        <div className="relative">
          <span className="absolute text-green-500 right-0 bottom-0">
            <svg width="20" height="20">
              <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
            </svg>
          </span>
          <image_1.default src={user_1_avatar_png_1.default} alt="" priority={true} className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"/>
        </div>
        <div className="flex flex-col leading-tight">
          <div className="text-2xl mt-1 flex items-center">
            <span className={`text-gray-700 mr-3 ${inter.className}`}>
              {userName}
            </span>
          </div>
          <span className="text-lg text-gray-600">Junior Developer</span>
        </div>
      </div>
    </div>);
}
exports.ChatHeader = ChatHeader;
