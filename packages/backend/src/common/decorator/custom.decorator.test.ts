import { validate } from 'class-validator';
import { IsAddress } from './custom.decorator';

class Address {
  @IsAddress('test1', { message: 'Checking address type' })
  hexa!: string;

  @IsAddress('test2', { message: 'Checking address type' })
  noHexa!: string;

  @IsAddress('test3', { message: 'Checking address type' })
  other!: string;
}

const address = new Address();
address.hexa = '0x90b0079b4e1c58b351ba47110d11276b1ecbeeb6';
address.noHexa = '90b0079b4e1c58b351ba47110d11276b1ecbeeb6';
address.other = 'abcd';

async function test(): Promise<void> {
  void validate(address).then((errors) => {
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
    } else {
      console.log('Validation succeeded');
    }
  });
}
void test();
