import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { PokemonList } from "@/components/pokemon-list";

const mockPokemon = [
  {
    name: "bulbasaur",
    types: [{ name: "grass" }, { name: "poison" }],
    sprite: "https://example.com/bulbasaur.png",
  },
  {
    name: "charmander",
    types: [{ name: "fire" }],
    sprite: "https://example.com/charmander.png",
  },
  {
    name: "squirtle",
    types: [{ name: "water" }],
    sprite: "https://example.com/squirtle.png",
  },
];

describe("PokemonList", () => {
  afterEach(cleanup);

  beforeEach(() => {
    render(<PokemonList pokemon={mockPokemon} />);
  });

  it("renders all Pokemon names", () => {
    screen.getByText("bulbasaur");
    screen.getByText("charmander");
    screen.getByText("squirtle");
  });

  it("renders type badges for each Pokemon", () => {
    screen.getByText("grass");
    screen.getByText("poison");
    screen.getByText("fire");
    screen.getByText("water");
  });

  it("search input filters Pokemon by name", () => {
    const input = screen.getByPlaceholderText("Search Pokemon...");
    fireEvent.change(input, { target: { value: "char" } });

    expect(screen.getByText("charmander")).toBeDefined();
    expect(screen.queryByText("bulbasaur")).toBeNull();
    expect(screen.queryByText("squirtle")).toBeNull();
  });

  it("each Pokemon card links to its detail page", () => {
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/pokemon/bulbasaur");
    expect(hrefs).toContain("/pokemon/charmander");
    expect(hrefs).toContain("/pokemon/squirtle");
  });

  it("renders empty list when no Pokemon match search", () => {
    const input = screen.getByPlaceholderText("Search Pokemon...");
    fireEvent.change(input, { target: { value: "zzzzz" } });

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByText("bulbasaur")).toBeNull();
    expect(screen.queryByText("charmander")).toBeNull();
    expect(screen.queryByText("squirtle")).toBeNull();
  });
});
