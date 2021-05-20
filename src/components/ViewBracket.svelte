<script lang="ts">
  import { slide } from "svelte/transition";
  import { SLIDE_DURATION } from "@/constants";
  import type { Bracket, Participant, Match } from "@/model";
  import Button from "./Button.svelte";
  import BracketRoundColumn from "./BracketRoundColumn.svelte";

  export let bracket: Bracket;
  export let participants: Participant[] = bracket.participants;
  let displayName = bracket.name?.length ? bracket.name : "(no name)";
  export let modified = false;
  export let onSave: () => Promise<void>;

  async function onChange() {
    modified = true;
  }
</script>

<svelte:head>
  <title>{displayName}</title>
</svelte:head>

<div class="view-bracket">
  <h3>{displayName}</h3>
  <BracketRoundColumn />
  <Button isDanger={modified} on:click={onSave}>Save</Button>
</div>

<style>
  /* TODO: factor out h3 and such to global style */
  h3 {
    padding: 0 0 1rem;
    font-size: 1.4rem;
    font-weight: bold;
  }
</style>
