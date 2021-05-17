<script lang="ts">
  import TextInput from "./TextInput.svelte";
  import Button from "./Button.svelte";
  import { postJson } from "@/util";
  // TODO: input to set custom URL
  export let name: string = "";
  export let generateParticipants = false;
  export let useRandomSlug = false;
  export let slug = "";
  export let error = ""; // TODO: show errors
  async function save() {
    const body = JSON.stringify({
      name
    });
    const res = await postJson("brackets.json", body);
    const data = await res.json();
    console.log(data);
  }
</script>

<form on:submit|preventDefault={save}>
  <TextInput
    bind:value={name}
    placeholder="New bracket name"
  />
  <label class="checkbox">
    Generate test participants
    <input
      type="checkbox"
      bind:checked={generateParticipants}
    />
  </label>
  <Button type="submit">Add</Button>
</form>

<style>
  form {
    max-width: 20em;
  }
</style>
