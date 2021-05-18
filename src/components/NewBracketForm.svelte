<script lang="ts">
  import { goto } from "@sapper/app";
  import { postJson } from "@/util";
  import { Bracket, Participant } from "@/model";
  import TextInput from "./TextInput.svelte";
  import Button from "./Button.svelte";
  import Checkbox from "./Checkbox.svelte";

  // TODO: input to set custom URL
  export let name: string = "";
  export let generateParticipants = false;
  export let useRandomSlug = true;
  export let slug = "";
  export let error = ""; // TODO: show errors
  async function save() {
    const body = JSON.stringify({
      name,
      generateParticipants,
    });
    const res = await postJson("brackets.json", body);
    if (res.status == 200) {
      const data = await res.json();
      const slug = data?.slug;
      if (slug != undefined) {
        goto(`brackets/${slug}`);
      } else {
        // TODO: handle errors
      }
    }
  }
</script>

<form on:submit|preventDefault={save}>
  <TextInput bind:value={name} placeholder="New bracket name" />
  <Checkbox
    label="Generate test participants"
    bind:checked={generateParticipants}
  />
  <Button type="submit">Add</Button>
</form>

<style>
  form {
    max-width: 20em;
    display: flex;
    flex-direction: column;
  }
</style>
