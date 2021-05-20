<script lang="ts">
  import { postJson } from "@/util";
  import type { Bracket, Participant, Match } from "@/model";
  import EditBracket from "./EditBracket.svelte";
  import ViewBracket from "./ViewBracket.svelte";

  export let bracket: Bracket;
  let participants: Participant[] = bracket.participants;
  let finalizedAt: Date | null;
  $: finalizedAt = bracket.finalizedAt;
  let modified = false;

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
</script>

<div class="bracket-page">
  {#if finalizedAt}
    <ViewBracket onSave={save} bind:bracket bind:participants bind:modified />
  {:else}
    <EditBracket
      onSave={save}
      bind:bracket
      bind:participants
      bind:modified
      bind:finalizedAt
    />
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
