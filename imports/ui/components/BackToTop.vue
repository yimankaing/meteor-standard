<template>
    <transition name="back-to-top-fade">
        <div :style="`bottom:${this.bottom};right:${this.right};`"
             v-show="visible"
             @click="backToTop"
             class="back-to-top">
            <i class="el-icon-arrow-up"></i>
        </div>
    </transition>
</template>

<script>

  export default {
    name: 'BackToTop',
    props: {
      visibleoffset: {
        type: [String, Number],
        default: 300,
      },
      visibleoffsetbottom: {
        type: [String, Number],
        default: 0,
      },
      right: {
        type: String,
        default: '30px',
      },
      bottom: {
        type: String,
        default: '40px',
      },
    },
    data() {
      return {
        currentScroll: 0
      }
    },
    computed: {
      visible() {
        return this.currentScroll >= this.visibleoffset;
      }
    },
    mounted() {
      $('.main-content').scroll(() => {
        this.currentScroll = $('.main-content').scrollTop();
      });
    },
    methods: {
      backToTop() {
        $(".main-content").animate({scrollTop: 0}, 400);
      }
    },
  }
</script>
<style scoped>
    .back-to-top {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        transition: .3s;
        box-shadow: 0 0 6px rgba(0,0,0,.35);
        background-color: #ffffff;
        position: fixed;
        z-index: 1000;
        cursor: pointer;
    }

    .back-to-top i {
        color: #409eff;
        text-align: center;
        font-size: 18px;
        display: block;
        line-height: 40px;
    }
    .back-to-top-fade-enter-active,
    .back-to-top-fade-leave-active {
        transition: opacity .7s;
    }

    .back-to-top-fade-enter,
    .back-to-top-fade-leave-to {
        opacity: 0;
    }
</style>
