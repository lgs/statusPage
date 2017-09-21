const profile = function(url) {

  return new Promise((resolve, reject) => {

    const httpLib = url.startsWith('https') ? require('https') : require('http');

    const timer = {
      start:  new Date().valueOf(),
      firstResponse: null,
      end: null,
    };

    const request = httpLib.get(url, (response) => {

      timer.firstResponse = new Date().valueOf();
      const responseCode = response.statusCode;

      if (response.statusCode < 200 || response.statusCode > 299) {
        resolve({
          endpoint : url,
          timestamp: timer.start,
          statusCode: responseCode,
        });
      }

      let body = [];

      response.on('data', (chunk) => {
        now = new Date().valueOf;

        if (now - timer.start > 30000) {
          // 30 second timout
          resolve({
            endpoint : url,
            timestamp: timer.start,
            statusCode: responseCode,
            timeout: true,
          });
        }

        body.push(chunk);
      });

      response.on('end', () => {
        timer.end = new Date().valueOf();
        resolve({
          endpoint : url,
          timestamp: timer.start,
          responseCode: responseCode,
          latency: {
            total: timer.end - timer.firstResponse,
            firstResponse: timer.firstResponse - timer.start,
          }
        });
      });

    });

    request.on('error', (err) => reject(err));

  });
};

exports.profile = profile;
