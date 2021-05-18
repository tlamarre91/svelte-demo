<script context="module" lang="ts">
  import type { Preload } from "@sapper/common";
  export const preload: Preload = async function (this, page, session) {
    const res = await this.fetch(`brackets/${page.params.slug}.json`);
    const data = await res.json();
    if (res.status == 200) {
      return { bracket: data };
    } else {
      console.error(data?.error);
    }
  };
</script>

<script lang="ts">
  import BracketPage from "@/components/BracketPage.svelte";
  import type { Bracket } from "@/model";
  export let bracket: Bracket;
</script>

<BracketPage {bracket} />

<style>
</style>
