"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const globalError_1 = require("./app/middleware/globalError");
const notFound_1 = require("./app/middleware/notFound");
const routes_1 = __importDefault(require("./app/routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = new Date().toLocaleString("en-US", { timeZone: timezone });
    res.send(`Courstack running... Timezone: ${timezone} Current Time: ${currentTime}`);
});
app.use(notFound_1.notFound);
app.use(globalError_1.globalError);
exports.default = app;
//# sourceMappingURL=app.js.map