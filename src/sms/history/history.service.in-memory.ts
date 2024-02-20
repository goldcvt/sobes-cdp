import { InjectRepository } from "@nestjs/typeorm";
import { IHistoricalRepo } from "./history.interface";
import { User } from "../../auth/entities/user.entity";
import { Repository } from "typeorm";

export const GLOBAL_HISTORY_STORAGE = [];

export class HISTORY_SERVICE_IN_MEMORY implements IHistoricalRepo {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

    async save(element: any): Promise<void> {
        GLOBAL_HISTORY_STORAGE.push(element);
        return element;
    }

    async get_Last_Few(quantity: number): Promise<any[]> {
        const res = [];
        for (let index = 0; index < quantity; index++) {
            const record = GLOBAL_HISTORY_STORAGE.pop();
            if (!record) return res;
            const users = await this.usersRepo.find({loadEagerRelations: true})
            const userData = users.filter(user => {
                return user.login == record?.user})[0];
            res.push({...record, user: userData})
        }
        return res;
    }
}
