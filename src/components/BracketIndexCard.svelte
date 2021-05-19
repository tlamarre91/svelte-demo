<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { SLIDE_DURATION } from "@/constants";
  import type { Bracket } from "@/model";
  import MediaObject from "./MediaObject.svelte";
  import Button from "./Button.svelte";
  import Columns from "./Columns.svelte";
  import Column from "./Column.svelte";

  export let bracket: Bracket;
  let displayName = bracket.name?.length ? bracket.name : "(no name)";
  // TODO: initial render shows non-local time
  let displayCreatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  } as any).format(new Date(bracket.createdAt));
  export let onDelete: undefined | (() => void) = undefined;
  let confirmDelete = false;

  let href = `/brackets/${bracket.slug}`;

  // const CONFIRM_DELETE_TIMEOUT = 5000;
  async function deleteWithConfirmation() {
    if (!confirmDelete) {
      confirmDelete = true;
      // TODO: animate timeout. never mind; this doesn't seem a11y-friendly
      // setTimeout(() => {
      //   confirmDelete = false;
      // }, CONFIRM_DELETE_TIMEOUT);
      return;
    }
    const url = `brackets/${bracket.slug}.json`;
    const res = await fetch(url, { method: "DELETE" });
    if (res.status == 200) {
      onDelete?.();
    }
  }
</script>

<MediaObject>
  <div slot="media-content">
    <h4><a {href}>{displayName}</a></h4>
    <div class="bracket-fields">
      <span class="field-name">
        created:{" "}
      </span>
      <span class="field-value">
        {displayCreatedAt}
      </span>
    </div>
  </div>
  <div slot="media-right">
    <div class="dropdown is-right" class:is-active={confirmDelete}>
      <div class="dropdown-menu">
        {#if confirmDelete}
          <div
            class="dropdown-content"
            transition:slide|local={{ duration: SLIDE_DURATION }}
          >
            <div class="dropdown-item">
              <Button
                isSmall
                on:click={() => {
                  confirmDelete = false;
                }}
              >
                Cancel
              </Button>
            </div>
            <div class="dropdown-item">
              <Button
                isDanger={confirmDelete}
                isSmall
                on:click={deleteWithConfirmation}
              >
                Delete this bracket!
              </Button>
            </div>
          </div>
        {/if}
      </div>
      <div class="dropdown-trigger">
        <Button
          isDelete
          isDanger={confirmDelete}
          isSmall
          on:click={() => {
            confirmDelete = !confirmDelete;
          }}
        />
      </div>
    </div>
  </div>
</MediaObject>

<style lang="scss">
  h4 {
    font-size: 1.05rem;
    font-weight: bold;
  }

  a {
    width: min-content;
    color: inherit;
  }

  a:hover {
    color: rgba(62, 62, 200, 1);
    text-decoration: underline;
  }

  .bracket-fields {
    .field-name {
      font-style: normal;
      color: #999; /* TODO: use color variable */
    }
    .field-value {
      color: inherit;
    }
  }

  :global(.dropdown-content button) {
    width: 100%;
  }
</style>
