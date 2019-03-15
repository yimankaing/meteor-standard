<template>
    <div class="no-permission">
        <div class="banner">
            <img src="/images/locker.png"/>
        </div>
        <div class="hero kh-regular">
            កំហុស ៤០១ !
        </div>
        <div style="font-size: 18px; color: #ff6b68" class="kh-regular">
            អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង <a @click="logout" style="cursor: pointer">ចាកចេញ</a>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Permission',
    methods: {
      logout() {
        this.$store.dispatch("logout");
      }
    }
  }
</script>

<style scoped>
    .no-permission {
        margin-top: 84px;
        text-align: center;
    }

    .no-permission .hero {
        font-size: 2.5em;
        color: white;
        margin: 12px;
    }

    .no-permission .banner img {
        width: 150px;
        border-radius: 5px;
        padding-bottom: 85px;
    }

    .router-link-active {
        color: #13b8da !important;
    }
</style>
