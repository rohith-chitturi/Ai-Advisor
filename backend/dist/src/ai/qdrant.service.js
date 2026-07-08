"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantService = void 0;
const common_1 = require("@nestjs/common");
const js_client_rest_1 = require("@qdrant/js-client-rest");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let QdrantService = class QdrantService {
    client;
    collectionName = 'ai_tools';
    constructor() {
        this.client = new js_client_rest_1.QdrantClient({
            url: process.env.QDRANT_URL || 'http://localhost:6333',
        });
    }
    async onModuleInit() {
        try {
            const collections = await this.client.getCollections();
            const exists = collections.collections.some(c => c.name === this.collectionName);
            if (!exists) {
                await this.client.createCollection(this.collectionName, {
                    vectors: { size: 1536, distance: 'Cosine' },
                });
                console.log(`Created Qdrant collection: ${this.collectionName}`);
            }
            else {
                console.log('Qdrant connected and collection exists.');
            }
        }
        catch (error) {
            console.error('Error connecting to Qdrant', error);
        }
    }
    async upsertVectors(points) {
        return await this.client.upsert(this.collectionName, {
            wait: true,
            points,
        });
    }
    async searchVectors(vector, limit = 5) {
        return await this.client.search(this.collectionName, {
            vector,
            limit,
        });
    }
};
exports.QdrantService = QdrantService;
exports.QdrantService = QdrantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QdrantService);
//# sourceMappingURL=qdrant.service.js.map