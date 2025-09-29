import { createApp } from './server';

const app = createApp();
const port = process.env.PORT || 3010;
app.listen(port, () => {
  console.log(`privacy api listening on ${port}`);
});
