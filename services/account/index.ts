import { createApp } from './server';

const app = createApp();
const port = process.env.PORT || 3009;
app.listen(port, () => {
  console.log(`account api listening on ${port}`);
});
