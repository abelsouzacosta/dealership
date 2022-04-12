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

  private async throwsExceptionIfLicensePlateIsAlreadyRegisteredForAnotherCarInstance(
    id: string,
    license_plate: string,
  ) {
    const carFoundById = await this.carModel.findById(id);
    const carFoundByLicensePlate = await this.carModel.findOne({
      license_plate,
    });

    if (
      carFoundByLicensePlate &&
      carFoundById._id !== carFoundByLicensePlate._id
    )
      throw new HttpException(
        `This license plate is alreadu registered for another car`,
        HttpStatus.NOT_ACCEPTABLE,
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

  async update(
    id: string,
    {
      brand,
      model,
      color,
      fabrication_year,
      model_year,
      license_plate,
    }: UpdateCarDto,
  ) {
    await this.throwsExceptionIfLicensePlateIsAlreadyRegisteredForAnotherCarInstance(
      id,
      license_plate,
    );

    await this.carModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          brand,
          model,
          color,
          fabrication_year,
          model_year,
          license_plate,
        },
      },
    );
  }

  async remove(id: string) {
    await this.throwsExceptionIfCarInstanceNotExists(id);

    await this.carModel.deleteOne({ _id: id });
  }
}
