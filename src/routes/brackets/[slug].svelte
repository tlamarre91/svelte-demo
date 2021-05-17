<script context="module" lang="ts">
  import type { Preload } from "@sapper/common";
  const preload: Preload = async function (this, page, session) {
    const res = await this.fetch(`brackets/${page.params.slug}.json`);
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
  <title>{bracket.name}</title>
</svelte:head>

<p>view bracket placeholder</p>

<style>
</style>
