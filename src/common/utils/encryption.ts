import { compare, hash } from 'bcrypt';

export class Encryption {
  static hash(value: string): Promise<string> {
    return hash(value, 10);
  }

  static compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
