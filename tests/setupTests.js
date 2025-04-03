import supertest from "supertest";
import app from "../server.js";

global.api = supertest(app);