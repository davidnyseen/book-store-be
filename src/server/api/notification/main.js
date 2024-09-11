import router from './notification.router';

const initNotification = app => {
  app.use('/notif', router);
};

export default initNotification;
