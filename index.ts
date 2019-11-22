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
        Username: "username1",
        Password: "password1",
        FirstName: "firstname1",
        LastName: "lastname1",
        Email: "email1",
        IsAdmin: false
    });

    const community = await Community.create({
        Name: "community1",
        Description: "description1",
        CreatedById: owner.Id,
        UpdatedById: owner.Id
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
      Name: "CV",
      CommunityId: community.Id
    })

    const shortText = await FieldType.create({
      Name: "Short Text",
      DataType: DataType.String
    })
    const email = await FieldType.create({
      Name: "Email",
      DataType: DataType.String
    })

    const wholeNumber = await FieldType.create({
      Name: "Whole Number",
      DataType: DataType.Integer
    })


    const cName = await Field.create({
      Name: "Candidate Name",
      FieldTypeId: shortText.Id,
      PostTypeId: cv.Id
    })

    const cEmail = await Field.create({
      Name: "Candidate Email",
      FieldTypeId: email.Id,
      PostTypeId: cv.Id
    })

    const cAge = await Field.create({
      Name: "Candidate Age",
      FieldTypeId: wholeNumber.Id,
      PostTypeId: cv.Id
    })

    const cNameValue1 = await StringData.create({
      PostId: 1,
      FieldId: cName.Id,
      Value: "Earlier candidate"
    })

    const cNameValue2 = await StringData.create({
      PostId: 1,
      FieldId: cName.Id,
      Value: "New candidate"
    })

    const cEmailValue1 = await StringData.create({
      PostId: 1,
      FieldId: cEmail.Id,
      Value: "Earlier candidate email"
    })

    const cEmailValue2 = await StringData.create({
      PostId: 1,
      FieldId: cEmail.Id,
      Value: "New candidate email"
    })
    const cAgeValue1 = await IntegerData.create({
      PostId: 1,
      FieldId: cAge.Id,
      Value: 20
    })

    const cAgeValue2 = await IntegerData.create({
      PostId: 1,
      FieldId: cAge.Id,
      Value: 21
    })

    const p = await community.getPostTypes()
    p.forEach(element => {
      console.log(element.Name)
    });

    const _field1 = await Field.findByPk(1, {
      rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    })
      console.log("field 1 values")
      const fieldValues1 = await _field1.getValues()
      fieldValues1.forEach(i => {
        console.log(i.Value);
      });
      const _field2 = await Field.findByPk(2, {
        rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
      })
        console.log("field 2 values")
        const fieldValues2 = await _field2.getValues()
        fieldValues2.forEach(i => {
          console.log(i.Value);
        });
        const _field3 = await Field.findByPk(3, {
          rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
        })
          console.log("field 3 values")
          const fieldValues3 = await _field3.getValues()
          fieldValues3.forEach(i => {
            console.log(i.Value);
          });

    //   const _field2 = await Field.findByPk(2, {
    //     include: [Field.associations.FieldValues],
    //     rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    //   }).catch((error) => {
    //       console.log(error)
    //     });
    //     console.log("field 2 values")
    //     _field2.FieldValues.forEach(i => {
    //       console.log(i.Value);
    //     });
    
    //   const _field3 = await Field.findByPk(3, {
    //     include: [Field.associations.FieldValues],
    //     rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
    //   }).catch((error) => {
    //       console.log(error)
    //     });
    //     console.log("field 3 values")
    //     _field3.FieldValues.forEach(i => {
    //       console.log(i.Value);
    //     });


    } catch(e) {
        console.log("asd" + e);
      }
  }
  stuff();