<script lang="ts">
  import type { Bracket } from "@/model";
  import BracketIndexCard from "./BracketIndexCard.svelte";
  export let brackets: Bracket[];
  function removeBracket(index: number) {
    const removed = brackets.splice(index, 1);
    brackets = brackets;
  }
</script>

<h3>My Brackets</h3>
<div class="bracket-list">
  {#each brackets as bracket, index (bracket.slug)}
    <BracketIndexCard {bracket} onDelete={() => removeBracket(index)} />
  {/each}
</div>

<style>
  h3 {
    padding: 0 0 1rem;
    font-size: 1.4rem;
    font-weight: bold;
  }
</style>
