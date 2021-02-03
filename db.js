const homedir = require('os').homedir();
const p = require('path');
const dbPath = p.join(homedir, '.todo')
const fs = require('fs')
const db = {
  //读任务
  read(pathName = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(pathName, { flag: 'a+' }, (error, data) => {
        if (error) {
          return reject(error)
        } else {
          let list
          try {
            list = JSON.parse(data.toString())
          } catch (error2) {
            list = []
          }
          resolve(list)
        }
      })
    }
    )
  },
  //写任务
  write(content, pathName = dbPath) {
    const string = JSON.stringify(content);
    return new Promise((resolve, reject) => {
      fs.writeFile(pathName, string + '\n', (error3, data) => {
        if (error3) {
          return reject(error3)
        }
        return resolve()
      })
    })
  },
  // showAll(){
  //  const list=db.read()
  //  console.log(list)
  // //  list.forEach((task,index )=> {
  // //    console.log(`${index+1}-${task}`)
  // //  });
  // }
}

module.exports = db;