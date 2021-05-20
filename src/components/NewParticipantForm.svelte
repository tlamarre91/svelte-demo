<script lang="ts">
  import { slide } from "svelte/transition";
  import { SLIDE_DURATION } from "@/constants";
  import { Participant, makeRandomParticipant } from "@/model";
  import TextInput from "./TextInput.svelte";
  import Button from "./Button.svelte";
  import Checkbox from "./Checkbox.svelte";

  export let onSubmit: (participant: Participant) => boolean;
  export let name = "";
  $: name = generateRandom ? "" : name;
  export let generateRandom = false;
  export let nameError = "";
  let placeholder: string;
  $: placeholder = generateRandom
    ? "Random participant"
    : "New participant name";
  let showError: boolean;
  $: showError = nameError.length > 0 && !generateRandom;

  function submit() {
    if (!(generateRandom || name.length > 0)) {
      nameError = "Please provide a name";
      return;
    }
    nameError = "";
    const newParticipant = generateRandom ? makeRandomParticipant() : { name };
    const result = onSubmit(newParticipant);
    if (result) {
      name = "";
    }
  }
</script>

<div>
  <form on:submit|preventDefault={submit}>
    <div class="field">
      <TextInput
        isDanger={showError}
        disabled={generateRandom}
        bind:value={name}
        {placeholder}
      />
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
      <Checkbox label="Generate random name" bind:checked={generateRandom} />
    </div>
    <div class="field">
      <Button type="submit">Add</Button>
    </div>
  </form>
</div>

<style>
  form {
    padding-bottom: 1rem;
    max-width: 20rem;
    display: flex;
    flex-direction: column;
  }
</style>
