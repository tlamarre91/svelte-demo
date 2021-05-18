<script context="module" lang="ts">
  import type { Preload } from "@sapper/common";
  import BracketIndex from "@/components/BracketIndex.svelte";
  export const preload: Preload = async function (this, page, session) {
    const res = await this.fetch(`brackets.json`);
    const brackets = await res.json();
    if (res.status == 200) {
      return { brackets };
    }
  };
</script>

<script lang="ts">
  import type { Bracket } from "@/model";
  export let brackets: Bracket[];
</script>

<svelte:head>
  <title>My Brackets</title>
</svelte:head>

<BracketIndex {brackets} />

<style>
</style>
