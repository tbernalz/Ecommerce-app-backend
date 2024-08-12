import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { ProductsService } from './products.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async findAll(relations: string[] = []): Promise<Category[]> {
    return await this.categoryRepo.find({ relations: relations });
  }

  async findOne(id: string, relations: string[] = []): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations,
    });
    if (!category) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }
    return category;
  }

  async findByIds(
    ids: string[],
    relations: string[] = [],
  ): Promise<Category[]> {
    return this.categoryRepo.find({
      where: {
        id: In(ids),
      },
      relations,
    });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepo.create(createCategoryDto);

    if (createCategoryDto.productsIds) {
      const products = await this.productsService.findByIds(
        createCategoryDto.productsIds,
      );
      newCategory.products = products;
    }

    return await this.categoryRepo.save(newCategory);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.productsIds) {
      const products = await this.productsService.findByIds(
        updateCategoryDto.productsIds,
      );
      category.products = products;
    }

    this.categoryRepo.merge(category, updateCategoryDto);
    return await this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.categoryRepo.delete(id);
  }
}
