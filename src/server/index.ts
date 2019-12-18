import { initAPI } from "./rest/api";
import * as express from "express";
import { AddressInfo } from "net";
const app = express();
var cors = require("cors")

app.use(cors())
var options = {
  index: "index.htm"
};

app.use("/", express.static(".", options));
app.use("/upload", express.static("upload"));

initAPI(app).then(()=> {
  const server = app.listen(4000, function() {
    const { address, port } = (<AddressInfo>server.address())
    console.log("listening at http://%s:%s", address, port);
  })
});

