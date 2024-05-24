const mode = new URL(window.location.href).searchParams.get("mode");

export function getGamemode(): Gamemode {
  if (mode === "debug") return "debug";

  return "default";
}
