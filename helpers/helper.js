const path = require('path');
const fs = require('fs');

function chunkArray(arr, size) {
  let chunks = [];
  while (arr.length) {
    chunks.push(arr.splice(0, size));
  };
  return chunks;
}


function averageArray(array) {
    sum = array.reduce((acc, log) => {
      return acc + ((log.latency.firstResponse || 0) +
        (log.latency.total || 0));
    }, 0);
    return sum / array.length;
}


function toDay(service) {
  days = chunkArray(service, 24);
  return days;
}

function toHour(service) {
  let hours = chunkArray(service, 12).map(averageArray);
  let currentHour = new Date().getHours();

  while (hours.length < 145 + currentHour) {
    hours.unshift(null);
  }

  return hours;
}

function getUpTime(service) {
  upTime = service.reduce((acc, log) => {
    if (log.responseCode === 200) {
      acc[0] = acc[0] + 1;
      return acc;
    }
    acc[1] = acc[1] + 1;
    return acc;
  }, [0, 0]);

  return Math.floor(upTime[0] / (upTime[0] + upTime[1])) * 100;
}

function getResponseAndUpTime(service) {

  let data = service.Items;
  let upTime = getUpTime(data);

  let lastHour = new Date().getHours() + 1;
  numLogs = (12 * 24 * 6) + (lastHour * 12);

  data = data.slice(-numLogs);
  data = toDay(toHour(data));

  return [data, upTime];

}

function readFiles(base, dir, files) {

    dir = dir || '';
    files = files || {};
    let pathname = path.join(base, dir);

    let dirList = fs.readdirSync(pathname);

    for (let i = 0; i < dirList.length; i++) {
      let dirpath = path.join(dir, dirList[i]);
      let dirname = dirpath.split(path.sep).join('/');
      let fullpath = path.join(pathname, dirList[i]);
      if (fs.lstatSync(fullpath).isDirectory()) {
        this.readFiles(base, dirpath, files);
      } else {
        files[dirname] = fs.readFileSync(fullpath);
      }
    }

    return files;

}

exports.getResponseAndUpTime = getResponseAndUpTime;
exports.readFiles = readFiles;
