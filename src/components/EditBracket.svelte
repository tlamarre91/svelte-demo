<script lang="ts">
  import { slide } from "svelte/transition";
  import { SLIDE_DURATION } from "@/constants";
  import type { Bracket, Participant, Match } from "@/model";
  import Button from "./Button.svelte";
  import ParticipantList from "./ParticipantList.svelte";

  // TODO: find a more sensible set of props. These are redundant/sloppy.
  export let bracket: Bracket;
  export let participants: Participant[] = bracket.participants;
  export let finalizedAt = bracket.finalizedAt;
  export let finalizeError = "";
  let displayName = bracket.name?.length ? bracket.name : "(no name)";
  export let modified = false;
  let editingParticipants = false;
  export let onSave: () => Promise<void>;

  async function tryFinalize() {
    try {
      // TODO: if I learned how stores work, I could probably avoid
      // re-assigning the participants array like this.
      bracket.participants = participants;
      bracket.finalize();
      await onSave();
      finalizedAt = bracket.finalizedAt;
    } catch (err) {
      finalizeError = err.message;
    } finally {
    }
  }

  async function onChange() {
    modified = true;
    finalizeError = "";
  }
</script>

<svelte:head>
  <title>Editing {displayName}</title>
</svelte:head>

<div class="edit-bracket">
  <h3>Editing {displayName}</h3>
  <ParticipantList bind:participants bind:editingParticipants {onChange} />
  <Button isDanger={modified} on:click={onSave}>Save</Button>
  <Button on:click={tryFinalize}>Finalize</Button>
  {#if finalizeError.length}
    <div
      class="has-text-danger"
      transition:slide={{ duration: SLIDE_DURATION }}
    >
      {finalizeError}
    </div>
  {/if}
</div>

<style>
  /* TODO: factor out h3 and such to global style */
  h3 {
    padding: 0 0 1rem;
    font-size: 1.4rem;
    font-weight: bold;
  }
</style>
