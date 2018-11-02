<template>
  <div id="app">
    <NEWPDF ref="c_pdf"></NEWPDF>
  </div>
</template>

<script>
import NEWPDF from './components/newpdf'

export default {
  name: 'App',
  components: {
    NEWPDF
  },
  mounted () {
    this.$root.$refs.c_pdf = this.$refs.c_pdf
  }
}
</script>

<style>

</style>
