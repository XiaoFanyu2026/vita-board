import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WhiteboardsService } from './whiteboards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Whiteboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('whiteboards')
export class WhiteboardsController {
  constructor(private readonly whiteboardsService: WhiteboardsService) {}

  @Get()
  findAll() {
    return this.whiteboardsService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.whiteboardsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whiteboardsService.findOne(id);
  }
}
