"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PokemonListItem } from "@/lib/pokemon";

export function PokemonList({ pokemon }: { pokemon: PokemonListItem[] }) {
  const [search, setSearch] = useState("");

  const filtered = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-md border px-4 py-2"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((p) => (
          <Link key={p.name} href={`/pokemon/${p.name}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="capitalize">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-2">
                <img src={p.sprite} alt={p.name} width={96} height={96} />
                <div className="flex flex-wrap gap-1">
                  {p.types.map((t) => (
                    <Badge key={t.name} variant="secondary" className="capitalize">
                      {t.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
