module.exports = {
    NODE_ENV: "'prroduction'",
    /*
    * 1、process.env.BRANC 读取终端执行的npm命令
    * 2、BRANCH: JSON.stringify(process.env.BRANCH) || 'dev'：用于接受npm命令的修改
    * 3、默认dev
    */
    BRANCH: JSON.stringify(process.env.BRANCH) || "'dev'"
}