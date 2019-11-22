import { DAL } from "../dal/DbContext"
import { Comment } from "./Comment"
import { User } from "./User"
import { Post } from "./Post"
import { exportAllDeclaration } from "@babel/types"
import { Community } from "./Community"
import { PostType } from "./PostType"


test("Create comment succesfully", async () => {
    const dal = new DAL()
    await dal.init()
    await dal.DbContext.sync({force: true})
    const owner = await User.create({
        username: "username1",
        password: "password1",
        firstName: "firstname1",
        lastName: "lastname1",
        email: "email1",
        isAdmin: false
    });
    
    const community = await Community.create({
      name: "Community1",
      description: "Description1",
      createdById: owner.id,
      UpdatedById: owner.id
    })
    const postType = await PostType.create({
      name: "PostType1",
      communityId: community.id
    })
    const post = await Post.create({
      title: "PostTitle1",
      CreatedById: owner.id,
      updatedById: owner.id,
      communityId: community.id,
      postTypeId: postType.id
    })

    const comment = await Comment.create({
        content: "CommentContent1",
        postId: post.id,
        createdById: owner.id,
        updatedById: owner.id,
    })

    const _comment = await Comment.findByPk(comment.id, {
        include: [Comment.associations.createdBy, Comment.associations.updatedBy],
        rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
      })
    
    expect(_comment.content).toBe("CommentContent1")
})