import {
  Application,
  Router,
  makeJwt,
  Jose,
  Payload,
  setExpiration,
  JwtObject,
} from './deps.ts';
import { jwt } from './jwt/middleware.ts';

const users = [
  { name: 'Bob', id: 1, age: 29 },
  { name: 'Alice', id: 2, age: 18 },
  { name: 'Tom', id: 3, age: 24 },
];

const payload: Payload = {
  iss: 'oak-demo',
  exp: setExpiration(new Date().getTime() + 60000),
};

const header: Jose = {
  alg: 'HS256',
  typ: 'JWT',
};

const secret = 'hello-world';

const router = new Router();
router
  .get('/', (context) => {
    context.response.body = 'Hello world!';
  })
  .post('/login', async ctx => {
    const body = await ctx.request.body();
    if (!body.value) {
      ctx.throw(422, 'invalid request entity');
    }
    const payload = body.value;
    if (!payload.username) {
      ctx.throw(400, 'please provide a valid username');
    }
    const user = users.find(u => u.name === payload.username);
    if (!user) {
      ctx.throw(400, 'user not found');
    }
    const token = makeJwt({
      key: secret,
      header,
      payload: { ...payload, id: user!.id }
    });
    ctx.response.body = {
      token
    };
  })
  .get('/private/user/:id', (ctx) => {
    const authInfo = ctx.state.user as JwtObject;
    const userId = authInfo.payload!.id;
    if (userId !== parseInt(ctx.params?.id + "")) {
      ctx.throw(403, 'You cannot access');
    }
    ctx.response.body = users.find(u => u.id === userId);
  });

const app = new Application();
app.use(
  jwt({
    secret,
    when: (ctx) => !!ctx.request.url.pathname.match(/^\/private/),
  })
);
app.use(router.routes());
app.use(router.allowedMethods());

console.log('server started, listens on 8000');

await app.listen({ port: 8000 });
