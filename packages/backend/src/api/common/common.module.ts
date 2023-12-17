import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { CommonModule as BlockChainCommonModule } from 'src/blockChain/common/common.module';

@Module({
  imports: [BlockChainCommonModule],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
