<script lang="ts">
  async function foo() {
    const res = await fetch("brackets.json");
    const val = await res.json();
    console.log(val);
  }
  async function bar() {
  }
</script>

<svelte:head>
  <title>Test Page</title>
</svelte:head>

<p>
  <button on:click={foo}>do foo</button>
  <button on:click={bar}>do bar</button>
</p>

<style>
</style>
