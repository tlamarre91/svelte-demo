<script context="module" lang="ts">
  import type { Preload } from "@sapper/common";
  export const preload: Preload = async function (this, page, session) {
    console.log("preload session", session);
    const res = await this.fetch(`brackets/${page.params.slug}.json`);
    const data = await res.json();
    if (res.status == 200) {
      return { bracket: data };
    } else {
      console.error(data?.error);
    }
  };
  function save() {}
</script>

<script lang="ts">
  import type { Bracket } from "@/model";
  export let bracket: Bracket;
  let displayName = bracket.name?.length ? bracket.name : bracket.slug;
</script>

<svelte:head>
  <title>Editing {displayName}</title>
</svelte:head>

<p>edit bracket placeholder</p>

<style>
</style>
