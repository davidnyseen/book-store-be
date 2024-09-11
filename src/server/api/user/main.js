import { InitRouterFunc } from '@type/server';
import router from './user.router';

const initUser = app => {
  app.use('/user', router);
};

export default initUser;
