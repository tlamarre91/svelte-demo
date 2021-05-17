<script lang="ts">
  export let value: string = "";
  export let placeholder: string = "";
  export let isSuccess = false;
</script>

<input
  class="input"
  type="text"
  class:is-success={isSuccess}
  bind:value
  {placeholder}
/>

<style lang="scss">
</style>
