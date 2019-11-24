import restify = require("restify");
import corsMiddleware = require("restify-cors-middleware");

import { DAL } from "../dal/DbContext";
import { User } from "../domain/User";
import { Comment } from "../domain/Comment";
import { Community } from "../domain/Community";
import { Field } from "../domain/Field";
import { FieldType } from "../domain/FieldType";
import { Like } from "../domain/Like";
import { Post } from "../domain/Post";
import { PostType } from "../domain/PostType";

const entities = { Comment, Community, Field, FieldType, Like, Post, PostType, User }




const server = restify.createServer()
var cors = corsMiddleware({
  preflightMaxAge: 5, // Optional
  origins: ['*'], // Should whitelist actual domains in production
  allowHeaders: ['Authorization', 'API-Token', 'Content-Range'], //Content-range has size info on lists
  exposeHeaders: ['Authorization', 'API-Token-Expiry', 'Content-Range']
})

server.pre(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.queryParser()); //{mapParams: true}
server.use(restify.plugins.bodyParser());  //{mapParams: true, mapFiles: true}
server.use(restify.plugins.acceptParser(server.acceptable));

const dal = new DAL();

dal.init().then(() => {

  Object.keys(entities).forEach(i => {
    server.get(`/${i.toLowerCase()}/:id`, async function(req, res, next) {    
      const queryResult = await entities[i].findByPk(req.params["id"], {
        rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
        attributes: Object.keys(entities[i].rawAttributes).filter(j => j != "password")
      })
      res.send(queryResult)
      return next();
    });    
  })

  Object.keys(entities).forEach(i => {
    server.get(`/${i.toLowerCase()}`, async function(req, res, next) {    
      const queryResult = await entities[i].findAll({attributes: Object.keys(entities[i].rawAttributes).filter(j => j != "password")})
      res.send(queryResult)
      return next();
    });    
  })

  Object.keys(entities).forEach(i => {
    server.post(`/${i.toLowerCase()}`, async function(req, res, next) {    
      const entity = await entities[i].create(req.body)
      res.send(entity)
      return next();
    });    
  })

  // server.get(`/`, async function(req, res, next) {
  //   const c = await Community.findByPk(1);
  //   const u = await User.findByPk(1);
  //   const queryResult = c.addMember(u)
  //   res.send(queryResult)
  //   return next();
  // });

  server.get(`/test`, async function(req, res, next) {
    const c = await Community.findByPk(1, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getPosts();
    res.send(queryResult)
    return next();
  });

  server.get(`/community/:id/posttype`, async function(req, res, next) {
    const c = await Community.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getPostTypes();
    res.send(queryResult)
    return next();
  });

  server.get(`/posttype/:id/field`, async function(req, res, next) {
    const c = await PostType.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getFields();
    res.send(queryResult)
    return next();
  });

  server.get(`/field/:id/fieldtype`, async function(req, res, next) {
    const c = await Field.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getFieldType();
    res.send(queryResult)
    return next();
  });
  
  server.listen(4000, function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
  });
})