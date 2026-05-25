import { Elysia, env } from "elysia";
import { submitController } from "./controllers/submitController";

const PORT = env.PORT;

const app = new Elysia()
  .use(submitController)
  .listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
