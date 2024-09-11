import router from './chat.router';

const initChat = app => {
  app.use('/chat', router);
};

export default initChat;
