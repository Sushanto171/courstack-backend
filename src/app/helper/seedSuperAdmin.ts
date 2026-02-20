/* eslint-disable @typescript-eslint/no-explicit-any */

import config from '../config';
import { prisma } from '../config/prisma';
import { hashPassword } from '../utils/bcrypt';


const seedSuperAdmin = async () => {
  console.log('🌱 Seeding super admin...');

  const email = config.superAdmin.email
  const password = config.superAdmin.password;
  const name = config.superAdmin.name;

  if (!email || !password) {
    throw new Error(
      '❌ SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD must be set in .env'
    );
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`⚠️  Super admin already exists: ${email} — skipping`);
      return;
    }

    const hashedPassword = await hashPassword(password);

    const superAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: 'ACTIVE',
        role: "SUPER_ADMIN",
        isVerified: true
      },
      omit: {
        password: true,
      },
    });
    console.log('✅ Super admin created successfully');
    console.log('──────────────────────────────────');
    console.log(`   ID     : ${superAdmin.id}`);
    console.log(`   Name   : ${superAdmin.name}`);
    console.log(`   Email  : ${superAdmin.email}`);
    console.log(`   Role   : ${superAdmin.role}`);
    console.log(`   Status : ${superAdmin.status}`);
    console.log('──────────────────────────────────');
  } catch (error: any) {
    console.error(`❌ Error creating super admin: ${error.message}`);
  }
}

export default seedSuperAdmin;