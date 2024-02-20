import { Module } from "@nestjs/common";

import { HISTORY_SERVICE_IN_MEMORY } from "./history.service.in-memory";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../auth/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [{
        provide: 'HISTORY_REPO',
        useClass: HISTORY_SERVICE_IN_MEMORY
    }],
    exports: [{
        provide: 'HISTORY_REPO',
        useClass: HISTORY_SERVICE_IN_MEMORY
    }]
})
export class HistoryServiceModule {}