import { User } from "../domain/User";
import { Community } from "../domain/Community";
import { PostType } from "../domain/PostType";
import { FieldType } from "../domain/FieldType";
import { DataType } from "../domain/DataType";
import { Field } from "../domain/Field";
import { Post } from "../domain/Post";
import { StringValue, IntegerValue, DateTimeValue } from "../domain/FieldValue";
import * as bcrypt from "bcrypt"

const randomFrom = (arr :Array<any>) => arr[Math.floor(Math.random() * arr.length)];
const _users = [
    {
      "username": "ender",
      "password": "asdasdasd",
      "firstName": "Vera",
      "lastName": "Mcfarland",
      "email": "vera.mcfarland@gmail.com",
      "isAdmin": false
    },
    {
      "username": "boone",
      "password": "4761fdd7-58e9-4185-bf72-c92e1c916999",
      "firstName": "Lynette",
      "lastName": "Le",
      "email": "lynette.le@gmail.com",
      "isAdmin": true
    },
    {
      "username": "bettie",
      "password": "440e5c0b-4454-4be1-9e63-0f40b22204da",
      "firstName": "Sheri",
      "lastName": "Sherman",
      "email": "sheri.sherman@gmail.com",
      "isAdmin": true
    },
    {
      "username": "klein",
      "password": "466397d9-2d06-4a43-98db-56d97c8a3a9d",
      "firstName": "Claire",
      "lastName": "Oneal",
      "email": "claire.oneal@gmail.com",
      "isAdmin": true
    },
    {
      "username": "holloway",
      "password": "d14c2188-8ad0-43cd-ba5e-cda17e46745a",
      "firstName": "Haley",
      "lastName": "Moses",
      "email": "haley.moses@gmail.com",
      "isAdmin": true
    },
    {
      "username": "owens",
      "password": "e61ef4c5-1d17-464e-8c71-df498a8bb5fa",
      "firstName": "Claudia",
      "lastName": "Britt",
      "email": "claudia.britt@gmail.com",
      "isAdmin": false
    }
  ];

const _communities = [
    {
      "name": "velit culpa",
      "description": "Excepteur laborum id anim laborum. Et adipisicing ullamco elit veniam do aute nisi adipisicing qui cillum magna ex amet id. Eu non laborum Lorem ad irure ut laboris Lorem eu.\r\n"
    },
    {
      "name": "reprehenderit labore",
      "description": "Eiusmod duis aliquip anim anim qui aliqua aliquip excepteur ut veniam ea duis ullamco. Esse anim sunt excepteur minim enim minim amet est. Ea non do ad officia qui ex.\r\n"
    },
    {
      "name": "sint id",
      "description": "Nisi aliquip nostrud ullamco qui dolore nostrud sit. Anim ipsum Lorem dolore irure ipsum incididunt ad aliquip non. Minim laboris esse ex do id aliquip in adipisicing. Sunt pariatur aute ut ea dolore aute tempor magna id sint esse tempor.\r\n"
    },
    {
      "name": "ex laboris",
      "description": "Veniam esse quis magna esse id dolor ipsum in cupidatat esse mollit cupidatat ad. Amet sunt pariatur laborum duis labore deserunt nulla non laborum. Irure excepteur sint ad dolor aute quis sunt cillum ullamco id voluptate id. Qui incididunt cupidatat laborum nisi reprehenderit aliqua adipisicing cupidatat aliqua ea non excepteur minim. Qui pariatur fugiat commodo et anim minim. Laborum elit magna officia irure veniam cillum mollit cillum laborum veniam dolor proident deserunt cillum. Mollit reprehenderit officia incididunt dolore sit dolore.\r\n"
    },
    {
      "name": "laborum excepteur",
      "description": "Do ut ea consequat ipsum enim sit anim pariatur exercitation labore velit mollit. Magna id amet consequat nisi est nisi. Velit pariatur amet aliquip dolore elit incididunt sunt esse dolore ex qui eiusmod cupidatat aliqua.\r\n"
    },
    {
      "name": "officia sunt",
      "description": "Eu et velit amet fugiat id sint irure sunt officia eu nostrud. Consequat laborum eiusmod mollit ad. Velit ullamco dolore labore commodo pariatur Lorem voluptate deserunt ea excepteur commodo sint esse nostrud. Id qui sit occaecat occaecat aliqua proident in ea Lorem enim. Nisi minim qui eu veniam excepteur laborum cupidatat nisi adipisicing. Voluptate ut voluptate pariatur ad deserunt occaecat et fugiat aliqua fugiat.\r\n"
    }
  ]

