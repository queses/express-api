import pm2 from 'pm2'
import { EnvUtil } from './core/utils/EnvUtil'

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.start({
    name: 'lx-node',
    script: EnvUtil.isProd ? 'dist/index.js' : 'src/index.ts',    // Script to be run
    exec_mode: 'cluster',                                         // Allows your app to be clustered
    instances: 2,                                                 // Optional: Scales your app by 4
    max_memory_restart: '200M'                                    // Optional: Restarts your app if it reaches 100Mo
  }, (err, apps) => {
    // pm2.disconnect

    if (err) {
      throw err
    }
  });
});
