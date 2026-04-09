export type PokemonType = {
  name: string;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonListItem = {
  name: string;
  types: PokemonType[];
  sprite: string;
};

export type Pokemon = {
  name: string;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: {
    front: string;
    back: string | null;
    officialArtwork: string | null;
  };
};

type ApiListResponse = {
  results: { name: string; url: string }[];
};

type ApiTypeSlot = {
  type: { name: string };
};

type ApiStat = {
  base_stat: number;
  stat: { name: string };
};

type ApiPokemonResponse = {
  name: string;
  types: ApiTypeSlot[];
  stats: ApiStat[];
  sprites: {
    front_default: string;
    back_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
};

function mapTypes(types: ApiTypeSlot[]): PokemonType[] {
  return types.map((t) => ({ name: t.type.name }));
}

function mapStats(stats: ApiStat[]): PokemonStat[] {
  return stats.map((s) => ({ name: s.stat.name, value: s.base_stat }));
}

function mapSprites(
  sprites: ApiPokemonResponse["sprites"],
): Pokemon["sprites"] {
  return {
    front: sprites.front_default,
    back: sprites.back_default,
    officialArtwork: sprites.other?.["official-artwork"]?.front_default ?? null,
  };
}

export async function fetchPokemonList(): Promise<PokemonListItem[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  if (!res.ok) throw new Error(`PokeAPI list request failed: ${res.status}`);
  const data: ApiListResponse = await res.json();

  const details = await Promise.all(
    data.results.map(async (entry) => {
      const detailRes = await fetch(entry.url);
      if (!detailRes.ok)
        throw new Error(`PokeAPI detail request failed: ${detailRes.status}`);
      const detail: ApiPokemonResponse = await detailRes.json();
      return {
        name: detail.name,
        types: mapTypes(detail.types),
        sprite: detail.sprites.front_default,
      };
    }),
  );

  return details;
}

export async function fetchPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok)
    throw new Error(`PokeAPI request for "${name}" failed: ${res.status}`);
  const data: ApiPokemonResponse = await res.json();

  return {
    name: data.name,
    types: mapTypes(data.types),
    stats: mapStats(data.stats),
    sprites: mapSprites(data.sprites),
  };
}
