<script lang="ts">
  export let id: string;
  export let bracketName: string;
  let modified: boolean = false;
  async function save() {
    const res = await fetch(`brackets/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "bar",
      }),
    });
    const val = await res.json();
    console.log(val);
  }
</script>

<svelte:head>
  <title>{bracketName}</title>
</svelte:head>

<div class="bracket-page">
  <input bind:value={bracketName} placeholder="bracket name" />
  <button on:click={save}>save</button>
</div>

<style>
</style>
