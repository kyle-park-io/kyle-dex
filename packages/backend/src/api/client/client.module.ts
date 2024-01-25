import { Module } from '@nestjs/common';
import { HardhatClientService } from './client.hardhat.service';
import { SepoliaClientService } from './client.sepolia.service';
import { MumbaiClientService } from './client.mumbai.service';
import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
  providers: [HardhatClientService, SepoliaClientService, MumbaiClientService],
})
export class ClientModule {}
