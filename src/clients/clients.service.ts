import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Model } from 'mongoose';
import { Client } from './entities/client.entity';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { RemovePhoneDto } from './dto/remove-phone.dto';
import { CreateAddressDto } from './dto/create-address.dto';

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

  private async throwsExceptionIfTriesToUpdateCpfThatBelongsToAnotherInstace(
    id: string,
    cpf: string,
  ): Promise<void> {
    const clientFoundById = await this.clientModel.findById(id);
    const clientFoundByCpf = await this.clientModel.findOne({ cpf });

    if (clientFoundByCpf && clientFoundById._id !== clientFoundByCpf._id)
      throw new HttpException(
        `This cpf is already taken by another instance`,
        HttpStatus.CONFLICT,
      );
  }

  private async throwsExceptionIfInstanceNotFound(id: string): Promise<void> {
    const client = await this.clientModel.findById(id);

    if (!client)
      throw new HttpException(`Client not found`, HttpStatus.NOT_FOUND);
  }

  private async throwsExceptionIfNumberIsNotSettedToTheClient(
    id: string,
    phone_id: string,
  ): Promise<void> {
    const { phone_numbers } = await this.clientModel.findById(id);

    const phone = phone_numbers.find(
      (number) => String(number._id) === phone_id,
    );

    if (!phone) throw new NotFoundException(`Phone not found for the user`);
  }

  async create({
    name,
    email,
    cpf,
    phone_numbers,
    addresses,
  }: CreateClientDto): Promise<void> {
    await this.throwsExceptionIfEmailIsAlreadyTaken(email);
    await this.throwsExceptionIfCpfIsAlreadyTaken(cpf);
    await this.clientModel.create({
      name,
      email,
      cpf,
      phone_numbers,
      addresses,
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
    { name, email, cpf }: UpdateClientDto,
  ): Promise<void> {
    await this.throwsExceptionIfInstanceNotFound(id);

    await this.throwsExceptionIfTriesToUpdateEmailThatBelongsToAnotherInstance(
      id,
      email,
    );

    await this.throwsExceptionIfTriesToUpdateCpfThatBelongsToAnotherInstace(
      id,
      cpf,
    );

    await this.clientModel.updateOne(
      {
        _id: id,
      },
      { $set: { name, email, cpf } },
    );
  }

  async remove(id: string): Promise<void> {
    await this.throwsExceptionIfInstanceNotFound(id);

    await this.clientModel.deleteOne({ _id: id });
  }

  async addPhoneNumbers(
    id: string,
    phone_number: CreatePhoneDto,
  ): Promise<void> {
    await this.clientModel.updateOne(
      { _id: id },
      {
        $push: { phone_numbers: phone_number },
      },
    );
  }

  async removePhoneNumber(id: string, { phone_id }: RemovePhoneDto) {
    const { phone_numbers } = await this.clientModel.findById(id);
    await this.throwsExceptionIfNumberIsNotSettedToTheClient(id, phone_id);

    const phone = phone_numbers.find(
      (number) => String(number._id) === phone_id,
    );

    const indexOfPhone = phone_numbers.indexOf(phone);

    phone_numbers.splice(indexOfPhone, 1);

    const newPhoneNumbersArray = phone_numbers;

    await this.clientModel.updateOne(
      { _id: id },
      { $set: { phone_numbers: newPhoneNumbersArray } },
    );
  }

  async addAddress(id: string, address: CreateAddressDto) {
    await this.clientModel.updateOne(
      { _id: id },
      { $push: { addresses: address } },
    );
  }
}
