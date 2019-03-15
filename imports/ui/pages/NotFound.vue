<template>
  <div class="not-found">
    <div class="banner">
      <img src="/images/safari.gif" />
    </div>
    <div class="hero">
      កំហុស ៤០៤ !
    </div>
    <div style="font-size: 18px" class="kh-regular">
      មិនមានទំព័រដែលត្រូវបង្ហាញ
      <router-link :to="{name:'app_home'}">ត្រឡប់ទៅទំព័រដើម</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  margin-top: 84px;
  text-align: center;
}
.not-found .hero {
  font-size: 2.5em;
  color: #666;
  margin: 12px;
}
.not-found .banner img {
  max-width: 20%;
  border-radius: 5px;
}
.router-link-active {
  color: #13b8da !important;
}
</style>
