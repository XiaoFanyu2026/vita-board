import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private repo: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.repo.find();
  }
}
