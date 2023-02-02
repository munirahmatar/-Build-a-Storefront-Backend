
import app from "./app";
import config from "./config";

const PORT = config.port || 3000;
const address = `0.0.0.0:${PORT}`;

app.listen(PORT, () => {
  console.log(`starting app on  ${address}`);
});