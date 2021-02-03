const homedir = require('os').homedir();
const p = require('path');
const dbPath = p.join(homedir, '.todo')
const db = require('./db.js')
const inquirer = require('inquirer');

module.exports.add = async (title) => {
  //读取之前的任务
  const list = await db.read()
  //添加任务
  const task = {
    title: title,
    done: false
  }
  list.push(task)

  //存储任务
  db.write(list, dbPath)
}
module.exports.clear = async (title) => {
  db.write([], dbPath)
}
function markAsDone(list, index){
  list[index].done = true;
  db.write(list)
}
function markAsUndone(list, index){
  list[index].done = false;
  db.write(list)
}
function updateTitle(list, index){
  const question = [
    {
      type: 'input',
      name: 'newTitle',
      message: "请输入新标题",
    },
  ]
  inquirer.prompt(question).then((answers) => {
    list[index].title = answers.newTitle;
    db.write(list)
  });
}
function remove(list, index){
  list.splice(index, 1)
  db.write(list)
}
const createTask = (list) => {
  inquirer.prompt(
    [
      {
        type: 'input',
        name: 'task',
        message: "请输入任务名",
      },
    ]
  ).then((answer) => {
    list.push({ title: answer.task, done: false })
    db.write(list)
  });
}
const askForAction = (list, index) => {
  inquirer.prompt(
    {
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: [{ name: '退出', value: 'quit' }, { name: '已完成', value: 'markAsDone' },
      { name: '未完成', value: 'markAsUndone' }, { name: '改标题', value: 'updateTitle' }, { name: '删除', value: 'remove' },
      ]
    }
  ).then((answer) => {
    const actions={
      markAsDone,
      markAsUndone,
      updateTitle,
      remove,
    }
    const action=actions[answer.action]
    if(action){
      action(list,index)
    }
    })}
const printTask = (list) => {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'index',
        message: '请选择任务',
        choices: [{ name: '退出', value: '-1' },
        ...list.map((item, index) => {
          return ({ name: `${item.done ? '[×]' : '[-]'}${index + 1}-${item.title}`, value: index.toString() })
        }), {
          name: '+创建任务', value: '-2'
        }
        ]
      },
    )
    .then((answers) => {
      const index = parseInt(answers.index)
      if (index >= 0) {
        askForAction(list,index)
      } else if (index === -2) {
        createTask(list)
        //创建任务
}
    })
}

module.exports.showAll = async () => {
  const list = await db.read()
  printTask(list)
}
