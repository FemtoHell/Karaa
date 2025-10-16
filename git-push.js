const { execSync } = require('child_process');

try {
  console.log('Changing directory...');
  process.chdir('D:/Dev/Thanh/resume-builder');
  
  console.log('Adding files to git...');
  execSync('git add .', { stdio: 'inherit' });
  
  console.log('Committing changes...');
  execSync('git commit -m "Update header navigation and fix production environment variables"', { stdio: 'inherit' });
  
  console.log('Pushing to karaa remote...');
  execSync('git push karaa main', { stdio: 'inherit' });
  
  console.log('✅ Successfully pushed to karaa!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
