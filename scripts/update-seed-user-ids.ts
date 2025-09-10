#!/usr/bin/env tsx

/**
 * Helper script to update placeholder user IDs in seed.ts with actual user IDs
 * Run this after creating users through Better Auth authentication
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function updateSeedUserIds() {
  try {
    console.log('🔍 Fetching users from database...');
    
    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in database. Please create users through Better Auth first.');
      return;
    }

    console.log(`✅ Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ID: ${user.id}`);
    });

    // Read the seed file
    const seedFilePath = join(process.cwd(), 'prisma', 'seed.ts');
    let seedContent = readFileSync(seedFilePath, 'utf-8');

    // Create mapping of placeholder IDs to actual user IDs
    const userMapping: Record<string, string> = {};
    
    // Map first 5 users to placeholder IDs
    const placeholderIds = [
      'PLACEHOLDER_USER_1',
      'PLACEHOLDER_USER_2', 
      'PLACEHOLDER_USER_3',
      'PLACEHOLDER_USER_4',
      'PLACEHOLDER_USER_5'
    ];

    placeholderIds.forEach((placeholderId, index) => {
      if (users[index]) {
        userMapping[placeholderId] = users[index].id;
        console.log(`📝 Mapping ${placeholderId} → ${users[index].id} (${users[index].name})`);
      }
    });

    // Replace placeholder IDs with actual user IDs
    let updatedContent = seedContent;
    Object.entries(userMapping).forEach(([placeholder, actualId]) => {
      const regex = new RegExp(placeholder, 'g');
      updatedContent = updatedContent.replace(regex, actualId);
    });

    // Write the updated content back to the file
    writeFileSync(seedFilePath, updatedContent, 'utf-8');

    console.log('✅ Successfully updated seed.ts with actual user IDs!');
    console.log('🔄 You can now run "npm run db:seed" to seed the database with real user associations.');

  } catch (error) {
    console.error('❌ Error updating seed user IDs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateSeedUserIds();
