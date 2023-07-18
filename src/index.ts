import express, { Request, Response, Express } from "express";
import { config } from "dotenv";
import compression from "compression";
import router from "./routes";
config();
const app: Express = express();

app.use(express.json());
app.use("/api", router());
app.get("/", (req: Request, res: Response) => {
  res.send("hello worldazeaze");
});

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
