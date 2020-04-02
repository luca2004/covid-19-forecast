<template>
  <div id="app">    

    <h1> COVID-19 Forecast </h1>
    <h2> (if #istayhome) </h2>
    <GraphView />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import GraphView from './components/GraphView.vue';

export default {
  name: 'app',
  components: {
    GraphView
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
