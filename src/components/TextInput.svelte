<script lang="ts">
  export let value: string = "";
  export let placeholder: string = "";
  export let isDanger = false;
  export let isSuccess = false;
  export let disabled = false;
</script>

<input
  class="input"
  type="text"
  class:is-success={isSuccess}
  class:is-danger={isDanger}
  bind:value
  {disabled}
  {placeholder}
/>

<style lang="scss">
</style>
