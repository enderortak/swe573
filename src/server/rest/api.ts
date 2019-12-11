

import { DAL } from "../dal/DbContext";
import { User } from "../domain/User";
import { Comment } from "../domain/Comment";
import { Community } from "../domain/Community";
import { Field } from "../domain/Field";
import { FieldType } from "../domain/FieldType";
import { Like } from "../domain/Like";
import { Post } from "../domain/Post";
import { PostType } from "../domain/PostType";
import { DataType } from "../domain/DataType";
import { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue } from "../domain/FieldValue";
import { Server } from "restify";
import * as errors from 'restify-errors'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from "bcrypt"

const entities = { Comment, Community, Field, FieldType, Like, Post, PostType, User, StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue }

async function initAPI(server : Server){
  const dal = new DAL();

  await dal.init()
  
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
        // if (i ==="Post")
        //   queryResult = { ...queryResult.dataValues, fieldValues: (await Promise.all(queryResult.getFieldValues())).map((i:any) => i.dataValues)}
        res.send(queryResult)
        return next();
      });    
    })
  
    const { Post:_post, ...entities_except_post} = entities
    Object.keys(entities_except_post).forEach(i => {
      server.post(`/${i.toLowerCase()}`, async function(req, res, next) {
        if (i === "User") req.body.isAdmin = false
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
  
    
    server.post("/login", async (req :any, res:any, next) => {
      if (!req.body.username || !req.body.password) {
          return res.status(404).send({
          message: 'Username and password can not be empty!',
          });
      } else {
          const username = req.body.username;
          try {
            const password = req.body.password;
            const potentialUser = {
                where: {
                    username: username
                },
                attributes: ['username', 'id', "password"]
            };
            const user = await User.findOne(potentialUser)
            if(!user) {
                return next(new errors.UnauthorizedError("User not found. Authentication failed."))
            }
            if(!bcrypt.compareSync(password, user.password)){
              return next(new errors.UnauthorizedError("Wrong password. Authentication failed."))
            }
            const token = jwt.sign(
                {
                  id: user.id,
                  username: user.username
                }, 
                'secret_key',
                {expiresIn :"2h"}
              )
            res.send({ message: 'success', token: token});
            return next()

          }
          catch (error) {
            return next(new errors.BadRequestError(error))
          }
      }
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
    
    server.post(`/post`, async function(req, res, next) {
      const {fieldValues: iFieldValues, ...iPost} = req.body;
      const post = await Post.create(iPost);
      
      const fieldValueSubclasses = { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue }
      const fieldValues = await Promise.all(iFieldValues.map(async (iFieldValue: any) => {
        const field = await Field.findByPk(iFieldValue.fieldId);
        const fieldType = await field.getFieldType();
        return await fieldValueSubclasses[`${DataType[fieldType.dataType]}Value`].create({...iFieldValue, postId: post.id})
      }));
  
      const result = { ...post.dataValues, fieldValues: fieldValues.map((i:any) => i.dataValues) }
      res.send(result)
      return next();
    });
  
    
  


}

export { initAPI }
