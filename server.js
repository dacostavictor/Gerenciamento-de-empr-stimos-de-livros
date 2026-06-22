const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const apiRoutes = require("./routes/api");

app.use("/api", apiRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando");
});