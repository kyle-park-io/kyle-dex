import { Module } from '@nestjs/common';
import { HardhatClientService } from './client.hardhat.service';
import { SepoliaClientService } from './client.sepolia.service';
import { AmoyClientService } from './client.amoy.service';
import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
  providers: [HardhatClientService, SepoliaClientService, AmoyClientService],
})
export class ClientModule {}
