import adminRouter from './router';

const initAdminApi = app => {
  app.use('/admin', adminRouter);
};

export default initAdminApi;
