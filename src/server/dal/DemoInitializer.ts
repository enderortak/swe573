import { User } from "../domain/User";
import { Community } from "../domain/Community";
import { PostType } from "../domain/PostType";
import { FieldType } from "../domain/FieldType";
import { DataType } from "../domain/DataType";
import { Field } from "../domain/Field";
import { Post } from "../domain/Post";
import { StringValue, IntegerValue } from "../domain/FieldValue";
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