import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('active-code')
export class ActiveCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  activeCode: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  ip: string;
}
