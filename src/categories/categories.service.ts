import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async throwsExceptionIfCategoryNameIsAlreadyTaken(name: string) {
    const category = await this.categoryModel.findOne({ name });

    if (category)
      throw new HttpException(
        `Category name already taken`,
        HttpStatus.CONFLICT,
      );
  }

  async throwsExceptionIfCategoryNameIsAlreadyTakenByAnotherInstance(
    id: string,
    name: string,
  ) {
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
    const category = await this.categoryModel.findById(id);

    return category;
  }

  async update(id: string, { name }: UpdateCategoryDto) {
    await this.throwsExceptionIfCategoryNameIsAlreadyTakenByAnotherInstance(
      id,
      name,
    );

    await this.categoryModel.updateOne({ _id: id }, { $set: { name } });
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
