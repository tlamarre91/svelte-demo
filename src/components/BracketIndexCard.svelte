<script lang="ts">
  import type { Bracket } from "@/model";
  import Button from "./Button.svelte";
  import Columns from "./Columns.svelte";
  import Column from "./Column.svelte";
  export let bracket: Bracket;
  let displayName = bracket.name?.length ? bracket.name : "(no name)";
  let displayCreatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  } as any).format(new Date(bracket.createdAt));
  export let onDelete: undefined | (() => void) = undefined;
  let confirmDelete = false;

  let href = `/brackets/${bracket.slug}`;

  const CONFIRM_DELETE_TIMEOUT = 5000;
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

<!-- TODO: replace div => li -->
<div class="media bracket-index-card">
  <div class="media-content">
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
  <div class="media-right">
    <Columns smallMobileGaps>
      {#if confirmDelete}
        <Column>
          <Button
            isSmall
            on:click={() => {
              confirmDelete = false;
            }}
          >
            Cancel
          </Button>
        </Column>
      {/if}
      <Column>
        <Button
          isDelete={!confirmDelete}
          isDanger={confirmDelete}
          isSmall
          on:click={deleteWithConfirmation}
        >
          {#if confirmDelete}
            Delete this bracket!
          {/if}
        </Button>
      </Column>
    </Columns>
  </div>
</div>

<style lang="scss">
  h4 {
    font-size: 1.05rem;
    font-weight: bold;
  }
  a {
    width: min-content;
    color: inherit;
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
</style>
