import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';
import { AddCarToCategoryDto } from './dto/add-car-to-category.dto';
import { Car } from 'src/cars/entities/car.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Car') private readonly carModel: Model<Car>,
  ) {}

  async throwsExceptionIfCategoryNameIsAlreadyTaken(name: string) {
    const category = await this.categoryModel.findOne({ name });

    if (category)
      throw new HttpException(
        `Category name already taken`,
        HttpStatus.CONFLICT,
      );
  }

  async thorwsExceptionIfCarNotExists(car_id: string) {
    const car = await this.carModel.findById(car_id);

    if (!car) throw new HttpException(`Car not found`, HttpStatus.NOT_FOUND);
  }

  async throwsExceptionIfCategoryNameIsAlreadyTakenByAnotherInstance(
    id: string,
    name: string,
  ) {
    await this.throwsExceptionIfCategoryIsNotFoundById(id);

    const categoryFoundByName = await this.categoryModel.findOne({ name });
    const categoryFoundById = await this.categoryModel.findById(id);

    if (
      categoryFoundByName &&
      categoryFoundByName._id !== categoryFoundById._id
    )
      throw new HttpException(
        `This name is arealdy taken by another category instance`,
        HttpStatus.CONFLICT,
      );
  }

  async throwsExceptionIfCategoryIsNotFoundById(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category)
      throw new HttpException(`Category not found`, HttpStatus.NOT_FOUND);
  }

  async throwsExceptionIfTheCarIsAlreadySettedToAGivenCategory(
    category_id: string,
    car_id: string,
  ) {
    await this.throwsExceptionIfCategoryIsNotFoundById(category_id);

    const { cars } = await this.categoryModel.findById(category_id);

    const foundCarInCarsArray = cars.find((car) => String(car._id) === car_id);

    if (foundCarInCarsArray)
      throw new HttpException(
        `The car #${car_id} is already ssetted to category #${category_id}`,
        HttpStatus.NOT_ACCEPTABLE,
      );
  }

  async create({ name }: CreateCategoryDto) {
    await this.throwsExceptionIfCategoryNameIsAlreadyTaken(name);

    await this.categoryModel.create({
      name,
    });
  }

  async findAll(): Promise<Array<Category>> {
    const categories = await this.categoryModel.find();

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).populate('cars');

    return category;
  }

  async addCarToCategory(id: string, { car_id }: AddCarToCategoryDto) {
    await this.thorwsExceptionIfCarNotExists(car_id);
    await this.throwsExceptionIfCategoryIsNotFoundById(id);
    await this.throwsExceptionIfTheCarIsAlreadySettedToAGivenCategory(
      id,
      car_id,
    );

    await this.categoryModel.updateOne(
      { _id: id },
      {
        $push: { cars: car_id },
      },
    );
  }

  async update(id: string, { name }: UpdateCategoryDto) {
    await this.throwsExceptionIfCategoryNameIsAlreadyTakenByAnotherInstance(
      id,
      name,
    );

    await this.categoryModel.updateOne({ _id: id }, { $set: { name } });
  }

  async remove(id: string) {
    await this.categoryModel.deleteOne({ _id: id });
  }
}
