<template>
  <tr>
    <th scope="row">{{ position + 1 }}</th>
    <td>{{ row.name }} <span class="badge badge-pill badge-info" v-if="row.category">{{ row.category }}</span></td>
    <td>{{ row.monthlyCost | toCurrency}}</td>
    <td>{{ row.yearlyCost | toCurrency}}</td>
    <td>
      <button type="button" class="close" aria-label="Close">
        <span aria-hidden="true" @click="deleteRow">&times;</span>
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['position', 'row'],
  methods: {
    deleteRow () {
      this.$emit('deleteRow', this.position)
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
