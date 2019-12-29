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
import { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue, FieldValue } from "../domain/FieldValue";
import { Request, Response, Application, NextFunction, response} from "express"
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as multer from "multer";
import * as createHttpError from "http-errors";


const upload = multer({ dest: "upload/" });
const SECRET_KEY = "SWE573"

const sendError = (res: Response, status: number, message: string) => res.status(status).send({status, message})

const entities = { Comment, Community, Field, FieldType, Like, Post, PostType, User, StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue }

async function initAPI(app: Application) {
  const dal = new DAL();

  await dal.init()

  const getUser = (req: Request) =>{
    const AuthHeader = req.header("Authorization")

    if (AuthHeader) {
      const token = AuthHeader.split(" ")[1]
      try{
        return jwt.verify(token, SECRET_KEY) as User
      }
      catch { return null}
    }
    else return null
  }
  Object.keys(entities).forEach(i => {
    app.get(`/${i.toLowerCase()}/:id`, async function (req: Request, res: Response, next: NextFunction ) {
      const queryResult = await entities[i].findByPk(req.params["id"], {
        rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
        attributes: Object.keys(entities[i].rawAttributes).filter(j => j != "password")
      })
      const user = getUser(req);
      if (i === "Community") {
        if (user){
          const member = await DAL.CommunityMember.findOne({ where: { UserId: user.id, CommunityId: queryResult.id } })
          const community = await Community.findOne({ where: { id: queryResult.id } })
          queryResult.dataValues.isMember = !!member
          queryResult.dataValues.isOwner = community.createdById === user.id
        }
      }
      else if (i === "PostType"){
        const postTypeFields = await Promise.all((await(<PostType>queryResult).getFields()).map(async i => {
          const fieldType = await FieldType.findByPk(i.dataValues.fieldTypeId)
          return {...i.dataValues, fieldType: fieldType.name }
        }));
        queryResult.dataValues.fields = postTypeFields;
      }

      res.status(200).send(queryResult.dataValues)
      
    });
  })

  Object.keys(entities).forEach(i => {
    app.get(`/${i.toLowerCase()}`, async function (req: Request, res: Response, next: NextFunction) {
      const queryResult = await entities[i].findAll({ attributes: Object.keys(entities[i].rawAttributes).filter(j => j != "password") })
      const user = getUser(req);
      if (i === "Community") {
        if (user) {
          await Promise.all(queryResult.map(async community => {
            const member = await DAL.CommunityMember.findOne({ where: { UserId: user.id, CommunityId: community.id } })
            community.dataValues.isMember = !!member
            community.dataValues.isOwner = community.createdById === user.id
            const postTypes = await community.getPostTypes()
            await Promise.all(postTypes.map(async postType => {
              const fields = await postType.getFields()
              await Promise.all(fields.map(async field => {
                field.dataValues.fieldType = await field.getFieldType()
              }))
              
              postType.dataValues.fields = fields
            }))
            community.dataValues.postTypes = postTypes
          }));
        }
      }
      else if (i === "Post") {

          await Promise.all(queryResult.map(async (post) => {
            post.dataValues.fieldValues = await post.getFieldValues()
            post.dataValues.community = await post.getCommunity()
            post.dataValues.owner = await User.findByPk(post.createdById)
            post.dataValues.likes = await post.getLikes()
            if (user) {
              post.dataValues.isOwner = post.dataValues.owner.id === user.id
              post.dataValues.hasLiked = post.dataValues.likes.map(i => i.createdById).includes(user.id)
            }
          }));

      }
      res.status(200).send(queryResult)
      
    });
  })
// POST REQUESTS
  Object.keys(entities).forEach(i => {
    app.post(`/${i.toLowerCase()}`, upload.single("image"), async function (req: Request, res: Response, next: NextFunction) {
      const user = getUser(req);
      const image = req.file;
      if (i === "User"){
        const existingUser = await User.findOne({ where: { username: req.body.username } })
        const user = req.body;
        if (existingUser) {
          sendError(res, 400, "Username name exists. Please choose a new username.")
        }
        user.isAdmin = false
        const createdUser = await entities[i].create(user)
        res.status(200).send(createdUser.dataValues)
      } 
      else if (i === "PostType"){
        const { fields, ...postType } = req.body
        const parsedFields = JSON.parse(fields)
        const createdPostType = await PostType.create(postType)
        const createdFields =await Promise.all(parsedFields.map((field:any) => Field.create({name: field.name, fieldTypeId: field.type, postTypeId: createdPostType.id})))
        res.status(200).send({...createdPostType.dataValues, fields: createdFields })
        
      }
      else if (i === "Community"){
        const existingCommunity = await Community.findOne({ where: { name: req.body.name } })
        const community = req.body;
        if (existingCommunity) {
          sendError(res, 400, "Community name exists. Please choose a new community name.")
        }
        community.createdById = user.id
        community.updatedById = user.id
        community.image = image ? image.filename : ""
        const createdCommunity = await Community.create(community)
        const basicPostType = await PostType.create({
          name: "Basic",
          communityId: createdCommunity.id,
        })
        const shortTextFieldType = await FieldType.findOne({ where: { name: "Short Text" } });
        const longTextFieldType = await FieldType.findOne({ where: { name: "Long Text" } });
        await Field.create({name: "Title", fieldTypeId: shortTextFieldType.id, postTypeId: basicPostType.id })
        await Field.create({name: "Content", fieldTypeId: longTextFieldType.id, postTypeId: basicPostType.id })
        res.status(200).send(createdCommunity.dataValues)
      }
      else if (i === "Like"){
        if (user){
          Like.create({
            postId: req.params["id"],
            createdById: user.id,
            updatedById: user.id
          })
        }
      }
      else if (i === "Post") {
        const { fieldValues: jsonFieldValues, ...iPost } = req.body;
        if (user){
          iPost.createdById = user.id
          iPost.updatedById = user.id
          iPost.image = image ? image.filename : ""
          
          const post = await Post.create(iPost);

          const iFieldValues = JSON.parse(jsonFieldValues)
          const fieldValueSubclasses = { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue }
          const fieldValues = await Promise.all(iFieldValues.map(async (iFieldValue: any) => {
            const field = await Field.findByPk(iFieldValue.fieldId);
            const fieldType = await field.getFieldType();
            return await fieldValueSubclasses[`${DataType[fieldType.dataType]}Value`].create({ ...iFieldValue, postId: post.id })
          }));
  
          const result = { ...post.dataValues, fieldValues: fieldValues.map((i: any) => i.dataValues) }
          res.status(200).send(result)
        }
      }
      else{
        const createdEntity = await entities[i].create(req.body)
        res.status(200).send(createdEntity.dataValues)
      }
    });
  });


  app.post("/like/:id", upload.single("image"), async function (req: Request, res: Response, next: NextFunction) {
    const user = getUser(req);
    
      if (user){
        await Like.create({
          postId: req.params["id"],
          createdById: user.id,
          updatedById: user.id
        })
      }
      res.status(200).send({status: "success"})
  });

  app.delete("/like/:id", upload.single("image"), async function (req: Request, res: Response, next: NextFunction) {
    const user = getUser(req);
    
      if (user){
        await Like.destroy(
          {
            where: {
              postId: req.params["id"],
              createdById: user.id,
            }
          })
          res.status(200).send({status: "success"})
      }
      
    
  });

  app.post("/login", upload.single(""), async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username || !req.body.password) {
      sendError(res, 400, "Username and password can not be empty!")
    } else {
      const username = req.body.username;
      try {
        const password = req.body.password;
        const potentialUser = {
          where: {
            username: username
          },
          attributes: ["username", "id", "password", "firstName", "lastName"]
        };
        const user = await User.findOne(potentialUser)
        if (!user) {
          sendError(res, 401, "User not found. Authentication failed.")
        }
        if (!bcrypt.compareSync(password, user.password) && password !== user.password) {
          sendError(res, 401, "Wrong password. Authentication failed.")
        }
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            fullName: user.fullName
          },
          SECRET_KEY
          // { expiresIn: "2h" }
        )
        res.status(200).send({ message: "Login successful", token: token })
        

      }
      catch (error) {
        sendError(res, 400, error)
      }
    }
  });

  app.get(`/community/:id/posttype`, async function (req: Request, res: Response, next: NextFunction) {
    const c = await Community.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getPostTypes();
    res.status(200).send(queryResult)
    
  });
  const fetch = require('node-fetch');

  const wbk = require('wikibase-sdk')({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
  })

  const queryString = require("query-string")
  const wikidataApiEntryPoint = "https://www.wikidata.org/w/api.php"
  app.get("/wikidata/:numberOfResults/:query", async function(req, res){
    
    const sparqlQuery = `
      SELECT * WHERE {
        ?s ?label "${req.params.query}"@en .
        ?s ?p ?o
      }
    `
    const apiOptions = {
      action: "wbsearchentities",
      format: "json",
      language: "en",
      limit: req.params.numberOfResults,
      search: req.params.query
    }

    const response = await fetch(`${wikidataApiEntryPoint}?${queryString.stringify(apiOptions)}`)
    const results = await response.json()

    res.status(200).send(results.search)
  })

  app.get(`/posttype/:id/field`, async function (req: Request, res: Response, next: NextFunction) {
    const c = await PostType.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getFields();
    res.status(200).send(queryResult)
    
  });

  app.get(`/posttype/community/:id`, async function (req: Request, res: Response, next: NextFunction) {
    const c = await Community.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getPostTypes();
    res.status(200).send(queryResult)
    
  });

  
  app.get(`/field/:id/fieldtype`, async function (req: Request, res: Response, next: NextFunction) {
    const c = await Field.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getFieldType();
    res.status(200).send(queryResult.dataValues)
    
  });

  // app.post(`/post`, async function (req: Request, res: Response, next: NextFunction) {
  //   const { fieldValues: iFieldValues, ...iPost } = req.body;
  //   const user = getUser(req);
  //   if (user){
  //     iPost.createdById = user.id
  //     iPost.updatedById = user.id
  //     const post = await Post.create(iPost);

  //       const fieldValueSubclasses = { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue }
  //       const fieldValues = await Promise.all(iFieldValues.map(async (iFieldValue: any) => {
  //         const field = await Field.findByPk(iFieldValue.fieldId);
  //         const fieldType = await field.getFieldType();
  //         return await fieldValueSubclasses[`${DataType[fieldType.dataType]}Value`].create({ ...iFieldValue, postId: post.id })
  //       }));

  //       const result = { ...post.dataValues, fieldValues: fieldValues.map((i: any) => i.dataValues) }
  //       res.status(200).send(result)
  //   }
  // });

  app.get(`/community/:id/join`, async function (req: Request, res: Response, next: NextFunction) {
    const communityId = req.params.id
    const token = req.header("Authorization").split(" ")[1]
    const user = jwt.verify(token, SECRET_KEY) as User
    const joinInfo = await DAL.CommunityMember.create({
      createdById: user.id,
      updatedById: user.id,
      UserId: user.id,
      CommunityId: communityId
    })
    if (joinInfo.id) {
      res.status(200).send({status: "success"})
      
    }
  });
  app.delete(`/community/:id/leave`, async function (req: Request, res: Response, next: NextFunction) {
    const communityId = req.params.id
    const token = req.header("Authorization").split(" ")[1]
    const user = jwt.verify(token, SECRET_KEY) as User
    try {
      await DAL.CommunityMember.destroy({
        where: {
          UserId: user.id,
          CommunityId: communityId
        }
      })
      res.status(200).send({status: "success"})
      
    }
    catch (error) {
      sendError(res, 500, error)
    }
  });




}

export { initAPI }

