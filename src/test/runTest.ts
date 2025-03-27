import { testDirectEmail, testSupabaseEmail } from './emailTest';

const runTests = async () => {
  const recipientEmail = 'YOUR_EMAIL@gmail.com'; // Replace with your email
  const recipientName = 'Your Name'; // Replace with your name

  console.log('Testing direct email sending...');
  const directResult = await testDirectEmail(recipientEmail, recipientName);
  console.log('Direct email test result:', directResult);

  console.log('\nTesting Supabase email integration...');
  const supabaseResult = await testSupabaseEmail(recipientEmail, recipientName);
  console.log('Supabase email test result:', supabaseResult);
};

runTests().catch(console.error); 