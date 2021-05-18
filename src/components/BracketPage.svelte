<script lang="ts">
  import { postJson } from "@/util";
  import type { Bracket, Participant } from "@/model";
  import Button from "./Button.svelte";
  import ParticipantList from "./ParticipantList.svelte";
  export let bracket: Bracket;
  // TODO: is this OK, or will the arrays get out of sync?
  let participants: Participant[] = bracket.participants;
  let displayName = bracket.name?.length ? bracket.name : "(no name)";
  let modified = false;
  let editingParticipants = false;

  /**
   * Save the current version of this bracket to the database. For now, we're
   * not worried about only sending modified properties or any other
   * optimization.
   */
  async function save() {
    bracket.participants = participants;
    const url = `brackets/${bracket.slug}.json`;
    const body = JSON.stringify(bracket);
    const res = await postJson(url, body);
    if (res.status == 200) {
      modified = false;
      // TODO: show clear "success" indicator
    } else {
      // TODO: indicate error
    }
  }

  async function onChange() {
    modified = true;
  }
</script>

<svelte:head>
  <title>{displayName}</title>
</svelte:head>

<div class="bracket-page">
  <h3>{displayName}</h3>
  <ParticipantList bind:participants bind:editingParticipants {onChange} />
  <Button isDanger={modified} on:click={save}>save</Button>
</div>

<style>
  /* TODO: factor out h3 and such to global style */
  h3 {
    padding: 0 0 1rem;
    font-size: 1.4rem;
    font-weight: bold;
  }
</style>
