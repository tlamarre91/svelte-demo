<script lang="ts">
  import type { Participant, Match } from "@/model";
  import Button from "./Button.svelte";
  import BracketMatchParticipant from "./BracketMatchParticipant.svelte";

  export let participants: Participant[];
  export let participantIndices: [number, number];

  async function reportMatch(index: number) {
    let match: Match;
    switch (index) {
      case 0: {
        match = [participantIndices[0], participantIndices[1]];
        break;
      }
      case 1: {
        match = [participantIndices[1], participantIndices[0]];
        break;
      }
      default: {
        console.warn(`Tried reporting index ${index} as winner`);
        return;
      }
    }

    console.log("report match", match);
  }
</script>

<div class="bracket-match">
  <BracketMatchParticipant
    bind:participant={participants[participantIndices[0]]}
    onClick={() => reportMatch(0)}
  />
  <BracketMatchParticipant
    bind:participant={participants[participantIndices[1]]}
    onClick={() => reportMatch(1)}
  />
</div>

<style>
</style>
