import { createApp } from './server';

const app = createApp();
const port = Number(process.env.PORT) || 3005;
app.listen({ port, host: '0.0.0.0' }).then(() => {
  app.log.info(`breath api listening on ${port}`);
}).catch(err => {
  app.log.error(err);
  process.exit(1);
});
