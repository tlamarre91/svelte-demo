<script lang="ts">
  export let checked = false;
  export let label = "";
  export let isSuccess = false;
</script>

<label class="checkbox">
  {label}
  <input type="checkbox" bind:checked />
</label>

<style lang="scss">
</style>
