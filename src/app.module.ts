import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {User} from './user/user.entity'; // Ensure this path is correct

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes environment variables available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigModule available to TypeOrmModule
      inject: [ConfigService], // Inject ConfigService to use in the factory function
      useFactory: (configService: ConfigService) => ({
        type: 'mssql', // Type of the database
        host: configService.get<string>('AZURE_SQL_SERVER'), // Get host from config
        database: configService.get<string>('AZURE_SQL_DATABASE'), // Get database name from config
        entities: [User], // Entities to be loaded
        synchronize: true, // Reflects entities in the database, use cautiously in production
        logging: 'all', // debugging only, will slow down the application
        options: {
          encrypt: true,
          trustServerCertificate: false
        },
        extra: {
          authentication: {
            type: 'azure-active-directory-default'
          }
        }
      }),
    }),
  ],
})
export class AppModule {
}
