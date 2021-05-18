<script lang="ts">
  import { fade, fly, slide } from "svelte/transition";
  import { SLIDE_DURATION } from "@/constants";
  import type { Participant } from "@/model";
  import Button from "./Button.svelte";
  import ParticipantListItem from "./ParticipantListItem.svelte";
  import NewParticipantForm from "./NewParticipantForm.svelte";

  export let participants: Participant[];
  export let onChange: (() => void) | undefined = undefined;
  export let editingParticipants = false;
  function removeParticipant(index: number) {
    const removed = participants.splice(index, 1);
    participants = participants;
    onChange?.();
  }

  function addParticipant(participant: Participant) {
    participants = [...participants, participant];
    onChange?.();
    return true; // TODO: handle hitting PARTICIPANT_LIMIT
  }
</script>

<div class="edit-ui">
  {#if !editingParticipants}
    <div transition:slide|local={{ duration: SLIDE_DURATION }}>
      <Button
        isPrimary={editingParticipants}
        on:click={() => {
          editingParticipants = true;
        }}
      >
        Add participants
      </Button>
    </div>
  {:else}
    <div transition:slide|local={{ duration: SLIDE_DURATION }}>
      <NewParticipantForm onSubmit={addParticipant} />
      <!-- TODO: this button could go in NewParticipantForm -->
      <Button
        isPrimary
        on:click={() => {
          // TODO: could save added participants without requiring another click.
          editingParticipants = false;
        }}
      >
        Finish adding participants
      </Button>
    </div>
  {/if}
</div>
<!-- Using participant object as key isn't great but it works for now -->
<div class="participant-list">
  {#each participants as participant, index (participant)}
    <ParticipantListItem
      {participant}
      onDelete={() => removeParticipant(index)}
    />
  {/each}
</div>

<style>
  .edit-ui {
    padding: 0.5rem;
  }

  .participant-list {
    padding: 1rem;
    max-width: 20rem;
  }
</style>
