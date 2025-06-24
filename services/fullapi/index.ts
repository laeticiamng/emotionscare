import { createApp } from './server';

const port = process.env.PORT || 3010;
const app = createApp();
app.listen(port, () => {
  console.log(`api v1 listening on ${port}`);
});
