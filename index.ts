import { DAL } from "./src/dal/DbContext";
import { User } from "./src/domain/User";
import { Community } from "./src/domain/Community";
import { PostType } from "./src/domain/PostType";
import { Field } from "./src/domain/Field";
import { FieldType } from "./src/domain/FieldType";
import { DataType } from "./src/domain/DataType";
import { StringData, IntegerData } from "./src/domain/FieldValue";



async function stuff() {
  const dal = new DAL()
  await dal.init()
  await (async () => {
        try {
          await dal.DbContext.sync({ force: true })
      } catch(e) {
        console.log("qwe" + e);
      }
      })()

    try {
    const owner = await User.create({
        username: "username1",
        password: "password1",
        firstName: "firstname1",
        lastName: "lastname1",
        email: "email1",
        isAdmin: false
    });

    const community = await Community.create({
        name: "community1",
        description: "description1",
        createdById: owner.id,
        updatedById: owner.id
    });
    
    // console.log(community.Id, community.Name, community.Description);
    
  
  
    // const ourCommunity = await Community.findByPk(1, {
    //   include: [Community.associations.Owner],
    //   rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    // }).catch((error) => {
    //     console.log(error)
    //   });
    //   console.log(ourCommunity.Owner.Username, ourCommunity.Owner.FirstName, ourCommunity.Owner.Name);

    const cv = await PostType.create({
      name: "CV",
      communityId: community.id
    })

    const shortText = await FieldType.create({
      name: "Short Text",
      dataType: DataType.String
    })
    const email = await FieldType.create({
      name: "Email",
      dataType: DataType.String
    })

    const wholeNumber = await FieldType.create({
      name: "Whole Number",
      dataType: DataType.Integer
    })


    const cName = await Field.create({
      name: "Candidate Name",
      fieldTypeId: shortText.id,
      postTypeId: cv.id
    })

    const cEmail = await Field.create({
      name: "Candidate Email",
      fieldTypeId: email.id,
      postTypeId: cv.id
    })

    const cAge = await Field.create({
      name: "Candidate Age",
      fieldTypeId: wholeNumber.id,
      postTypeId: cv.id
    })

    const cNameValue1 = await StringData.create({
      postId: 1,
      fieldId: cName.id,
      value: "Earlier candidate"
    })

    const cNameValue2 = await StringData.create({
      postId: 1,
      fieldId: cName.id,
      value: "New candidate"
    })

    const cEmailValue1 = await StringData.create({
      postId: 1,
      fieldId: cEmail.id,
      value: "Earlier candidate email"
    })

    const cEmailValue2 = await StringData.create({
      postId: 1,
      fieldId: cEmail.id,
      value: "New candidate email"
    })
    const cAgeValue1 = await IntegerData.create({
      postId: 1,
      fieldId: cAge.id,
      value: 20
    })

    const cAgeValue2 = await IntegerData.create({
      postId: 1,
      fieldId: cAge.id,
      value: 21
    })

    const p = await community.getPostTypes()
    p.forEach(element => {
      console.log(element.name)
    });

    const _field1 = await Field.findByPk(1, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
      console.log("field 1 values")
      const fieldValues1 = await _field1.getValues()
      fieldValues1.forEach(i => {
        console.log(i.value);
      });
      const _field2 = await Field.findByPk(2, {
        rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
      })
        console.log("field 2 values")
        const fieldValues2 = await _field2.getValues()
        fieldValues2.forEach(i => {
          console.log(i.value);
        });
        const _field3 = await Field.findByPk(3, {
          rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
        })
          console.log("field 3 values")
          const fieldValues3 = await _field3.getValues()
          fieldValues3.forEach(i => {
            console.log(i.value);
          });



    } catch(e) {
        console.log("asd" + e);
      }
  }
  stuff();