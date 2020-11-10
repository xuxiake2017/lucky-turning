<template>
  <div class="lucky-turning-container-wrap">
    <div class="lucky-turning-container">
      <div class="lucky-turning__sectors-wrap">
        <!-- 扇区 -->
        <div class="lucky-turning__sectors" ref="sectors">
          <div class="lucky-turning__sectors-list">
            <!-- 扇区项 -->
            <div v-for="(item, index) in prizeList" class="lucky-turning__sectors-item" :style="{ transform: `rotate(${index * itemDeg}deg)` }" :key="index">
              <div class="lucky-turning__sectors-item-inner" :style="itemStyle(index)">
                <div class="lucky-turning__sectors-item-inner-content" :style="{ transform: `rotate(-${itemDeg / 2}deg)` }">
                  <!-- 扇区项内显示的内容插槽（作用域插槽） -->
                  <slot name="sectors-item" :item="item">
                    <div :style="{ color: properties.colors[(index + 1) % 2] }">
                      {{item[properties.label]}}
                    </div>
                    <div>
                      <img :src="item[properties.img]" />
                    </div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 中间抽奖按钮 -->
        <div class="lucky-turning__sectors-arrow-btn" @click="clickHandler">
          <!-- 抽奖按钮内显示的内容插槽 -->
          <slot name="arrow-btn">
            <div>
              <div>抽奖</div>
              <div>({{lotteryTimes}}次)</div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 转动动画使用animejs
import anime from 'animejs'
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
export default {
  name: 'LuckyTurning',
  props: {
    // 奖品列表
    prizeList: {
      type: Array,
      required: true
    },
    // 配置选项
    props: {
      type: Object,
      default: () => {
        return properties
      }
    },
    // 抽奖函数
    getPrize: {
      type: Function,
      required: true
    },
    // 抽奖次数
    lotteryTimes: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 抽奖的结果
      result: null,
      // 是否获取到抽奖结果
      finished: false,
      // 匀速动画实例
      animation: null,
      // 默认配置与用户配置混合后的配置选项（浅拷贝）
      properties: properties
    }
  },
  created () {
    // 混合默认配置与用户配置
    this.properties = Object.assign(this.properties, this.$props.props)
  },
  computed: {
    // 奖品数量
    prizeNum: function () {
      return this.prizeList.length
    },
    // 每片扇区的角度
    itemDeg: function () {
      return 360 / this.prizeNum
    },
    // 匀速动画当前的角度
    linearDeg: function () {
      if (this.animation) {
        const currentValue = this.animation.animations[0].currentValue
        const matches = currentValue.match(/(.+)deg/)
        return matches[1]
      }
      return ''
    },
    // 扇区node节点
    $sectors: function () {
      return this.$refs.sectors
    }
  },
  methods: {
    // 扇区项样式
    itemStyle (index) {
      return {
        background: this.properties.colors[index % 2],
        transform: `rotate(${this.itemDeg}deg)`
      }
    },
    // 获取任意范围随机数
    getRandomArbitrary (min, max) {
      return Math.random() * (max - min) + min
    },
    // 计算显示结果的转动角度
    calcDeg () {
      const tmp = this.prizeNum - this.result
      return tmp * this.itemDeg - this.itemDeg * this.getRandomArbitrary(0.2, 0.8)
    },
    // 匀速动画的更新事件处理
    animeUpdateHandler () {
      // 避免匀速动画和结束动画之间产生割裂，当匀速动画回归原点时再开始结束动画
      if (this.finished && Math.abs(Number.parseInt(this.linearDeg) - 360) <= 5) {
        // 显示结果的转动角度
        const resultDeg = this.calcDeg(this.result)
        // 暂停匀速动画
        this.animation.pause()
        let rotate = this.properties.finalAnimation.rotate
        let duration = this.properties.finalAnimation.duration
        const degDuration = duration / rotate
        if (resultDeg - 180 > 0) {
          rotate = rotate - 360 + resultDeg
          duration = duration - degDuration * resultDeg
        } else {
          rotate = rotate + resultDeg
          duration = duration + degDuration * resultDeg
        }
        // 开始结束动画
        anime({
          targets: this.$sectors,
          rotate: `${rotate}deg`,
          duration: duration,
          direction: 'normal',
          easing: this.properties.finalAnimation.easing,
          endDelay: 0,
          complete: () => {
            this.finished = false
            // 抽奖结束
            this.$emit('lottery-over', this.result)
          }
        })
      }
    },
    // 点击抽奖按钮
    clickHandler () {
      if (this.lotteryTimes === 0) {
        // 抽奖次数用完
        this.$emit('times-use-up')
        return
      }
      // 抽奖开始
      this.$emit('lottery-start', this.result)
      if (!this.animation) {
        // 开始匀速动画，等待后台的抽奖结果
        this.animation = anime({
          targets: this.$sectors,
          rotate: `${this.properties.linearAnimation.rotate}deg`,
          duration: this.properties.linearAnimation.duration,
          easing: 'linear',
          loop: true,
          direction: 'normal',
          endDelay: 0,
          update: () => {
            this.animeUpdateHandler()
          }
        })
      } else {
        this.animation.play()
      }
      // 获取抽奖结果
      Promise.resolve(this.getPrize()).then(res => {
        this.finished = true
        this.result = res
      })
    }
  }
}
</script>

<style scoped lang="scss">
$width-outter: 8rem;
$width: $width-outter * 0.735;
.lucky-turning-container-wrap {
  text-align: center;
  width: 100%;
  font-size: .3rem;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lucky-turning-container {
  width: $width-outter;
  height: $width-outter;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../assets/lucky-turning-circle.png") no-repeat;
  background-size: contain;
}
.lucky-turning__sectors-wrap {
  position: relative;
  width: $width;
  height: $width;
  overflow: hidden;
  border-radius: 50%;
}
.lucky-turning__sectors {
  width: 100%;
  height: 100%;
}
.lucky-turning__sectors-list {
  width: 100%;
  height: 100%;
}
.lucky-turning__sectors-item {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  clip: rect(0 $width $width $width / 2);
}
.lucky-turning__sectors-item-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  clip: rect(0 $width / 2 $width 0rem);
  border-radius: 50%;
  box-shadow: inset 1px 1px 5px #000;
}
.lucky-turning__sectors-item-inner-content {
  height: 50%;
  transform-origin: bottom;
  display: inline-block;
  padding-top: .2rem;
  img {
    width: 1rem;
    object-fit: contain;
  }
}
.lucky-turning__sectors-arrow-btn {
  background: url("../assets/arrow-btn.png");
  background-size: 2.5rem 2.5rem;
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #F22E00;
}
</style>
