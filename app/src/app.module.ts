import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';
import { join } from 'path';
import { PersonalEvalModule } from './personalEval/personal.eval.module';
import { PersonalGeneralModule } from './personalGeneral/personal.general.module';

@Module({
  imports: [
    PersonalEvalModule,
    PersonalGeneralModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      resolvers: { URL: URLResolver },
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
