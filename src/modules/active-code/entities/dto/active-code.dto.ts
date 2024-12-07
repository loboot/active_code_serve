import { IsString, IsNotEmpty, IsIP } from 'class-validator';

export class ActivateCodeDto {
  @IsString()
  @IsNotEmpty({ message: '激活码不能为空' })
  activeCode?: string;

  @IsIP() // 校验是否是有效的 IPv4 地址
  @IsNotEmpty()
  ip: string;
}
