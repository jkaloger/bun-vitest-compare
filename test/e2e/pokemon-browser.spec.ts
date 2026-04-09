import { test, expect } from "@playwright/test"

test.describe("Pokemon Browser", () => {
  test("home page loads and displays Pokemon list", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Pokemon Browser" })).toBeVisible()
    // Wait for Pokemon to load (first one is bulbasaur)
    await expect(page.getByText("bulbasaur")).toBeVisible({ timeout: 15_000 })
    // Verify multiple Pokemon are shown
    const cards = page.locator("[data-slot='card']")
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(1)
  })

  test("search filters Pokemon by name", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("bulbasaur")).toBeVisible({ timeout: 15_000 })

    await page.getByPlaceholder("Search Pokemon...").fill("char")
    await expect(page.getByText("charmander")).toBeVisible()
    await expect(page.getByText("bulbasaur")).not.toBeVisible()
  })

  test("clicking a Pokemon navigates to detail page with stats", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("bulbasaur")).toBeVisible({ timeout: 15_000 })

    await page.getByText("bulbasaur").click()
    await page.waitForURL("/pokemon/bulbasaur")

    // Verify stats are shown (exact match avoids "attack" matching "special attack")
    await expect(page.getByText("hp")).toBeVisible()
    await expect(page.getByText("attack", { exact: true })).toBeVisible()
    await expect(page.getByText("defense", { exact: true })).toBeVisible()
  })

  test("detail page has a back link to home", async ({ page }) => {
    await page.goto("/pokemon/bulbasaur")
    // Wait for content to load
    await expect(page.getByText("bulbasaur", { exact: false })).toBeVisible({ timeout: 15_000 })

    await page.getByRole("link", { name: /back/i }).click()
    await page.waitForURL("/")
    await expect(page.getByRole("heading", { name: "Pokemon Browser" })).toBeVisible()
  })
})
