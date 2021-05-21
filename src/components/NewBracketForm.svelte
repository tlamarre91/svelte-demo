<script lang="ts">
  import { slide } from "svelte/transition";
  import { SLIDE_DURATION } from "@/constants";
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
  let nameError = "";
  let showError: boolean;
  $: showError = nameError.length > 0 && name.length == 0;

  async function save() {
    if (!(name.length > 0)) {
      nameError = "Please provide a name";
      return;
    }
    nameError = "";
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
  <div class="field">
    <TextInput bind:value={name} placeholder="New bracket name" />
      {#if showError}
        <div
          class="has-text-danger"
          transition:slide={{ duration: SLIDE_DURATION }}
        >
          {nameError}
        </div>
      {/if}
  </div>
  <div class="field">
    <Checkbox
      label="Generate test participants"
      bind:checked={generateParticipants}
    />
  </div>
  <div class="field">
    <Button type="submit">Add</Button>
  </div>
</form>

<style>
  form {
    max-width: 20em;
    display: flex;
    flex-direction: column;
  }
</style>
