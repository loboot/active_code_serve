import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ActiveCodeService } from './active-code.service';
import { ActivateCodeDto } from './entities/dto/active-code.dto';

@Controller('active-code')
export class ActiveCodeController {
  constructor(private readonly activeCodeService: ActiveCodeService) {}

  @Post('genActiveCode')
  async genCode() {
    try {
      const res = await this.activeCodeService.generateActivationCode();
      return {
        code: 200,
        data: {
          activeCode: res.activeCode,
        },
      };
    } catch (e) {
      Logger.error(`生成激活码失败:${e}`);
      return {
        code: 500,
        message: '激活码生成失败',
      };
    }
  }

  // 处理激活请求
  @Post('activate')
  async activate(@Body() body: ActivateCodeDto) {
    try {
      const { activeCode, macAddress } = body;
      await this.activeCodeService.activateActiveCode(activeCode, macAddress);

      return {
        code: 200,
        message: '激活码激活成功',
      };
    } catch (error) {
      throw new BadRequestException(error.response || '激活失败');
    }
  }

  @Get('checkActiveCode')
  async checkActiveCode(
    @Param('macAddress') macAddress: ActivateCodeDto['macAddress'],
  ) {
    try {
      await this.activeCodeService.checkActiveCode(macAddress);
      return {
        code: 200,
        status: true,
      };
    } catch (e) {
      Logger.error(e);
      return {
        code: 400,
        status: false,
      };
    }
  }
}
