import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Whiteboard } from './whiteboard.entity';
import { WhiteboardsService } from './whiteboards.service';
import { WhiteboardsController } from './whiteboards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Whiteboard])],
  providers: [WhiteboardsService],
  controllers: [WhiteboardsController],
  exports: [WhiteboardsService],
})
export class WhiteboardsModule {}
