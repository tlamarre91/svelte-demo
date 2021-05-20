<script context="module" lang="ts">
  import type { Preload } from "@sapper/common";
  import { Bracket } from "@/model";
  export const preload: Preload = async function (this, page, session) {
    const res = await this.fetch(`brackets/${page.params.slug}.json`);
    const data = await res.json();
    if (res.status == 200) {
      // Don't construct a Bracket here; Sapper doesn't like to serialize
      // non-POJOs. Construct in the component instead.
      // TODO: make sure other routes work this way.
      return { data };
    } else {
      console.error(data?.error);
      return { data: null };
    }
  };
</script>

<script lang="ts">
  import BracketPage from "@/components/BracketPage.svelte";
  export let data: any;
  // TODO: handle errors and null data.
  let bracket = new Bracket(data);
</script>

<BracketPage {bracket} />

<style>
</style>
