const { execSync } = require('child_process');

console.log('Applying Prisma migration to production...');

try {
  // Apply migrations using the production database URL from Vercel env
  const result = execSync('npx prisma migrate deploy', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  console.log(result);
  console.log('\n✅ Migration applied successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
}
