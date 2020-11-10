import LuckyTurning from './lucky-turning'

const compontents = [
  LuckyTurning
]

const install = function(Vue) {
  // 判断是否安装
  if(install.installed) {
    return
  }
  install.installed = true
  // 遍历注册全局组件
  compontents.map(compontent => Vue.component(compontent.name, compontent))
}

// 判断是否是直接引入文件
if(typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有install，才能被Vue.ues()方法安装
  install,
  // 以下是具体的组件列表
  LuckyTurning
}