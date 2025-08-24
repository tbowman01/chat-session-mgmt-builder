import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...');

  // Clean up test data
  await cleanupTestData();

  // Generate test reports
  await generateReports();

  // Archive test artifacts
  await archiveTestArtifacts();

  console.log('✅ Global teardown completed successfully');
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');
  
  try {
    // Clean up test database
    execSync('npm run db:clean:test', { stdio: 'pipe' });
    console.log('📊 Test database cleaned');
  } catch (error) {
    console.log('ℹ️ No test database cleanup needed');
  }

  // Clean up temporary files
  const tempDirs = [
    path.join(process.cwd(), '.temp'),
    path.join(process.cwd(), 'temp'),
    path.join(process.cwd(), 'tmp')
  ];

  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`🗑️ Cleaned temporary directory: ${dir}`);
    }
  });
}

async function generateReports() {
  console.log('📊 Generating test reports...');
  
  const testResultsDir = path.join(process.cwd(), 'test-results');
  const reportsDir = path.join(process.cwd(), 'reports', 'e2e');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Copy test results to reports directory
  if (fs.existsSync(testResultsDir)) {
    try {
      fs.cpSync(testResultsDir, reportsDir, { recursive: true });
      console.log('📋 Test results copied to reports directory');
    } catch (error) {
      console.log('⚠️ Failed to copy test results:', error);
    }
  }

  // Generate summary report
  await generateSummaryReport(reportsDir);
}

async function generateSummaryReport(reportsDir: string) {
  const summaryPath = path.join(reportsDir, 'summary.md');
  const timestamp = new Date().toISOString();
  
  let summary = `# E2E Test Summary\n\n`;
  summary += `**Generated:** ${timestamp}\n\n`;
  
  // Check for results.json
  const resultsJsonPath = path.join(reportsDir, 'results.json');
  if (fs.existsSync(resultsJsonPath)) {
    try {
      const results = JSON.parse(fs.readFileSync(resultsJsonPath, 'utf8'));
      summary += `## Test Results\n\n`;
      summary += `- **Total Tests:** ${results.stats?.total || 'N/A'}\n`;
      summary += `- **Passed:** ${results.stats?.passed || 'N/A'}\n`;
      summary += `- **Failed:** ${results.stats?.failed || 'N/A'}\n`;
      summary += `- **Skipped:** ${results.stats?.skipped || 'N/A'}\n`;
      summary += `- **Duration:** ${results.stats?.duration || 'N/A'}ms\n\n`;
      
      if (results.suites) {
        summary += `## Test Suites\n\n`;
        results.suites.forEach((suite: any) => {
          summary += `### ${suite.title}\n`;
          summary += `- Location: \`${suite.file}\`\n`;
          summary += `- Tests: ${suite.tests?.length || 0}\n`;
          summary += `- Duration: ${suite.duration || 0}ms\n\n`;
        });
      }
    } catch (error) {
      console.log('⚠️ Failed to parse test results JSON');
    }
  }

  summary += `## Artifacts\n\n`;
  summary += `- Screenshots: \`test-results/\`\n`;
  summary += `- Videos: \`test-results/\`\n`;
  summary += `- Traces: \`test-results/\`\n`;
  summary += `- HTML Report: \`playwright-report/index.html\`\n`;

  fs.writeFileSync(summaryPath, summary);
  console.log('📋 Summary report generated');
}

async function archiveTestArtifacts() {
  console.log('📦 Archiving test artifacts...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const archiveDir = path.join(process.cwd(), 'archives', 'e2e', timestamp);
  
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  // Archive directories to preserve
  const dirsToArchive = [
    'test-results',
    'playwright-report',
    'reports/e2e'
  ];

  dirsToArchive.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      const archivePath = path.join(archiveDir, dir);
      try {
        fs.cpSync(fullPath, archivePath, { recursive: true });
        console.log(`📦 Archived: ${dir}`);
      } catch (error) {
        console.log(`⚠️ Failed to archive ${dir}:`, error);
      }
    }
  });

  console.log(`📦 Test artifacts archived to: ${archiveDir}`);
}

export default globalTeardown;