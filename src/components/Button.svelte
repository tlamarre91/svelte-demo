<script lang="ts">
  export let type: string;
</script>

<button
  class="button"
  {type}
  on:click
>
  <slot />
</button>

