<template>
  <div id="app">
    <LuckyTurning
      :lottery-times="lotteryTimes"
      :prize-list="prizeList"
      :get-prize="getPrize"
      @lottery-over="lotteryOver"
    />
  </div>
</template>

<script>
import iphoneImg from './assets/iphone.jpg'
export default {
  name: 'App',
  data() {
    return {
      lotteryTimes: 100,
      prizeList: [
        {
          value: 1,
          label: 'iPhone1',
          img: iphoneImg
        },
        {
          value: 2,
          label: 'iPhone2',
          img: iphoneImg
        },
        {
          value: 3,
          label: 'iPhone3',
          img: iphoneImg
        },
        {
          value: 4,
          label: 'iPhone4',
          img: iphoneImg
        },
        {
          value: 5,
          label: 'iPhone5',
          img: iphoneImg
        },{
          value: 6,
          label: 'iPhone6',
          img: iphoneImg
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
    }
  }
}
</script>

<style>
html {
  font-size: 40px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
