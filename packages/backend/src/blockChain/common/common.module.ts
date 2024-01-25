import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { RpcModule } from '../rpc/rpc.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [RpcModule, AccountModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
