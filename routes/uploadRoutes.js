const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuidv1 = require('uuid/v1');

const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuidv1()}.jpeg}`;

    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 's3-testing-1234',
        ContentType: 'jpeg',
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  });
};
