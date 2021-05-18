<script lang="ts">
  export let smallMobileGaps = false;
</script>

<div class="columns" class:is-0-mobile={smallMobileGaps}>
  <slot />
</div>
