import { createContext } from 'react';

const ChatContext = createContext({
   posts: [],
   modalRef: {},
   reply: false,
   isReplying: false,
   deleting: false,
   cancel: () => {},
   delete: () => {},
   addReply: () => {},
   showModal: () => {},
   formatTime: () => {},
   addComment: () => {},
   handleChange: () => {},
   updateComment: () => {},
});

export default ChatContext;
