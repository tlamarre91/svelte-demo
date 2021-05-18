<script lang="ts">
  import type { Bracket } from "@/model";
  async function foo() {
    const res = await fetch("brackets.json");
    const val = await res.json();
    console.log(val);
  }

  async function deleteBrackets() {
    const getAllRes = await fetch("brackets.json");
    const data = await getAllRes.json();
    const slugs = data.map((d: Bracket) => d.slug);
    console.log(`Deleting: ${slugs.join(", ")}`);
    for (let i = 0; i < slugs.length; i += 1) {
      const url = `brackets/${slugs[i]}.json`;
      const res = await fetch(url, {
        method: "DELETE",
      });
    }
  }
</script>

<svelte:head>
  <title>Test Page</title>
</svelte:head>

<p>
  <button on:click={foo}>do foo</button>
  <button on:click={deleteBrackets}>delete all brackets</button>
</p>

<style>
</style>
