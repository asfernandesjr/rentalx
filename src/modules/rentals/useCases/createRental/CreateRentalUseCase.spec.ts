import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJsProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd1day = dayjs().add(1, 'day').toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayJsProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsProvider,
      carsRepositoryInMemory,
    );
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'car test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    const rental = await createRentalUseCase.execute({
      user_id: '1234',
      car_id: car.id as string,
      expected_return_date: dayAdd1day,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open'
     + 'rental to the same user', async () => {
    await createRentalUseCase.execute({
      user_id: '1234',
      car_id: '1231231231',
      expected_return_date: dayAdd1day,
    });
    await expect(createRentalUseCase.execute({
      user_id: '1234',
      car_id: '1235',
      expected_return_date: dayAdd1day,
    })).rejects.toEqual(new AppError('User has an open rental!'));
  });

  it('should not be able to create a new rental if there is another open'
     + 'rental to the same car', async () => {
    await createRentalUseCase.execute({
      user_id: '1234',
      car_id: '1234',
      expected_return_date: dayAdd1day,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '1235',
        car_id: '1234',
        expected_return_date: dayAdd1day,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable!'));
  });

  it('should not be able to create a new rental with invalid rental time', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: '1234',
        car_id: '1234',
        expected_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('Invalid return time!'));
  });
});
