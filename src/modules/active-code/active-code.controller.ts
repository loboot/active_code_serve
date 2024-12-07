import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ActiveCodeService } from './active-code.service';
import { ActivateCodeDto } from './entities/dto/active-code.dto';
import { CheckActivateCodeDto } from './entities/dto/check-active-code.dto';

@Controller('active-code')
export class ActiveCodeController {
  constructor(private readonly activeCodeService: ActiveCodeService) {}

  @Post('genActiveCode')
  async genCode() {
    return await this.activeCodeService.generateActivationCode();
  }

  // 处理激活请求
  @Post('activate')
  async activate(@Body() body: ActivateCodeDto) {
    const { activeCode, macAddress } = body;
    return await this.activeCodeService.activateActiveCode(
      activeCode,
      macAddress,
    );
  }

  // 查询激活码激活状态
  @Get('checkActiveCode')
  async checkActiveCode(@Query() query: CheckActivateCodeDto) {
    const status = await this.activeCodeService.checkActiveCode(
      query.macAddress,
    );
    return status;
  }
}
