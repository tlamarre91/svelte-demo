<script lang="ts">
  import type { Participant } from "@/model";
  import Button from "./Button.svelte";
  export let participant: Participant;
  export let onDelete: undefined | (() => void) = undefined;
</script>

<li class="media participant-list-item">
  <div class="media-content">
    {participant.name}
  </div>
  <div class="media-right">
    <Button
      isSmall
      isDelete
      on:click={() => {
        onDelete?.();
      }}
    />
  </div>
</li>

<style>
</style>
