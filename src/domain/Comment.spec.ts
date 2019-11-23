// import { DAL } from "../dal/DbContext"
// import { Comment } from "./Comment"
// import { User } from "./User"
// import { Post } from "./Post"
// import { exportAllDeclaration } from "@babel/types"
// import { Community } from "./Community"
// import { PostType } from "./PostType"


// test("Create comment succesfully", async () => {
//     const dal = new DAL()
//     await dal.init()
//     await dal.DbContext.sync({force: true})
//     const owner = await User.create({
//         Username: "username1",
//         Password: "password1",
//         FirstName: "firstname1",
//         LastName: "lastname1",
//         Email: "email1",
//         IsAdmin: false
//     });
    
//     const community = await Community.create({
//       Name: "Community1",
//       Description: "Description1",
//       CreatedById: owner.Id,
//       UpdatedById: owner.Id
//     })
//     const postType = await PostType.create({
//       Name: "PostType1",
//       CommunityId: community.Id
//     })
//     const post = await Post.create({
//       Title: "PostTitle1",
//       CreatedById: owner.Id,
//       UpdatedById: owner.Id,
//       CommunityId: community.Id,
//       PostTypeId: postType.Id
//     })

//     const comment = await Comment.create({
//         Content: "CommentContent1",
//         PostId: post.Id,
//         CreatedById: owner.Id,
//         UpdatedById: owner.Id,
//     })

//     const _comment = await Comment.findByPk(comment.Id, {
//         include: [Comment.associations.CreatedBy, Comment.associations.UpdatedBy],
//         rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
//       })
    
//     expect(_comment.Content).toBe("CommentContent1")
// })