import { Result, Ok, Err, Option, Some, None } from '../src';

/**
 * Example demonstrating async/await usage with Result and Option
 */

// Mock user interface
interface User {
  id: string;
  name: string;
  email: string;
}

// Simulated database
const database: Record<string, User> = {
  '001': { id: '001', name: 'John Doe', email: 'john@example.com' },
  '002': { id: '002', name: 'Jane Smith', email: 'jane@example.com' },
};

// Simulated API service
class UserService {
  async getUser(userId: string): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const user = database[userId];
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  }
}

// Repository layer with Result
class UserRepository {
  constructor(private service: UserService) {}

  async getUser(userId: string): Promise<Result<User, string>> {
    try {
      const user = await this.service.getUser(userId);
      return new Ok(user);
    } catch (error) {
      if (error instanceof Error) {
        return new Err(error.message);
      }
      return new Err('Unknown error occurred');
    }
  }

  async findUser(userId: string): Promise<Option<User>> {
    try {
      const user = await this.service.getUser(userId);
      return new Some(user);
    } catch (error) {
      return new None<User>();
    }
  }
}

// Example usage
async function main() {
  const service = new UserService();
  const repository = new UserRepository(service);

  console.log('=== Async Result Example ===\n');

  // Success case
  const result1 = await repository.getUser('001');
  result1.match({
    ok: (user) => console.log(`Found user: ${user.name} (${user.email})`),
    err: (error) => console.log(`Error: ${error}`),
  });

  // Error case
  const result2 = await repository.getUser('999');
  const userName = result2.match({
    ok: (user) => user.name,
    err: () => 'Guest',
  });
  console.log(`User name: ${userName}`); // User name: Guest

  console.log('\n=== Async Option Example ===\n');

  // Success case with Option
  const option1 = await repository.findUser('002');
  option1.match({
    some: (user) => console.log(`Found user: ${user.name}`),
    none: () => console.log('User not found'),
  });

  // Error case with Option
  const option2 = await repository.findUser('999');
  const email = option2.match({
    some: (user) => user.email,
    none: () => 'no-reply@example.com',
  });
  console.log(`Email: ${email}`); // Email: no-reply@example.com

  console.log('\n=== Chaining Multiple Async Operations ===\n');

  // Multiple operations
  const userResult = await repository.getUser('001');

  // const processedResult = userResult.match({
  //   ok: (user) => new Ok({ ...user, processed: true }),
  //   err: (error) => new Err(error),
  // });

  // processedResult.match({
  //   ok: (data) => console.log('Processed:', data),
  //   err: (error) => console.log('Failed to process:', error),
  // });
}

// Run the example
main().catch(console.error);
