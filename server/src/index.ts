import app from "./app";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () =>
  console.log(
    `Server is working on ${
      NODE_ENV === "DEVELOPMENT" ? `http://localhost:${PORT}` : `Port:${PORT}`
    } in ${NODE_ENV} Mode.`
  )
);
