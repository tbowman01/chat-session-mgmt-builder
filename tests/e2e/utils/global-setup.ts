import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');

  // Ensure test databases and environment are clean
  await cleanTestEnvironment();

  // Set up test data
  await setupTestData();

  // Wait for services to be ready
  await waitForServices();

  console.log('✅ Global setup completed successfully');
}

async function cleanTestEnvironment() {
  console.log('🧹 Cleaning test environment...');
  
  // Clean previous test artifacts
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (fs.existsSync(testResultsDir)) {
    fs.rmSync(testResultsDir, { recursive: true, force: true });
  }

  // Reset test database if it exists
  try {
    execSync('npm run db:reset:test', { stdio: 'pipe' });
    console.log('📊 Test database reset');
  } catch (error) {
    console.log('ℹ️ No test database to reset (this is fine)');
  }
}

async function setupTestData() {
  console.log('📝 Setting up test data...');
  
  // Create test users and sessions
  try {
    execSync('npm run seed:test', { stdio: 'pipe' });
    console.log('🌱 Test data seeded successfully');
  } catch (error) {
    console.log('ℹ️ No test seeding available (this is fine)');
  }
}

async function waitForServices() {
  console.log('⏳ Waiting for services to be ready...');
  
  const maxRetries = 30;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Check if frontend is ready
      const frontendResponse = await fetch('http://localhost:3000', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      
      if (frontendResponse.ok) {
        console.log('✅ Frontend service is ready');
        break;
      }
    } catch (error) {
      console.log(`⏳ Frontend not ready yet (attempt ${retries + 1}/${maxRetries})`);
    }

    retries++;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  if (retries >= maxRetries) {
    throw new Error('❌ Services failed to start within expected time');
  }

  // Additional checks for backend services if needed
  try {
    const backendResponse = await fetch('http://localhost:3001/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (backendResponse.ok) {
      console.log('✅ Backend service is ready');
    }
  } catch (error) {
    console.log('ℹ️ Backend health check not available (this might be fine)');
  }
}

export default globalSetup;