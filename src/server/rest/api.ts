

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
import { Request, Response, Application} from "express"
import * as errors from "restify-errors"
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as multer from "multer";
import * as fs from "fs";


const upload = multer({ dest: "upload/" });
const SECRET_KEY = "SWE573"


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
    app.get(`/${i.toLowerCase()}/:id`, async function (req: Request, res: Response) {
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
      res.status(200).send(queryResult)
    });
  })

  Object.keys(entities).forEach(i => {
    app.get(`/${i.toLowerCase()}`, async function (req: Request, res: Response) {
      const queryResult = await entities[i].findAll({ attributes: Object.keys(entities[i].rawAttributes).filter(j => j != "password") })
      // if (i ==="Post")
      //   queryResult = { ...queryResult.dataValues, fieldValues: (await Promise.all(queryResult.getFieldValues())).map((i:any) => i.dataValues)}
      queryResult.forEach(element => {
        if (element.image) console.log(element.image)
      });
      if (i === "Community") {
        const AuthHeader = req.header("Authorization")

        if (AuthHeader) {
          const token = AuthHeader.split(" ")[1]
          const user = jwt.verify(token, SECRET_KEY) as User
          await Promise.all(queryResult.map(async element => {
            const member = await DAL.CommunityMember.findOne({ where: { UserId: user.id, CommunityId: element.id } })
            element.member = !!member
          }));
        }
      }
      res.status(200).send(queryResult)
    });
  })

  Object.keys(entities).filter(i => !["Post"].includes(i)).forEach(i => {
    app.post(`/${i.toLowerCase()}`, upload.single("image"), async function (req: Request, res: Response) {
      const user = getUser(req);
      const image = req.file;
      if (i === "User") req.body.isAdmin = false
      else if (i === "PostType"){
        const { fields, ...postType } = req.body
        req.body.fields = undefined
        const createdPostType = await PostType.create(postType)
        const createdFields =await Promise.all(fields.map((field:any) => Field.create({name: field.name, fieldTypeId: field.type, postTypeId: createdPostType.id})))
        res.status(200).send({...createdPostType.dataValues, fields: createdFields })
      }
      else if (i === "Community"){
        const existingCommunity = await Community.findOne({ where: { name: req.body.name } })
        const community = req.body;
        if (existingCommunity) {
          res.status(500).send(new errors.InvalidArgumentError("Community name exists. Please choose a new community name."))
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
      else{
        const entity = await entities[i].create(req.body)
        res.status(200).send(entity.dataValues)
      }
    });
  });


  app.post("/login", upload.single(""), async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
      return res.status(404).send({
        message: "Username and password can not be empty!",
      });
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
          // return next(new errors.UnauthorizedError("User not found. Authentication failed."))
          return res.status(401).send({
            message: "User not found. Authentication failed.",
          })
        }
        if (!bcrypt.compareSync(password, user.password) && password !== user.password) {
          // return next(new errors.UnauthorizedError("Wrong password. Authentication failed."))
          return res.status(401).send({
            message: "Wrong password. Authentication failed.",
          })
        }
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            fullName: user.fullName
          },
          SECRET_KEY,
          { expiresIn: "2h" }
        )
        res.status(200).send({ message: "success", token: token });
        // return next()

      }
      catch (error) {
        // return next(new errors.BadRequestError(error))
      }
    }
  });

  app.get(`/community/:id/posttype`, async function (req: Request, res: Response) {
    const c = await Community.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getPostTypes();
    res.status(200).send(queryResult)
  });

  app.get(`/posttype/:id/field`, async function (req: Request, res: Response) {
    const c = await PostType.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getFields();
    res.status(200).send(queryResult)
  });
  app.get(`/posttype/community/:id`, async function (req: Request, res: Response) {
    const c = await Community.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getPostTypes();
    res.status(200).send(queryResult)
  });

  
  app.get(`/field/:id/fieldtype`, async function (req: Request, res: Response) {
    const c = await Field.findByPk(req.params.id, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
    const queryResult = await c.getFieldType();
    res.status(200).send(queryResult)
  });

  app.post(`/post`, async function (req: Request, res: Response) {
    const { fieldValues: iFieldValues, ...iPost } = req.body;
    const post = await Post.create(iPost);

    const fieldValueSubclasses = { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue }
    const fieldValues = await Promise.all(iFieldValues.map(async (iFieldValue: any) => {
      const field = await Field.findByPk(iFieldValue.fieldId);
      const fieldType = await field.getFieldType();
      return await fieldValueSubclasses[`${DataType[fieldType.dataType]}Value`].create({ ...iFieldValue, postId: post.id })
    }));

    const result = { ...post.dataValues, fieldValues: fieldValues.map((i: any) => i.dataValues) }
    res.status(200).send(result)
  });

  app.get(`/community/:id/join`, async function (req: Request, res: Response) {
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
  app.delete(`/community/:id/leave`, async function (req: Request, res: Response) {
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
    catch{
      res.status(500).send({status: "error"})
    }
  });




}

export { initAPI }

