<script lang="ts">
  import type {Bracket, Participant, Event } from "@/model";
  import Column from "./Column.svelte";
  import BracketMatch from "./BracketMatch.svelte";

  export let bracket: Bracket;
  /**
   * Which round of the tournament does this column describe? (0, 1, ... n-1 =
   * semifinals, n = final)
   */
  export let round: number;
</script>

<Column>
  <div class="bracket-round-column">
    bracket round column placeholder
  </div>
</Column>

<style>
</style>
