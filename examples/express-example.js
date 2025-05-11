import { APIChainer } from 'apichainer';
import express from 'express';

const app = express();
app.use(express.json());

const chain = new APIChainer({ userId: '123' })
  .validate({
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
  })
  .auth({ token: 'secret' })
  .log({ level: 'info' });

app.post('/api/teams/:temamId/members', async (req, res) => {
  await chain.execute(req, res);
  res.json({ message: 'success' });
});

app.listen(5001, () => console.log('Server running on port 3000'));
