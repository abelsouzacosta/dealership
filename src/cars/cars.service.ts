import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Model } from 'mongoose';
import { Car } from './entities/car.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CarsService {
  constructor(@InjectModel('Car') private readonly carModel: Model<Car>) {}

  private async throwsExceptionIfLicensePlateIsAlreadyRegistered(
    license_plate: string,
  ) {
    const licensePlateFound = await this.carModel.findOne({
      license_plate,
    });

    if (licensePlateFound)
      throw new HttpException(
        `License plate already registered`,
        HttpStatus.CONFLICT,
      );
  }

  private async throwsExceptionIfCarInstanceNotExists(id: string) {
    const carFound = await this.carModel.findById(id);

    if (!carFound)
      throw new HttpException(`Car not found`, HttpStatus.NOT_FOUND);
  }

  async create({
    brand,
    model,
    color,
    fabrication_year,
    model_year,
    license_plate,
  }: CreateCarDto) {
    await this.throwsExceptionIfLicensePlateIsAlreadyRegistered(license_plate);

    await this.carModel.create({
      brand,
      model,
      color,
      fabrication_year,
      model_year,
      license_plate,
    });
  }

  async findAll(): Promise<Array<Car>> {
    const cars = await this.carModel.find();

    return cars;
  }

  async findOne(id: string) {
    await this.throwsExceptionIfCarInstanceNotExists(id);

    const car = await this.carModel.findById(id);

    return car;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
