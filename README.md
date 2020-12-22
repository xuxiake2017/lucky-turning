# lucky-turning
一个基于 `Vue2.0` 的幸运大转盘抽奖组件，本来市面上已经有很多类似的组件了，我自己也一直是本着有轮子就不自己造轮子的想法[狗头]，但是找了好久，基本是没有满足要求的，市面上的组件基本上都是设置了固定的匀速旋转时间，目前项目上有个需求就是需求后台计算抽奖结果，后台没给出结果之前，大转盘需要一直匀速的旋转，等到后台给出抽奖结果，然后再慢慢的减速直到指定的奖品位置，该组件的大致流程也就是这样子

**已知问题**

该组件的核心旋转动画是基于 [`animejs`](https://animejs.com/) 实现的，在性能不好的手机上会有很明显的卡顿现象，请知悉（后续会更新提供使用 `canvas` 实现的，在移动端的体验应该会好很多）

## 运行项目先
```
npm install
```

### 运行例子
```
npm run serve
```

### 构建库
```
npm run build
```

### 快速开始

```html
<template>
  <div>
    <LuckyTurning
      :lottery-times="lotteryTimes"
      :prize-list="prizeList"
      :get-prize="getPrize"
      @lottery-over="lotteryOver"
    />
  </div>
</template>
<script>
import LuckyTurning from 'lucky-turning'
import Vue from 'vue'
Vue.use(LuckyTurning)
import 'lucky-turning/lib/lucky-turning.css'
export default {
  data() {
    return {
      lotteryTimes: 100,
      prizeList: [
        {
          value: 1,
          label: 'iPhone1',
          img: 'https://read-1252195440.cos.ap-guangzhou.myqcloud.com/iPhone12.jpg'
        },
        {
          value: 2,
          label: 'iPhone2',
          img: 'https://read-1252195440.cos.ap-guangzhou.myqcloud.com/iPhone12.jpg'
        },
        {
          value: 3,
          label: 'iPhone3',
          img: 'https://read-1252195440.cos.ap-guangzhou.myqcloud.com/iPhone12.jpg'
        },
        {
          value: 4,
          label: 'iPhone4',
          img: 'https://read-1252195440.cos.ap-guangzhou.myqcloud.com/iPhone12.jpg'
        },
        {
          value: 5,
          label: 'iPhone5',
          img: 'https://read-1252195440.cos.ap-guangzhou.myqcloud.com/iPhone12.jpg'
        },{
          value: 6,
          label: 'iPhone6',
          img: 'https://read-1252195440.cos.ap-guangzhou.myqcloud.com/iPhone12.jpg'
        },
      ]
    }
  },
  methods: {
    getPrize() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(Number.parseInt(Math.random() * 5))
        }, 2000)
      })
    },
    lotteryOver(index) {
      alert(`抽中了${this.prizeList[index].label}`)
      const a = ''
    }
  }
}
</script>
<style>
html {
  font-size: 40px;
}
</style>
```

### Props

| 参数         | 说明     | 类型     | 可选值 | 默认值        |
| ----         | ----    | ----     | ----  | ----          |
| prizeList    | 奖品列表 | Array    | —     | —             |
| props        | 配置选项 | Object   | —     | 下文的配置选项 |
| getPrize     | 抽奖函数 | Function | —     | —             |
| lotteryTimes | 抽奖次数 | Number   | —     | —             |

### 配置选项(props)
```js
// 配置选项
const properties = {
  // 奖品值的别名
  value: 'value',
  // 奖品名称的别名
  label: 'label',
  // 奖品图片的别名
  img: 'img',
  // 自定义扇区的颜色
  colors: [
    'rgb(249, 108, 28)',
    'rgb(255, 255, 255)'
  ],
  // 匀速动画配置
  linearAnimation: {
    // 角度
    rotate: 720,
    // 时间
    duration: 1200
  },
  // 结束动画配置
  finalAnimation: {
    // 角度
    rotate: 1800,
    // 时间
    duration: 8500,
    // 时间曲线
    // 具体查看 https://easings.net/
    easing: 'easeOutQuart'
  }
}
```