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

  private async throwsExceptionIfEmailIsAlreadyTaken(
    email: string,
  ): Promise<void> {
    const clientFoundByEmail = await this.clientModel.findOne({ email });

    if (clientFoundByEmail)
      throw new HttpException(`Email already taken`, HttpStatus.CONFLICT);
  }

  private async throwsExceptionIfCpfIsAlreadyTaken(cpf: string): Promise<void> {
    const clientFoundByCpf = await this.clientModel.findOne({ cpf });

    if (clientFoundByCpf)
      throw new HttpException(`Cpf already taken`, HttpStatus.CONFLICT);
  }

  private async throwsExceptionIfTriesToUpdateEmailThatBelongsToAnotherInstance(
    id: string,
    email: string,
  ): Promise<void> {
    const clientFoundById = await this.clientModel.findById(id);
    const clientFoundByEmail = await this.clientModel.findOne({ email });

    if (clientFoundByEmail && clientFoundById._id !== clientFoundByEmail._id)
      throw new HttpException(
        `This email is already taken by another instance`,
        HttpStatus.CONFLICT,
      );
  }

  async create({
    name,
    email,
    cpf,
    addresses,
    phone_numbers,
  }: CreateClientDto): Promise<void> {
    await this.throwsExceptionIfEmailIsAlreadyTaken(email);
    await this.throwsExceptionIfCpfIsAlreadyTaken(cpf);
    await this.clientModel.create({
      name,
      email,
      cpf,
      addresses,
      phone_numbers,
    });
  }

  async findAll(): Promise<Array<Client>> {
    const clients = await this.clientModel.find();

    return clients;
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id);

    return client;
  }

  async update(
    id: string,
    { name, email, cpf, phone_numbers, addresses }: UpdateClientDto,
  ): Promise<void> {
    await this.throwsExceptionIfTriesToUpdateEmailThatBelongsToAnotherInstance(
      id,
      email,
    );
    await this.clientModel.updateOne(
      {
        _id: id,
      },
      { $set: { name, email, cpf, phone_numbers, addresses } },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
