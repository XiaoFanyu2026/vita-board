import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Whiteboard } from './whiteboard.entity';

@Injectable()
export class WhiteboardsService {
  constructor(
    @InjectRepository(Whiteboard)
    private whiteboardsRepository: Repository<Whiteboard>,
  ) {}

  async findAll(): Promise<Whiteboard[]> {
    return this.whiteboardsRepository.find({ relations: ['owner', 'department'] });
  }

  async findOne(id: string): Promise<Whiteboard> {
    return this.whiteboardsRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Whiteboard>): Promise<Whiteboard> {
    const wb = this.whiteboardsRepository.create(data);
    return this.whiteboardsRepository.save(wb);
  }
}
