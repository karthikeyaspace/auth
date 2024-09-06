import express from "express";
const app = express();
import * as jwt from "./jwt/index";
import * as mgl from "./magiclink/index";
app.use(express.json());
const PORT = 3000;

// jwt tests

app.post("/jwt/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await jwt.login(email, password);
  return res.send({ status: result.status, message: result.message });
});

app.post("/jwt/register", async (req, res) => {
  const { email, password, name } = req.body;
  const result = await jwt.register(email, password, name);
  return res.send({ status: result.status, message: result.message });
});

app.post("/jwt/verify", async (req, res) => {
  const { email } = req.body;
  const result = await jwt.verify(email);
  return res.send({ status: result.status, message: result.message });
});

app.post("/jwt/update", async (req, res) => {
  const { email, name } = req.body;
  const result = await jwt.update(email, name);
  return res.send({ status: result.status, message: result.message });
});

// magiclink tests

app.post("/mgl/login", async (req, res) => {
  const { email } = req.body;
  const result = await mgl.login(email);
  return res.send({ status: result.status, message: result.message, user: result.user });
});

app.get('/mgl/verify/:token', async (req, res) => {
  const { token } = req.params;
  const result = await mgl.validateToken(token);
  if(!result)
    return res.send({ status: false, message: "Token is invalid or user not found" });

  return res.send({ status: true, message: "Token is valid" });
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
