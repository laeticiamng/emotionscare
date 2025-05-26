import { createApp } from './server';

const app = createApp();
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`breath api listening on ${port}`);
});
