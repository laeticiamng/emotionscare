import { createApp } from './server';

const app = createApp();
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`scan api listening on ${port}`);
});
