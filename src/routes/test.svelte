<script lang="ts">
  import { postJson } from "./util";
  async function foo() {
    const res = await fetch("brackets.json");
    const val = await res.json();
    console.log(val);
  }
  async function bar() {
    const res = await fetch("brackets.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "bar"
      })
    });
    const val = await res.json();
    console.log(val);
  }
</script>

<style>
</style>

<svelte:head>
	<title>Test Page</title>
</svelte:head>

<p>
  <button on:click={foo}>do foo</button>
  <button on:click={bar}>do bar</button>
</p>

