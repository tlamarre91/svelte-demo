<script lang="ts">
  import type { Participant, Event } from "@/model";
  import Button from "./Button.svelte";

  export let participant: Participant | undefined;
  export let onClick: () => void;
</script>

<div class="bracket-match-participant">
  {#if participant}
    <span class="name">{participant.name}</span>
  {:else}
    <span class="pending">previous match pending...</span>
  {/if}
</div>

<style>
  .pending {
    font-style: italic;
    color: #888;
  }
</style>
