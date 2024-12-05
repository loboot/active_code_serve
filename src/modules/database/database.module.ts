import { Configuration } from 'src/configs/configuration';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Configuration>) => {
        return config.get('database');
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    private readonly connection: Connection,
    private readonly config: ConfigService,
  ) {}
  private readonly logger = new Logger(DatabaseModule.name);
  onModuleInit(): void {
    const { database } = this.connection.options;
    this.logger.log(`Your MySQL database named ${database} has been connected`);
  }
}
