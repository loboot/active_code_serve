import { IsIP } from 'class-validator';

export class CheckActivateCodeDto {
  @IsIP()
  ip: string;
}
