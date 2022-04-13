import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AddCarToCategoryDto } from './dto/add-car-to-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/add_car')
  addCar(
    @Param('id') id: string,
    @Body() addCarToCategory: AddCarToCategoryDto,
  ) {
    return this.categoriesService.addCarToCategory(id, addCarToCategory);
  }

  @Patch(':id/remove_car')
  removeCar(
    @Param('id') id: string,
    @Body() removeCarFromCategory: AddCarToCategoryDto,
  ) {
    return this.categoriesService.removeCarFromCategory(
      id,
      removeCarFromCategory,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
