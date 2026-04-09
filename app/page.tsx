import { fetchPokemonList } from "@/lib/pokemon"
import { PokemonList } from "@/components/pokemon-list"

export default async function Home() {
  const pokemon = await fetchPokemonList()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Pokemon Browser</h1>
      <PokemonList pokemon={pokemon} />
    </main>
  )
}
