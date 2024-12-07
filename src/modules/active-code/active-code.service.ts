import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ActiveCodeEntity } from './entities/active-code.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActiveCodeService {
  constructor(
    @InjectRepository(ActiveCodeEntity)
    private readonly activeCodeRepository: Repository<ActiveCodeEntity>,
  ) {}

  // 生成一个新的激活码
  async generateActivationCode() {
    const activeCode = uuidv4().split('-')[0]; // 使用 uuid 生成激活码（取 uuid 的一部分）
    try {
      const newActiveCode = this.activeCodeRepository.create({
        activeCode,
      });

      const res = await this.activeCodeRepository.save(newActiveCode);
      return res.activeCode;
    } catch (error) {
      throw new HttpException(
        '服务器内部错误，无法生成激活码',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 判断激活码是否有效
  async validateActiveCode(ip: string, activeCode: string): Promise<boolean> {
    // 查询激活码是否存在
    const activeCodeRecord = await this.activeCodeRepository.findOne({
      where: { activeCode },
    });
    Logger.debug(JSON.stringify(activeCodeRecord), '查询到的激活码');

    if (!activeCodeRecord) {
      throw new HttpException('激活码不存在', HttpStatus.BAD_REQUEST);
    }

    // 检查 IP 地址是否与激活码匹配
    if (activeCodeRecord.ip && activeCodeRecord.ip !== ip) {
      throw new HttpException(
        '激活码已在其他设备上激活',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  // 激活激活码
  async activateActiveCode(activeCode: string, ip: string) {
    await this.validateActiveCode(ip, activeCode);

    // 更新激活码状态，标记为已使用
    const activeCodeRecord = await this.activeCodeRepository.findOne({
      where: { activeCode },
    });

    try {
      activeCodeRecord.ip = ip;

      await this.activeCodeRepository.save(activeCodeRecord);
      return true;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.message.includes('Duplicate entry')) {
          throw new HttpException(
            '该 IP 地址已经绑定过激活码',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      Logger.debug(e);
      throw new BadRequestException('激活失败');
    }
  }

  // 查询激活状态
  async checkActiveCode(ip: string) {
    const isActivated = await this.activeCodeRepository.findOne({
      where: { ip },
    });

    return !!isActivated;
  }
}
