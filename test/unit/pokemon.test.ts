import { describe, it, expect, spyOn, beforeEach, afterEach } from "bun:test";
import { fetchPokemonList, fetchPokemon } from "../../lib/pokemon";

const makePokemonApiResponse = (overrides: Record<string, unknown> = {}) => ({
  name: "pikachu",
  types: [{ type: { name: "electric" } }],
  stats: [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } },
  ],
  sprites: {
    front_default: "https://sprites.example.com/pikachu-front.png",
    back_default: "https://sprites.example.com/pikachu-back.png",
    other: {
      "official-artwork": {
        front_default: "https://sprites.example.com/pikachu-art.png",
      },
    },
  },
  ...overrides,
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchPokemonList", () => {
  let fetchSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    fetchSpy = spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("returns mapped list items with correct shape", async () => {
    const listResponse = {
      results: [
        { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
      ],
    };
    const detailResponse = makePokemonApiResponse();

    fetchSpy
      .mockResolvedValueOnce(jsonResponse(listResponse))
      .mockResolvedValueOnce(jsonResponse(detailResponse));

    const result = await fetchPokemonList();

    expect(result).toEqual([
      {
        name: "pikachu",
        types: [{ name: "electric" }],
        sprite: "https://sprites.example.com/pikachu-front.png",
      },
    ]);
  });

  it("calls the correct list URL", async () => {
    const listResponse = { results: [] };

    fetchSpy.mockResolvedValueOnce(jsonResponse(listResponse));

    await fetchPokemonList();

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon?limit=151",
    );
  });

  it("throws on non-OK response", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 500 }));

    expect(fetchPokemonList()).rejects.toThrow("PokeAPI list request failed: 500");
  });
});

describe("fetchPokemon", () => {
  let fetchSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    fetchSpy = spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("returns mapped Pokemon with types, stats, sprites", async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse(makePokemonApiResponse()));

    const result = await fetchPokemon("pikachu");

    expect(result).toEqual({
      name: "pikachu",
      types: [{ name: "electric" }],
      stats: [
        { name: "hp", value: 35 },
        { name: "attack", value: 55 },
      ],
      sprites: {
        front: "https://sprites.example.com/pikachu-front.png",
        back: "https://sprites.example.com/pikachu-back.png",
        officialArtwork: "https://sprites.example.com/pikachu-art.png",
      },
    });
  });

  it("correctly maps stat names and values", async () => {
    const response = makePokemonApiResponse({
      stats: [
        { base_stat: 100, stat: { name: "speed" } },
        { base_stat: 80, stat: { name: "defense" } },
        { base_stat: 45, stat: { name: "special-attack" } },
      ],
    });

    fetchSpy.mockResolvedValueOnce(jsonResponse(response));

    const result = await fetchPokemon("pikachu");

    expect(result.stats).toEqual([
      { name: "speed", value: 100 },
      { name: "defense", value: 80 },
      { name: "special-attack", value: 45 },
    ]);
  });

  it("handles missing official artwork with null fallback", async () => {
    const response = makePokemonApiResponse({
      sprites: {
        front_default: "https://sprites.example.com/front.png",
        back_default: null,
        other: {},
      },
    });

    fetchSpy.mockResolvedValueOnce(jsonResponse(response));

    const result = await fetchPokemon("missingno");

    expect(result.sprites).toEqual({
      front: "https://sprites.example.com/front.png",
      back: null,
      officialArtwork: null,
    });
  });

  it("throws on non-OK response", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 404 }));

    expect(fetchPokemon("notreal")).rejects.toThrow(
      'PokeAPI request for "notreal" failed: 404',
    );
  });
});
