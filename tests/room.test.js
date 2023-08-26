import { deck, Room } from '../src/room.js'
import * as mod from "https://deno.land/std@0.65.0/testing/asserts.ts";

Deno.test("deck", () => {
  const x = deck(3)

  mod.assertEquals(x.sort(), [1, 2, 2, 3, 3, 3]);
});

Deno.test("Room GameStart", () => {
  const r = new Room()

  r.users = [{ tiles: [] }, { tiles: [] }, { tiles: [] }]
  // mod.assertEquals(x.sort(), [1, 2, 2, 3, 3, 3]);
  r.GameStart()
});