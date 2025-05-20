import { makeApp } from "./app";
import * as dotenv from 'dotenv'

async function main() {
  dotenv.config()
  const app = makeApp();

  const port = process.env.PORT
  app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
  });
}

main().catch((error) => {
  console.log(error);
});