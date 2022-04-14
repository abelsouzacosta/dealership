import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Model } from 'mongoose';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel('Client') private readonly clientModel: Model<Client>,
  ) {}

  private async throwsExceptionIfEmailIsAlreadyTaken(email: string) {
    const clientFoundByEmail = await this.clientModel.findOne({ email });

    if (clientFoundByEmail)
      throw new HttpException(`Email already taken`, HttpStatus.CONFLICT);
  }

  async create({
    name,
    email,
    cpf,
    addresses,
    phone_numbers,
  }: CreateClientDto) {
    await this.throwsExceptionIfEmailIsAlreadyTaken(email);

    await this.clientModel.create({
      name,
      email,
      cpf,
      addresses,
      phone_numbers,
    });
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
