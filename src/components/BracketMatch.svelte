<script lang="ts">
  import type { Participant, Event } from "@/model";
  import Button from "./Button.svelte";
  import BracketMatchParticipant from "./BracketMatchParticipant.svelte";

  export let participant1: Participant | undefined;
  export let participant2: Participant | undefined;

  async function reportWinner(index: number) {
    let winner: Participant | undefined;
    switch (index) {
      case 0: {
        winner = participant1;
        break;
      }
      case 1: {
        winner = participant2;
        break;
      }
      default: {
        console.warn(`Tried reporting index ${index} as winner`);
        return;
      }
    }

    console.log("report winner", winner);
  }
</script>

<div class="bracket-match">
  <BracketMatchParticipant
    bind:participant={participant1}
    onClickWinner={() => reportWinner(0)}
  />
  <BracketMatchParticipant
    bind:participant={participant2}
    onClickWinner={() => reportWinner(1)}
  />
</div>

<style>
</style>
