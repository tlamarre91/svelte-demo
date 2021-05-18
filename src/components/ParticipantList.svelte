<script lang="ts">
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
  }
</script>

<ul class="participant-list">
  <Button
    isPrimary={editingParticipants}
    on:click={() => {
      // TODO: save added participants without requiring another click
      editingParticipants = !editingParticipants;
    }}
  >
    {#if editingParticipants}
      Finish adding participants
    {:else}
      Add participants
    {/if}
  </Button>
  {#if editingParticipants}
    <NewParticipantForm onSubmit={addParticipant} />
  {/if}
  {#each participants as participant, index}
    <ParticipantListItem
      {participant}
      onDelete={() => removeParticipant(index)}
    />
  {/each}
</ul>

<style>
</style>
