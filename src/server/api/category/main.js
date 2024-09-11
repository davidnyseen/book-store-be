import router from './category.router';

const initCategory = app => {
  app.use('/category', router);
};

export default initCategory;
