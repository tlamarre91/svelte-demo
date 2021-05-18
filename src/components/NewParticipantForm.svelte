<script lang="ts">
  import { Participant, makeRandomParticipant } from "@/model";
  import TextInput from "./TextInput.svelte";
  import Button from "./Button.svelte";
  import Checkbox from "./Checkbox.svelte";
  export let onSubmit: (participant: Participant) => void;
  export let name = "";
  export let generateRandom = false;
  export let error = ""; // TODO: show errors
  function submit() {
    const newParticipant = generateRandom ? makeRandomParticipant() : { name };
    console.log("new participant", newParticipant);
    onSubmit(newParticipant);
  }
</script>

<form on:submit|preventDefault={submit}>
  <TextInput bind:value={name} placeholder="New participant name" />
  <Checkbox label="Generate random participant" bind:checked={generateRandom} />
  <Button type="submit">Add</Button>
</form>

<style>
  form {
    max-width: 20em;
    display: flex;
    flex-direction: column;
  }
</style>
