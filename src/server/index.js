import express from "express";
import compression from "compression";
import graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import cors from "cors";
import path from "path";
import useragent from "express-useragent";
import uuidv3 from "uuid/v3";
import { resolvers, context } from "./resolvers";
import graphQL_Schema from "./schema.graphql";

const schema = buildSchema(graphQL_Schema);
const app = express();
app.use(compression());
app.use(cors());
app.use(useragent.express());

const PORT = process.env.PORT || 8080;

const react_build_dir = path.join(__dirname, "../graphiql/build");
app.use("/favicon.ico", (req, res) =>
  res.sendFile(react_build_dir + req.originalUrl)
);
app.use("*", (req, res) => {
  let uuid = null;
  let client_ip = null;
  // Check if GatsbyJS Build
  let isGatsbyBuild = false;
  if (req.useragent.browser == "node-fetch") isGatsbyBuild = true;
  // In case it is a GatsbyJS Build
  else {
    client_ip = (
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "&aip=1"
    )
      .split(",")[0]
      .trim();
    // aip anonymizes the IP address, this will prevent logging of empty IP address
    uuid = uuidv3(
      JSON.stringify(req.useragent) + client_ip,
      "042ffd34-d989-321c-ad06-f60826172424"
    ); //second parameter is random
  }
  // respond with html page
  if (isGatsbyBuild == false && req.accepts("html") && req.method == "GET") {
    res.status(200).sendFile(react_build_dir + req.originalUrl, err => {
      if (err) {
        res.sendFile(react_build_dir + "/index.html");
      }
    });
  }
  // respond with json
  else {
    const graphqlFunc = graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: false,
      context: {
        db: context,
        isGatsbyBuild: isGatsbyBuild,
        uuid: uuid,
        ip: client_ip
      }
    });
    return graphqlFunc(req, res);
  }
});

app.listen(PORT);

console.log(`Server ready at http://localhost:${PORT}/`);
