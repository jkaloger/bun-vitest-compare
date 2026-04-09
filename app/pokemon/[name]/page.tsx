import Link from "next/link";
import { fetchPokemon } from "@/lib/pokemon";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function PokemonDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const pokemon = await fetchPokemon(name);

  const sprite = pokemon.sprites.front;
  const maxStat = 255;

  return (
    <main className="min-h-screen p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to list
      </Link>

      <Card className="mt-4 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{capitalize(pokemon.name)}</CardTitle>
          <div className="flex gap-2 mt-1">
            {pokemon.types.map((t) => (
              <Badge key={t.name} variant="secondary">
                {capitalize(t.name)}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <img
            src={sprite}
            alt={pokemon.name}
            width={256}
            height={256}
            style={{ imageRendering: "pixelated" }}
          />

          <div className="w-full space-y-3">
            {pokemon.stats.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">
                    {stat.name.replace("-", " ")}
                  </span>
                  <span className="font-mono">{stat.value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(stat.value / maxStat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
