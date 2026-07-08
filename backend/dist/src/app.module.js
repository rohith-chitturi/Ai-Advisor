"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const tools_controller_1 = require("./tools/tools.controller");
const tools_service_1 = require("./tools/tools.service");
const search_controller_1 = require("./search/search.controller");
const ai_advisor_service_1 = require("./ai/ai-advisor.service");
const meilisearch_service_1 = require("./ai/meilisearch.service");
const qdrant_service_1 = require("./ai/qdrant.service");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [app_controller_1.AppController, tools_controller_1.ToolsController, search_controller_1.SearchController],
        providers: [app_service_1.AppService, tools_service_1.ToolsService, ai_advisor_service_1.AiAdvisorService, meilisearch_service_1.MeilisearchService, qdrant_service_1.QdrantService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map