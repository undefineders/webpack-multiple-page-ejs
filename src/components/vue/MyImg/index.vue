<template>
    <div>
        <img @click="click" style="height: 100px;" src="./logo.png" alt="" />
    </div>
</template>

<script>
export default {
  name: 'MyImg',
  components: {},
  methods:{
      click(){
          alert('你点击了我')
      }
  }
}
</script>
<style>
</style>
