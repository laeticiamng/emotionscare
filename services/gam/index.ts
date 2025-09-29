import { createApp } from './server';

const app = createApp();
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`gam api listening on ${port}`);
});
