import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientValidationPipe } from './pipes/create-client-validation.pipe';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UsePipes(ValidationPipe, CreateClientValidationPipe)
  create(@Body() data: CreateClientDto) {
    return this.clientsService.create(data);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  @Patch(':id/add_phone')
  @UsePipes(ValidationPipe)
  addPhones(@Param('id') id: string, @Body() addPhoneToClient: CreatePhoneDto) {
    return this.clientsService.addPhoneNumbers(id, addPhoneToClient);
  }
}
