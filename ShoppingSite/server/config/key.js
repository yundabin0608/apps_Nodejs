// 작업모드가 로컬인지, production 모드인지 분기처리
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}