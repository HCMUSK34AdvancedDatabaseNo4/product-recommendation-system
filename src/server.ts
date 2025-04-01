import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ProductRecommendationController } from "./controllers/";
import { configureLogger } from "./helpers/logger-config";
import { errorHanlder } from "./helpers/error-handler";
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from "./swagger";
import { JsonObject } from "swagger-ui-express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Test Route
app.get("/", async (req, res) => {
  res.send("Hello World!");
});
configureLogger()

app.use("/api/recommendations", ProductRecommendationController.getInstance().router)
app.use(errorHanlder);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs as JsonObject));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
