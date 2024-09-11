import router from './product.router';

const initProduct = app => {
  app.use('/product', router);
};

export default initProduct;
