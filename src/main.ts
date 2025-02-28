import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { initDatabase } from './modules/database/initDatabase';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/responseInterceptor';
import { AllExceptionsFilter } from './common/exception.filter';

async function bootstrap() {
  initDatabase();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 移除无效的字段
      forbidNonWhitelisted: true, // 丢弃不允许的字段
      transform: true, // 自动转换数据类型
    }),
  );
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // 使用全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const PORT = process.env.PORT;

  await app.listen(PORT ?? 3000, () => {
    Logger.log(`服务启动成功: http://localhost:${PORT}`, 'Main');
  });
}
bootstrap();