const _fieldTypes = [
    { name: "Short Text", dataType: DataType.String },
    { name: "Long Text", dataType: DataType.String },
    { name: "Whole Number", dataType: DataType.Integer },
    { name: "Decimal Number", dataType: DataType.Float },
    { name: "URI", dataType: DataType.String },
    { name: "Email", dataType: DataType.String },
    { name: "Geolocation", dataType: DataType.String },
    { name: "Date", dataType: DataType.DateTime },
    { name: "Date and Time", dataType: DataType.DateTime },
    { name: "Image", dataType: DataType.Blob },
    { name: "Video", dataType: DataType.Blob },
    { name: "Yes/No", dataType: DataType.Boolean },
    { name: "Gender", dataType: DataType.Boolean }
]

export default class DemoInitializer {
    async init(){
        const users = await Promise.all(_users.map(async i => await User.create({...i, password: await bcrypt.hash(i.password, 10)})))
        const communities = await Promise.all(_communities.map(async i => await Community.create({...i, createdById: randomFrom(users).id, updatedById: randomFrom(users).id})))
        const fieldTypes = await Promise.all(_fieldTypes.map(async i => await FieldType.create(i)));
        
        const birdCommunity = await Community.create({
          createdById: users[0].dataValues.id,
          updatedById: users[0].dataValues.id,
          name: "Celebrate Urban Birds",
          description: `Primary purpose of Celebrate Urban Birds is to reach diverse urban audiences who do not already participate in science or scientific investigation.\\nAnother of our goals is to collect high-quality data from participants that will provide us with valuable knowledge of how different environments will influence the location of birds in urban areas.`
        })
        const birdCommunityBasic = await PostType.create({
          name: "Basic",
          communityId: birdCommunity.id
        })
        await Field.create({ name: "Title", fieldTypeId: fieldTypes.filter(i => i.dataValues.name === "Short Text")[0].id, postTypeId: birdCommunityBasic.id})
        await Field.create({ name: "Content", fieldTypeId: fieldTypes.filter(i => i.dataValues.name === "Long Text")[0].id, postTypeId: birdCommunityBasic.id})
        const birdObservationEvent = await PostType.create({
          name: "Bird Observation Event",
          communityId: birdCommunity.id
        })
        const birdObservationEventDate = await Field.create({ name: "Event Date", fieldTypeId: fieldTypes.filter(i => i.dataValues.name === "Date")[0].id, postTypeId: birdObservationEvent.id})
        const birdObservationEventLocation = await Field.create({ name: "Event Location", fieldTypeId: fieldTypes.filter(i => i.dataValues.name === "Geolocation")[0].id, postTypeId: birdObservationEvent.id})
        const birdObservationEventDetails = await Field.create({ name: "Details", fieldTypeId: fieldTypes.filter(i => i.dataValues.name === "Long Text")[0].id, postTypeId: birdObservationEvent.id})


        // const { fieldValues: iFieldValues, ...iPost } = req.body;
        // const post = await Post.create(iPost);
    
        // const fieldValueSubclasses = { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue }
        // const fieldValues = await Promise.all(iFieldValues.map(async (iFieldValue: any) => {
        //   const field = await Field.findByPk(iFieldValue.fieldId);
        //   const fieldType = await field.getFieldType();
        //   return await fieldValueSubclasses[`${DataType[fieldType.dataType]}Value`].create({ ...iFieldValue, postId: post.id })
        // }));
        const post1 = await Post.create({
          createdById: users[0].dataValues.id,
          updatedById: users[0].dataValues.id,
          communityId: birdCommunity.id,
          postTypeId: birdObservationEvent.id,
          title: "Inspiring workshop for educators in Nicaragua!",
          image: "bird1.jpg"
        })
        await DateTimeValue.create({ fieldId: birdObservationEventDate.id, postId: post1.id, value: new Date("2019-05-04") })
        await StringValue.create({ fieldId: birdObservationEventLocation.id, postId: post1.id, value: "11.7224441,-86.4197589" })
        await StringValue.create({ fieldId: birdObservationEventDetails.id, postId: post1.id, value: `An amazing workshop was held in Nicaragua to inspire community members to conserve birds and their environment! Concepción de María Private Wildlife Preserve (Reserva Silvestre Privada Concepción de María) and other local leaders participating in the Carazo Natural Capital Initiative, led the workshop, “Connecting Youth to Nature through Birds” to many diverse and dedicated participants. They were all excited about conserving their local birds and the environment. Cafe de Santos is a marvelous organization that is dedicated to sustainable development around the capital of Carazo. They work with combatting the threats that pose a danger to the environment and the local biodiversity. The workshop included environmentalists, representatives of natural reserves, agroecological farms, universities, BUCARAO travel organization, the Chilotes Museum and initiatives of rural community ecotourism in Carazo, Nicaragua like the Producer Organization of the Golden Triangle (Organización de Productores del Triángulo de Oro), backed by APRODIM. The workshop provided training for environmental educators to integrate bird watching, bird appreciation, and conservation through educational activities that children and their families in Nicaragua could participate in. The event was supported by people who love nature including members of the Carazo Natural Capital (Capital Natural de Carazo) and the Cornell Lab of Ornithology. The workshop was led by the environmental educator and interpreter Luis Cortes Bone.
        This Malinche Scientific Station is located in the eastern portion of a temperate forest in the National Park of Malinche, Tlaxcala, Mexico. The students (with interests in biological sciences, chemistry, and health) took part in activities designed to show them the value and importance of biodiversity in Mexico. The goal was to raise their awareness and understanding of the importance of conserving Mexico’s environmental treasures.` })

        const post2 = await Post.create({
          createdById: users[0].dataValues.id,
          updatedById: users[0].dataValues.id,
          communityId: birdCommunity.id,
          postTypeId: birdObservationEvent.id,
          title: "Watching Birds in Malinche National Park!",
          image: "bird2.jpg"
        })
        await DateTimeValue.create({ fieldId: birdObservationEventDate.id, postId: post2.id, value: new Date("2018-01-28") })
        await StringValue.create({ fieldId: birdObservationEventLocation.id, postId: post2.id, value: "19.2277445,-98.0402055" })
        await StringValue.create({ fieldId: birdObservationEventDetails.id, postId: post2.id, value: `Students from the Science and Humanities College of the National Autonomous University of Mexico (Universidad Nacional Autónoma de México (UNAM) had the opportunity to travel to the Malinche Scientific Station (Estación Científica La Malinche) where they were able to study the flora and fauna of the Malinche region!` })

        const post3 = await Post.create({
          createdById: users[0].dataValues.id,
          updatedById: users[0].dataValues.id,
          communityId: birdCommunity.id,
          postTypeId: birdObservationEvent.id,
          title: "Celebrate Birds in the Peruvian Amazon!",
          image: "bird3.jpg"
        })
        await DateTimeValue.create({ fieldId: birdObservationEventDate.id, postId: post3.id, value: new Date("2018-05-20") })
        await StringValue.create({ fieldId: birdObservationEventLocation.id, postId: post3.id, value: "-4.3680021,-76.1310107" })
        await StringValue.create({ fieldId: birdObservationEventDetails.id, postId: post3.id, value: `In May of 2018, students, teachers, and guides in the Loreto region of Peru joined forces with Celebrate Urban Birds, and CONAPAC (a Peruvian nonprofit organization focused on conserving the Peruvian Amazon) to launch the first regional citizen science project in the area. The project, titled “Celebra las Aves en la Amazonía Peruana,” includes an educational citizen science kit, an accompanying six-month Activity Guide/Curriculum specifically developed for the region, and embedded evaluation for each activity.` })



        const findEmployeeCommunity = await Community.create({
            name: "Find Employee",
            description: "This community aims to meet employers who are seeking employees and employees who are seeking new jobs.",
            createdById: randomFrom(users).id,
            updatedById: randomFrom(users).id
        })
        const cv = await PostType.create({
          name: "CV",
          communityId: findEmployeeCommunity.id
        })
    
        const candidateName = await Field.create({
          name: "Candidate Name",
          fieldTypeId: fieldTypes[0].id,
          postTypeId: cv.id
        })
    
        const cEmail = await Field.create({
          name: "Candidate Email",
          fieldTypeId: fieldTypes[5].id,
          postTypeId: cv.id
        })
    
        const cAge = await Field.create({
          name: "Candidate Age",
          fieldTypeId: fieldTypes[2].id,
          postTypeId: cv.id
        })
    }
}