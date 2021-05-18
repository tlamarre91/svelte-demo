<script lang="ts">
  import type { Participant } from "@/model";
  import MediaObject from "./MediaObject.svelte";
  import Button from "./Button.svelte";

  export let participant: Participant;
  export let onDelete: undefined | (() => void) = undefined;
</script>

<MediaObject>
  <div slot="media-content">
    {participant.name}
  </div>
  <div slot="media-right">
    <Button
      isSmall
      isDelete
      on:click={() => {
        onDelete?.();
      }}
    />
  </div>
</MediaObject>

<style>
</style>
