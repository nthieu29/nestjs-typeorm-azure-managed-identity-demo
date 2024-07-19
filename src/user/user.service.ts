import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: number): Promise<User | undefined> {
        return this.userRepository.findOneBy({id});
    }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async update(id: number, userData: Partial<User>): Promise<User> {
        const user = await this.userRepository.preload({
            id: id,
            ...userData,
        });
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.remove(user);
    }
}
