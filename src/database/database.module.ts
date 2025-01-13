import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { FileLogger } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({

        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),

        entities: [resolve(__dirname + '/../**/*.entity{.ts,.js}')],
        migrations: [resolve(__dirname + '/migrations/*{.ts,.js}')],
        cli: {
          migrationsDir: resolve(__dirname + '/migrations'),
        },
        synchronize: false,
        migrationsRun: true,

        logging: true,
        logger: new FileLogger('all', {
          logPath: './logs/db.log',
        }),
      }),
    }),
  ],
})
export class DatabaseModule {}
