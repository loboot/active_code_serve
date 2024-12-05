import { Module } from '@nestjs/common';
import { ActiveCodeService } from './active-code.service';
import { ActiveCodeController } from './active-code.controller';
import { ActiveCodeEntity } from './entities/active-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([ActiveCodeEntity])],
  controllers: [ActiveCodeController],
  providers: [ActiveCodeService],
})
export class ActiveCodeModule {}
