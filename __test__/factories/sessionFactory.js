import Keygrip from 'keygrip';
import { Buffer } from 'buffer';

import * as keys from '../../config/keys';

export default user => {
  const sessionObj = {
    passport: {
      user: user._id.toString(),
    },
  };

  const session = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

  const keygrip = new Keygrip([keys.cookieKey]);

  const sessionSig = keygrip.sign('session=' + session);

  return { session, sessionSig };
};
