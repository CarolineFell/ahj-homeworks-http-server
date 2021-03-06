const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const uuid = require('uuid');

const port = process.env.PORT || 7070;

// => CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

const server = http.createServer(app.callback()).listen(port)
//http.createServer(app.callback()).listen(port)
  
// => Body Parsers
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

let tickets = [];
class Tickets {
  constructor(id, name, description, status, created) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
  }
}

app.use(async (ctx) => {
  // GET
  if (ctx.method === 'GET') {
    const { id } = ctx.request.query;
    if (id) {
      const ticket = tickets.find(item => item.id == id);
      ctx.response.body = ticket.description;
      return;
    }
    ctx.response.body = tickets.map((item) => {
      return {
        id: item.id,
        name: item.name,
        status: item.status,
        created: item.created,
      };
    });
    return;
  }

  // POST
  if (ctx.method === 'POST') {
    const { name, description } = ctx.request.body;
    const id = uuid.v4();
    const created = new Date();
    tickets.push(new Tickets(id, name, description, false, created));
    ctx.response.body = tickets;
    return;
  };

  // PUT
  if (ctx.method === 'PUT') {
    const { id, name, description } = ctx.request.body;
    const index = tickets.findIndex((item) => item.id === id);
    console.log(index);
    tickets[index].name = name;
    tickets[index].description = description;
    ctx.response.body = 'ok';
    return;
  }

  // PATCH
  if (ctx.method === 'PATCH') {
    const { id, status } = ctx.request.query;
    const index = tickets.findIndex((item) => item.id === id);
    tickets[index].status = status;
    ctx.response.body = 'ok';
    return;
  }

  // DELETE
  if (ctx.method === 'DELETE') {
    const { id } = ctx.request.query;
    tickets = tickets.filter((item) => item.id !== id);
    ctx.response.body = 'ok';
    return;
  }
});