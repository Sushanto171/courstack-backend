"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = __importDefault(require("./app/config"));
const globalError_1 = require("./app/middleware/globalError");
const httpLogger_1 = require("./app/middleware/httpLogger");
const notFound_1 = require("./app/middleware/notFound");
const routes_1 = __importDefault(require("./app/routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [config_1.default.FRONTEND_URL,]
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(httpLogger_1.httpLogger);
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