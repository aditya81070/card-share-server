import { User } from 'api/models';

export {};

const ADMIN_USER_1 = {
  email: 'admin1@example.com',
  username: 'admin1',
  role: 'admin',
  password: '1admin1'
};
const ADMIN_USER_2 = {
  email: 'admin2@example.com',
  username: 'admin2',
  role: 'admin',
  password: '2admin2'
};

async function setup() {
  const adminUser1 = new User(ADMIN_USER_1);
  await adminUser1.save();

  const adminUser2 = new User(ADMIN_USER_2);
  await adminUser2.save();
}

async function checkNewDB() {
  const adminUser1 = await User.findOne({ email: ADMIN_USER_1.email });
  if (!adminUser1) {
    console.log('- New DB detected ===> Initializing Dev Data...');
    await setup();
  } else {
    console.log('- Skip InitData');
  }
}

checkNewDB();
