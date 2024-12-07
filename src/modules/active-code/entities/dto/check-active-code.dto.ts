import { IsMACAddress } from 'class-validator';

export class CheckActivateCodeDto {
  @IsMACAddress({ message: 'MAC 地址无效' })
  macAddress: string;
}
