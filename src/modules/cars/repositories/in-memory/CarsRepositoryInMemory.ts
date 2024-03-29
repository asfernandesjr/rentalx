import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
      id,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car|undefined> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(brand: string, category_id: string, name: string): Promise<Car[]> {
    return this.cars.filter((car) => {
      if (car.available === true && ((brand && car.brand === brand)
        || (category_id && car.category_id === category_id)
        || (name && car.name === name))) {
        return true;
      }
      return false;
    });
  }

  async findById(id: string): Promise<Car | null | undefined> {
    return this.cars.find((car) => car.id === id);
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const idx = this.cars.findIndex((car) => car.id === id);
    if (idx === -1) {
      return;
    }
    this.cars[idx].available = available;
  }
}

export { CarsRepositoryInMemory };
