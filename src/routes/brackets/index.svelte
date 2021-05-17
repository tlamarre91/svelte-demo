<script context="module" lang="ts">
  import type { Preload } from "@sapper/common";
  import BracketIndex from "@/components/BracketIndex.svelte";
  export const preload: Preload = async function (this, page, session) {
    const res = await this.fetch(`brackets.json`);
    const bracket = await res.json();
    if (res.status == 200) {
      return { bracket };
    }
  };
</script>

<script lang="ts">
  import type { Bracket } from "@/model";
  export let bracket: Bracket;
</script>

<svelte:head>
  <title>bracket index</title>
</svelte:head>

<BracketIndex />

<style>
</style>
