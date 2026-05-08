import { connect, connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

const SALT_ROUNDS = 10;

// Default administrator credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'Admin@123',
  fullName: 'Quản trị viên',
  email: 'admin@xaydung.com',
  phone: '0901234567',
};

// Default user account
const DEFAULT_USER = {
  username: 'user',
  password: 'User@123',
  fullName: 'Người dùng',
  email: 'user@xaydung.com',
  phone: '0907654321',
};

/**
 * Administrator schema interface for direct MongoDB operations
 */
interface Administrator {
  username: string;
  passwordHash: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Seeds the initial administrator account into the database
 */
async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });

    console.log('Connected to MongoDB successfully');

    const db = connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const administratorsCollection = db.collection<Administrator>('administrators');

    // Create Admin account
    const existingAdmin = await administratorsCollection.findOne({
      username: DEFAULT_ADMIN.username,
    });

    if (existingAdmin) {
      console.log(`Administrator '${DEFAULT_ADMIN.username}' already exists. Skipping creation.`);
    } else {
      console.log('Hashing admin password...');
      const adminPasswordHash = await bcrypt.hash(DEFAULT_ADMIN.password, SALT_ROUNDS);

      const administrator: Administrator = {
        username: DEFAULT_ADMIN.username,
        passwordHash: adminPasswordHash,
        fullName: DEFAULT_ADMIN.fullName,
        email: DEFAULT_ADMIN.email,
        phone: DEFAULT_ADMIN.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Creating administrator account...');
      await administratorsCollection.insertOne(administrator);
      console.log('✅ Administrator account created!');
    }

    // Create User account
    const existingUser = await administratorsCollection.findOne({
      username: DEFAULT_USER.username,
    });

    if (existingUser) {
      console.log(`User '${DEFAULT_USER.username}' already exists. Skipping creation.`);
    } else {
      console.log('Hashing user password...');
      const userPasswordHash = await bcrypt.hash(DEFAULT_USER.password, SALT_ROUNDS);

      const user: Administrator = {
        username: DEFAULT_USER.username,
        passwordHash: userPasswordHash,
        fullName: DEFAULT_USER.fullName,
        email: DEFAULT_USER.email,
        phone: DEFAULT_USER.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Creating user account...');
      await administratorsCollection.insertOne(user);
      console.log('✅ User account created!');
    }

    console.log('\n✅ All accounts created successfully!');
    console.log('\n📋 Default credentials:');
    console.log('\n👤 Admin Account:');
    console.log(`  Username: ${DEFAULT_ADMIN.username}`);
    console.log(`  Password: ${DEFAULT_ADMIN.password}`);
    console.log(`  Email: ${DEFAULT_ADMIN.email}`);
    console.log('\n👤 User Account:');
    console.log(`  Username: ${DEFAULT_USER.username}`);
    console.log(`  Password: ${DEFAULT_USER.password}`);
    console.log(`  Email: ${DEFAULT_USER.email}`);
    console.log('\n⚠️  IMPORTANT: Change the default passwords after first login!\n');
  } catch (error) {
    console.error('Error seeding accounts:', error);
    process.exit(1);
  } finally {
    await connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed script
seedAdmin()
  .then(() => {
    console.log('Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
