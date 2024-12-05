import { IsString, IsNotEmpty, IsMACAddress } from 'class-validator';

export class ActivateCodeDto {
  @IsString()
  @IsNotEmpty({ message: '激活码不能为空' })
  activeCode: string;

  @IsMACAddress({ message: 'MAC 地址无效' })
  macAddress: string;
}
