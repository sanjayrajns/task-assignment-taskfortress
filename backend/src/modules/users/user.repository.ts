import { User, IUserDocument } from './user.model';

/**
 * Data-access layer for User collection.
 * Contains only database queries — no business logic.
 */
export class UserRepository {
  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email });
  }

  /**
   * Find by email WITH password field included.
   * Only used during authentication.
   */
  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email }).select('+password');
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<IUserDocument> {
    return User.create(data);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email });
    return count > 0;
  }

  async findAll(): Promise<IUserDocument[]> {
    return User.find();
  }
}

export const userRepository = new UserRepository();
