<script lang="ts">
  import { slide } from "svelte/transition";
  import { SLIDE_DURATION } from "@/constants";
</script>

<div class="media" transition:slide|local={{ duration: SLIDE_DURATION }}>
  {#if $$slots["media-left"]}
    <div class="media-left">
      <slot name="media-left" />
    </div>
  {/if}
  {#if $$slots["media-content"]}
    <div class="media-content">
      <slot name="media-content" />
    </div>
  {/if}
  {#if $$slots["media-right"]}
    <div class="media-right">
      <slot name="media-right" />
    </div>
  {/if}
</div>

<style>
</style>
