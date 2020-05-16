# oak jwt sample demo

The sample project are based on oak which is a web framework for deno. The design of [oak](https://github.com/oakserver/oak) is inspired by koa with its elegant and easy-to-use middleware design. 

The demo demonstrates how to use a jwt authentication method, and the code of the jwt middleware is mostly adapted from [koa-jwt](https://github.com/koajs/jwt/).

## How to start
First you need to install [deno](https://github.com/denoland/deno_install). Then run the following command. `--allow-net` is required for this program to gain enough permission to execute.
```bash
deno run --allow-net app.ts
```
And if you see the following in the console, it indicates that server has started successfully.
```
server started, listens on 8000
```
This demo use some mock data to show the simplfied authentication logic and the generation and verification of token. If you want to do some real world things, you can go to [deno land](https://deno.land/x) to find some shining database drivers. 