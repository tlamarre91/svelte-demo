<script lang="ts">
  export let type: string | undefined = undefined;
  export let isDelete = false;
  export let isSmall = false;
  export let isSuccess = false;
  export let isDanger = false;
  export let isPrimary = false;
</script>

<button
  class:button={!isDelete}
  class:delete={isDelete}
  class:is-small={isSmall}
  class:is-success={isSuccess}
  class:is-danger={isDanger}
  class:is-primary={isPrimary}
  {type}
  on:click
>
  <slot />
</button>
