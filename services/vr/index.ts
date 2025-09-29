import { createApp } from './server';

const app = createApp();
const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`vr api listening on ${port}`);
});
