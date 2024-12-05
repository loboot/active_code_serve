import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ActiveCodeEntity } from './entities/active-code.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActiveCodeService {
  constructor(
    @InjectRepository(ActiveCodeEntity)
    private readonly activeCodeRepository: Repository<ActiveCodeEntity>,
  ) {}
  // 生成一个新的激活码
  async generateActivationCode(): Promise<ActiveCodeEntity> {
    const activeCode = uuidv4().split('-')[0]; // 使用 uuid 生成激活码（取 uuid 的一部分）

    const newActiveCode = this.activeCodeRepository.create({
      activeCode,
    });

    return await this.activeCodeRepository.save(newActiveCode);
  }

  // 判断激活码是否有效
  async validateActiveCode(
    activeCode: string,
    macAddress: string,
  ): Promise<boolean> {
    // 查询激活码是否存在
    const activeCodeRecord = await this.activeCodeRepository.findOne({
      where: { activeCode },
    });

    if (activeCodeRecord.macAddress) {
      throw new BadRequestException('激活码已被使用');
    }

    if (
      !activeCodeRecord ||
      !macAddress ||
      (activeCodeRecord.macAddress &&
        macAddress !== activeCodeRecord.macAddress)
    ) {
      throw new BadRequestException('激活码无效');
    }

    // 如果激活码存在且没有被使用，返回有效
    return true;
  }

  // 激活激活码
  async activateActiveCode(
    activeCode: string,
    macAddress: string,
  ): Promise<ActiveCodeEntity> {
    // 调用验证方法
    await this.validateActiveCode(activeCode, macAddress);

    // 更新激活码状态，标记为已使用
    const activeCodeRecord = await this.activeCodeRepository.findOne({
      where: { activeCode },
    });

    activeCodeRecord.macAddress = macAddress;

    return await this.activeCodeRepository.save(activeCodeRecord);
  }

  // 查询激活状态
  async checkActiveCode(macAddress: string) {
    const isActivated = await this.activeCodeRepository.findOne({
      where: { macAddress },
    });

    return !!isActivated;
  }
}
