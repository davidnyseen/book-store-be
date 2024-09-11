import router from './order.router';

const initOrder = app => {
  app.use('/order', router);
};

export default initOrder;
