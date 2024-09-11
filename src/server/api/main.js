import { Router } from 'express';
import initAuth from './auth';
import initProduct from './product';
import initCategory from './category';
import initBrand from './company';
import initUser from './user';
import initOrder from './order';
import { initVersion } from './version/main.router';
import initCollection from './collection';
import initNotification from './notification';
import initChat from './chat';

const initApi = (app) => {
  const router = Router();
  initVersion(router);
  initAuth(router);
  initUser(router);
  initProduct(router);
  initCategory(router);
  initBrand(router);
  initOrder(router);
  initCollection(router);
  initNotification(router);
  initChat(router);
  app.use('/api', router);
};

export default initApi;
