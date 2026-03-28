import { DepartmentsModule } from "./departments/departments.module";
import { RolesModule } from "./roles/roles.module";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Department } from './departments/department.entity';
import { Role } from './roles/role.entity';
import { Permission } from './permissions/permission.entity';
import { Whiteboard } from './whiteboards/whiteboard.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WhiteboardsModule } from './whiteboards/whiteboards.module';

@Module({
  imports: [
    DepartmentsModule,
    RolesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'vita_user',
      password: process.env.DB_PASSWORD || 'vita_password',
      database: process.env.DB_NAME || 'vita_board',
      entities: [User, Department, Role, Permission, Whiteboard],
      synchronize: false, // Use init.sql for schema
    }),
    AuthModule,
    UsersModule,
    WhiteboardsModule,
  ],
})
export class AppModule {}
